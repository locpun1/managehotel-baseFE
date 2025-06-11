import { Alert, Box, Paper, Typography} from '@mui/material';
import SearchBar from '@/components/SearchBar';
import { useCallback, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import useAuth from '@/hooks/useAuth';
import CardInfoManager from '@/components/CardInfo/CardInfoManager';
import CardInfoStaff from '@/components/CardInfo/CardInfoStaff';
import TaskProgressStepper, { StepProps } from '@/views/DisplayRemote/components/TaskProgressStepper'; 
import { DetailedTasksApiResponse, getRoomDetailedDailyTasks, getRoomProcessSteps, UpdateTaskPayload, updateTaskStatusAPI } from '@/services/task-service';
import TaskList, { TaskListAction } from '@/views/DisplayRemote/components/TaskList';
import { useParams } from 'react-router-dom';
import { TaskItemData } from '@/types/task-types';
import { TASK_STATUS_API } from '@/constants/task';
import useNotification from '@/hooks/useNotification';
import { getProfileUserCreateTaskAttachedRoom } from '@/services/user-service';
import { UserProfile } from '@/types/users';

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
  const [searchTerm, setSearchTerm] = useState<string>('')
  const handleSearch = () => {}
  const { profile } = useAuth();
  const [stepperData, setStepperData] = useState<StepperData | null>(null);
  const [detailedTasksResponse, setDetailedTasksResponse] = useState<DetailedTasksApiResponse | null>(null);
  const [loadingTaskList, setLoadingTaskList] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingStepper, setLoadingStepper] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const notify = useNotification();
  const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
  const [errorProfile, setErrorProfile] = useState<string | null>(null)

  const fetchStepperData = useCallback(async (showLoading = true) => {
      if (!roomId) {
        setError("Room ID không hợp lệ.");
        if (showLoading) setLoadingStepper(false);
        return;
      }
      if (showLoading) setLoadingStepper(true);
      setError(null);
      try {
        const todayForAPI = new Date().toISOString().split('T')[0];
        const responseData = await getRoomProcessSteps(roomId, todayForAPI);
        console.log(responseData)
        if (responseData) {
          setStepperData(responseData);
        } else {
          throw new Error("Dữ liệu quy trình không hợp lệ từ API.");
        }
      } catch (err: any) {
        setError(err.message || "Lỗi không xác định khi tải dữ liệu phòng.");
        setStepperData(null);
      } finally {
        setLoading(false);
      }
    }, [roomId]);

  const fetchProfileUserCreatedTask = useCallback(async() => {
    if (!roomId) {
      setError("Room ID không hợp lệ.");
      return;
    }
    setErrorProfile(null)
    try {
      const res = await getProfileUserCreateTaskAttachedRoom(roomId);
      setProfileUser(res)
    } catch (error: any) {
      setErrorProfile(error.message)
      setProfileUser(null)
    }
  }, [roomId])

  useEffect(() => {
    setError(null);
    fetchStepperData();
    fetchDetailedTaskData();
    fetchProfileUserCreatedTask();
  }, [fetchStepperData]);

  const fetchDetailedTaskData = useCallback(async (showLoading = true) => {
      if (!roomId) return;
      if (showLoading) setLoadingTaskList(true);
      // setError(null); // Không reset lỗi ở đây để giữ lỗi từ fetchProcessData nếu có
      try {
        const todayForAPI = new Date().toISOString().split('T')[0];
        const responseData = await getRoomDetailedDailyTasks(roomId, todayForAPI);
        console.log(responseData)
        setDetailedTasksResponse(responseData);
      } catch (err: any) {
        setError(prevError => prevError || (err.message || "Lỗi tải công việc chi tiết."));
        console.error("Error fetching detailed tasks:", err);
        setDetailedTasksResponse(null);
      } finally {
        if (showLoading) setLoadingTaskList(false);
      }
  }, [roomId]);
  
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
          await fetchStepperData(false);
          await fetchDetailedTaskData(false);
        } else {
          throw new Error(response?.message || `Cập nhật task #${taskId} thất bại.`);
        }
      } catch (err: any) {
        notify({ message: err.message || `Lỗi khi cập nhật task #${taskId}.`, severity: 'error' });
        console.error("Error updating task status:", err);
        // Rollback TaskList
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
        <Grid container spacing={2} sx={{ m:2}}>
          <Grid size={{ xs:12, md: 9.5}}>
              <Grid container spacing={1}>
                <Grid size={{ xs: 12}}>
                    <Paper elevation={2} sx={{ padding: 1, borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                      {stepperData ? (
                        <TaskProgressStepper
                          roomNumber={stepperData.roomNumber}
                          taskTitlePrefix={stepperData.taskTitlePrefix}
                          status={stepperData.status}
                          currentDate={stepperData.currentDate}
                          steps={stepperData.steps}
                        />
                      ): (
                        <Typography sx={{ mb: 4}}>Không có thông tin quy trình cho phòng này</Typography>
                      )}
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md:4}}>
                  <Box>
                    <Paper elevation={2} sx={{ padding: 1, borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                      Mã QR của bạn
                    </Paper>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 8}}>
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
          <Grid size={{ xs:12, md: 2.5}}>
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
