import { Alert, Box, Paper, Typography } from '@mui/material';
import SearchBar from '@/components/SearchBar';
import { useCallback, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import useAuth from '@/hooks/useAuth';
import CardInfoManager from '@/components/CardInfo/CardInfoManager';
import CardInfoStaff from '@/components/CardInfo/CardInfoStaff';
import TaskProgressStepper, { StepProps } from '@/views/DisplayRemote/components/TaskProgressStepper';
import { DetailedTasksApiResponse, getRoomDetailedDailyTasks, getRoomProcessSteps, UpdateTaskPayload, updateTaskStatusAPI } from '@/services/task-service';
import TaskList, { TaskListAction } from '@/views/DisplayRemote/components/TaskList';
import { useParams, useSearchParams } from 'react-router-dom';
import { TaskItemData } from '@/types/task-types';
import { TASK_STATUS_API } from '@/constants/task';
import useNotification from '@/hooks/useNotification';
import { getProfileUserCreateTaskAttachedRoom } from '@/services/user-service';
import { UserProfile } from '@/types/users';
import HttpClient from '@/utils/HttpClient';

export interface StepperData {
  roomNumber: string;
  taskTitlePrefix?: string;
  status: string;
  currentDate: string;
  steps?: StepProps[];
  groupTaskName?: string;
}

export const ID_ROOM = 'id_room';

const StaffHome = () => {
  const { roomId } = useParams<{ roomId: string }>();
  roomId && localStorage.setItem(ID_ROOM, roomId);
  const [searchParams] = useSearchParams();
  const triggeringDeviceId = searchParams.get('triggeringDeviceId');
  const [searchTerm, setSearchTerm] = useState<string>('')
  const handleSearch = () => { }
  const { profile } = useAuth();
  const [stepperData, setStepperData] = useState<StepperData | null>(null);
  const [detailedTasksResponse, setDetailedTasksResponse] = useState<DetailedTasksApiResponse | null>(null);
  const [loadingTaskList, setLoadingTaskList] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const notify = useNotification();
  const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
  const [errorProfile, setErrorProfile] = useState<string | null>(null)

  const backendHttpUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';

  const fetchTasksForStaff = useCallback(async (showLoading = true) => {
    if (!roomId) {
      setError("Room ID không hợp lệ.");
      setLoading(false);
      return;
    }
    if(showLoading) setLoading(true);
    setError(null);
    setErrorProfile(null); // Reset lỗi profile nữa
    try {
      const todayForAPI = new Date().toISOString().split('T')[0];
      // Chạy song song để tăng tốc độ
      const [stepperResp, tasksResp, profileResp] = await Promise.all([
        getRoomProcessSteps(roomId, todayForAPI),
        getRoomDetailedDailyTasks(roomId, todayForAPI),
        getProfileUserCreateTaskAttachedRoom(roomId) // Fetch profile người tạo/giao task cho phòng này
      ]);

      setStepperData(stepperResp || null);
      setDetailedTasksResponse(tasksResp || null);
      setProfileUser(profileResp || null);

    } catch (err: any) {
      setError(err.message || "Lỗi không xác định khi tải dữ liệu.");
      console.error("Error fetching data for staff page:", err);
      // Reset các state khác nếu cần
      setStepperData(null);
      setDetailedTasksResponse(null);
      setProfileUser(null);
    } finally {
      if(showLoading) setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    if (roomId) {
      fetchTasksForStaff();
    }
  }, [roomId, fetchTasksForStaff]);

  useEffect(() => {
    if (triggeringDeviceId && roomId) {
      console.log(`[StaffPage] Page loaded. Attempting to trigger refresh for TV device: ${triggeringDeviceId} for room ${roomId}`);
      const triggerUrl = `${backendHttpUrl}/api/v1/room-actions/trigger-task-refresh?deviceId=${triggeringDeviceId}&roomId=${roomId}`;
      HttpClient.post(triggerUrl, {}) // Hoặc GET
        .then(() => {
          console.log(`[StaffPage] Refresh trigger sent to TV device ${triggeringDeviceId}.`);
          // Không cần thông báo cho nhân viên ở đây, vì đây là hành động nền
        })
        .catch((triggerError: any) => {
          console.error("[StaffPage] Failed to send initial refresh trigger to TV:", triggerError);
          // Có thể thông báo lỗi nhẹ nhàng nếu cần, nhưng không làm gián đoạn nhân viên
          // notify({ message: `Không thể tự động làm mới màn hình TV: ${triggerError.message}`, severity: 'warning' });
        });
    }
  }, [triggeringDeviceId, roomId, backendHttpUrl]);

  const handleCompleteAll = () => {
    console.log("Complete all tasks");
  };

  const handleTaskAction = async (
    taskId: string | number,
    action: TaskListAction
  ) => {
    if (!roomId || !detailedTasksResponse) return;

    const originalTasks = [...detailedTasksResponse.tasks];
    const taskIndex = originalTasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;
    const originalTask = { ...originalTasks[taskIndex] };

    let newStatusForOptimisticUpdate: TaskItemData['status'] = originalTask.status;
    let newStartTimeForOptimisticUpdate: string | undefined = originalTask.startTime;
    switch (action) {
      case 'start': newStatusForOptimisticUpdate = TASK_STATUS_API.IN_PROGRESS; newStartTimeForOptimisticUpdate = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false }); break;
      case 'completed': newStatusForOptimisticUpdate = TASK_STATUS_API.COMPLETED; break;
      case 'cancel': newStatusForOptimisticUpdate = TASK_STATUS_API.PENDING; newStartTimeForOptimisticUpdate = "00:00"; break;
    }

    const optimisticallyUpdatedTasks = originalTasks.map(t =>
      t.id === taskId ? { ...t, status: newStatusForOptimisticUpdate, startTime: newStartTimeForOptimisticUpdate } : t
    );
    setDetailedTasksResponse(prev => prev ? { ...prev, tasks: optimisticallyUpdatedTasks } : null);

    setError(null);
    const payload: UpdateTaskPayload = { action };
    try {
      const response = await updateTaskStatusAPI(taskId, payload);
      if (response && response.success && response.data) {
        notify({ message: `Task #${taskId} được cập nhật thành công.`, severity: 'success' });
        await fetchTasksForStaff(false);
        if (triggeringDeviceId && roomId) {
          const triggerUrl = `${backendHttpUrl}/api/v1/room-actions/trigger-task-refresh?deviceId=${triggeringDeviceId}&roomId=${roomId}`;
          HttpClient.post(triggerUrl, {}).catch(e => console.error("Error re-triggering TV refresh:", e));
        }
      } else {
        throw new Error(response?.message || `Cập nhật task #${taskId} thất bại.`);
      }
    } catch (err: any) {
      notify({ message: err.message || `Lỗi khi cập nhật task #${taskId}.`, severity: 'error' });
      setDetailedTasksResponse(prev => prev ? { ...prev, tasks: originalTasks } : null);
      // TODO: Rollback cả StepperData nếu đã cập nhật lạc quan
      // await fetchStepperData(false); // Hoặc fetch lại stepper để lấy trạng thái đúng từ server
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SearchBar
        onSearch={handleSearch}
        placeholder="Tìm kiếm"
        initialValue={searchTerm}

      />
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Grid container spacing={2} sx={{ m: 2 }}>
          <Grid size={{ xs: 12, md: 9.5 }}>
            <Grid container spacing={1}>
              <Grid size={{ xs: 12 }}>
                <>
                  {stepperData ? (
                    <TaskProgressStepper
                      roomNumber={stepperData.roomNumber}
                      taskTitlePrefix={stepperData.taskTitlePrefix}
                      status={stepperData.status}
                      currentDate={stepperData.currentDate}
                      steps={stepperData.steps}
                    />
                  ) : (
                    <Typography sx={{ mb: 4 }}>Không có thông tin quy trình cho phòng này</Typography>
                  )}
                </>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box>
                  <Paper elevation={2} sx={{ padding: 1, borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                    Mã QR của bạn
                  </Paper>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <Box>
                  <Paper elevation={2} sx={{ padding: 1, borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                    <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                      Danh sách công việc
                    </Typography>
                    {detailedTasksResponse && detailedTasksResponse.tasks.length > 0 ? (
                      <TaskList
                        tasks={detailedTasksResponse.tasks}
                        onTaskAction={handleTaskAction}
                        onCompleteAll={handleCompleteAll}
                      />
                    ) : (
                      !loadingTaskList && <Typography color="text.secondary">Không có công việc chi tiết nào được tìm thấy.</Typography>
                    )}
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid size={{ xs: 12, md: 2.5 }}>
            {errorProfile && (
              <Alert severity='error' sx={{ my: 2 }}>{errorProfile}</Alert>
            )}
            {!errorProfile && profileUser &&
              <CardInfoManager
                data={profileUser}
              />
            }
            {profile && stepperData &&
              <CardInfoStaff
                data={profile}
                stepperData={stepperData}
              />
            }
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default StaffHome;
