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
import { TaskListDataItem } from '@/types/task-types';
import { ApiTaskStatus, TASK_STATUS_API } from '@/constants/task';
import useNotification from '@/hooks/useNotification';
import { checkout, CheckoutApiResponse, getProfileUserCreateTaskAttachedRoom } from '@/services/user-service';
import { UserProfile } from '@/types/users';
import HttpClient from '@/utils/HttpClient';
import noDataImage from '@/assets/images/no-data.png';
import DialogConfirmCheckout from '../components/DialogConfirmCheckout';

export interface StepperData {
  roomNumber: string;
  taskTitlePrefix?: string;
  status: string;
  currentDate: string;
  steps?: StepProps[];
  groupTaskName?: string;
  assignedTo?: string;
  isCheckout?:number,
  startedAt?: string,
  completedAt?: string,
}

export const ID_ROOM = 'id_room';

const StaffHome = () => {
  const { roomId } = useParams<{ roomId: string }>();
  roomId && localStorage.setItem(ID_ROOM, roomId);
  const [searchTerm, setSearchTerm] = useState<string>('')
  const handleSearch = () => { }
  const { profile } = useAuth();
  const [stepperData, setStepperData] = useState<StepperData | null>(null);
  const [detailedTasksResponse, setDetailedTasksResponse] = useState<DetailedTasksApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const notify = useNotification();
  const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
  const [errorProfile, setErrorProfile] = useState<string | null>(null)
  const [updatingTaskId, setUpdatingTaskId] = useState<string | number | null>(null);
  const [openConfirmCheckoutDialog, setOpenConfirmCheckoutDialog] = useState(false);
  const [isCheckout, setIsCheckout] = useState(0);
  
  const backendHttpUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';

  const fetchTasksForStaff = useCallback(async (showLoading = true) => {
    if (!roomId) {
      setError("Room ID không hợp lệ.");
      setLoading(false);
      return;
    }
    if (showLoading) setLoading(true);
    setError(null);
    setErrorProfile(null);
    try {
      const todayForAPI = new Date().toISOString().split('T')[0];
      const [stepperResp, tasksResp, profileResp] = await Promise.all([
        getRoomProcessSteps(roomId, todayForAPI),
        getRoomDetailedDailyTasks(roomId, todayForAPI),
        getProfileUserCreateTaskAttachedRoom(roomId)
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
      if (showLoading) setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    if (roomId) {
      fetchTasksForStaff();
    }
  }, [roomId, fetchTasksForStaff]);

  useEffect(() => {
    if (roomId && profile) {
      const checkInUrl = `${backendHttpUrl}/api/v1/room-actions/staff-checked-in`;
      HttpClient.post(checkInUrl, { roomId })
        .then(() => {
          console.log(`[StaffHome] Successfully checked in for room ${roomId}.`);
        })
        .catch(err => {
          console.error(`[StaffHome] Failed to check in for room ${roomId}:`, err);
        });
    }
  }, [roomId, profile, backendHttpUrl]);

  const handleTaskAction = async (taskId: string | number, action: TaskListAction) => {
    if (!roomId || !profile?.id) {
      notify({ message: !roomId ? "Room ID không hợp lệ." : "Không thể xác định người dùng. Vui lòng đăng nhập lại.", severity: 'error' });
      return;
    }

    setUpdatingTaskId(taskId); // Đánh dấu task đang được update
    setError(null);

    // 1. LƯU TRẠNG THÁI GỐC ĐỂ ROLLBACK
    const originalDetailedTasksState = detailedTasksResponse
      ? (JSON.parse(JSON.stringify(detailedTasksResponse)) as DetailedTasksApiResponse)
      : null;
    const originalStepperDataState = stepperData
      ? (JSON.parse(JSON.stringify(stepperData)) as StepperData)
      : null;
    const taskToUpdateInList = originalDetailedTasksState?.tasks?.find(t => t.id === taskId);

    if (!taskToUpdateInList) {
      console.error(`Task with id ${taskId} not found in detailedTasksResponse for optimistic update.`);
      setUpdatingTaskId(null);
      return;
    }

    // 2. OPTIMISTIC UPDATE CHO TASKLIST
    let optimisticallyUpdatedTaskList = originalDetailedTasksState?.tasks || [];
    let newStatusForOptimisticUpdate: TaskListDataItem['status'] = taskToUpdateInList.status;

    const taskStatus = taskToUpdateInList.status.toLowerCase() as ApiTaskStatus;
    switch (action) {
      case 'start': {
        const validStatuses: ApiTaskStatus[] = [TASK_STATUS_API.PENDING, TASK_STATUS_API.WAITING];
        if (validStatuses.includes(taskStatus)) {
          newStatusForOptimisticUpdate = TASK_STATUS_API.IN_PROGRESS;
        }
        break;
      }
      case 'completed': {
        const validStatuses: ApiTaskStatus[] = [TASK_STATUS_API.PENDING, TASK_STATUS_API.IN_PROGRESS];
        if (validStatuses.includes(taskStatus)) {
          newStatusForOptimisticUpdate = TASK_STATUS_API.COMPLETED;
        }
        break;
      }
      case 'cancel': {
        const validStatuses: ApiTaskStatus[] = [TASK_STATUS_API.IN_PROGRESS, TASK_STATUS_API.WAITING];
        if (validStatuses.includes(taskStatus)) {
          newStatusForOptimisticUpdate = TASK_STATUS_API.PENDING;
        }
        break;
      }
    }

    if (newStatusForOptimisticUpdate !== taskToUpdateInList.status) {
      optimisticallyUpdatedTaskList = optimisticallyUpdatedTaskList.map(t =>
        t.id === taskId ? { ...t, status: newStatusForOptimisticUpdate } : t
      );
      setDetailedTasksResponse(prev => prev ? { ...prev, tasks: optimisticallyUpdatedTaskList } : null);
    }


    // 3. (TÙY CHỌN NHƯNG NÊN CÓ) OPTIMISTIC UPDATE CHO STEPPERDATA
    const taskDefinitionInStepper = originalStepperDataState?.steps?.find(
      (step: StepProps) => step.name === taskToUpdateInList.title && taskToUpdateInList.order_in_process === step.order_in_process
    );

    if (taskDefinitionInStepper && originalStepperDataState && originalStepperDataState.steps) {
      let tempStepperSteps = [...originalStepperDataState.steps];
      let newOverallStatus = originalStepperDataState.status;

      tempStepperSteps = tempStepperSteps.map((step, index) => {
        if (step.name === taskToUpdateInList.title && taskToUpdateInList.order_in_process === step.order_in_process) {
          let newCompletedTime: string | null = step.completedTime ?? null;
          let newIsCurrent = step.isCurrent;

          if (action === 'start' && newStatusForOptimisticUpdate === TASK_STATUS_API.IN_PROGRESS) {
            newCompletedTime = null;
            newIsCurrent = true;
          } else if (action === 'completed' && newStatusForOptimisticUpdate === TASK_STATUS_API.COMPLETED) {
            newCompletedTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
            newIsCurrent = false;
          } else if (action === 'cancel' && newStatusForOptimisticUpdate === TASK_STATUS_API.PENDING) {
            newCompletedTime = null;
            newIsCurrent = false;
          }
          return { ...step, completedTime: newCompletedTime, isCurrent: newIsCurrent };
        }
        if (action === 'start' && newStatusForOptimisticUpdate === TASK_STATUS_API.IN_PROGRESS) {
          return { ...step, isCurrent: false };
        }
        return step;
      });

      if (action === 'completed' || (action === 'cancel' && newStatusForOptimisticUpdate === TASK_STATUS_API.PENDING)) {
        let foundNextCurrent = false;
        for (let i = 0; i < tempStepperSteps.length; i++) {
          if (!tempStepperSteps[i].completedTime) {
            if (!foundNextCurrent) {
              tempStepperSteps[i].isCurrent = true;
              foundNextCurrent = true;
            } else {
              tempStepperSteps[i].isCurrent = false;
            }
          } else {
            tempStepperSteps[i].isCurrent = false;
          }
        }
        if (!foundNextCurrent && tempStepperSteps.length > 0) {
          tempStepperSteps.forEach(s => s.isCurrent = false);
        }
      }

      const completedCount = tempStepperSteps.filter(s => !!s.completedTime && s.completedTime !== "Hoàn thành").length;
      const inProgressActive = tempStepperSteps.some(s => s.isCurrent);

      if (inProgressActive) newOverallStatus = "Hoạt động";
      else if (completedCount === tempStepperSteps.length && tempStepperSteps.length > 0) newOverallStatus = "Hoàn thành";
      else if (completedCount > 0) newOverallStatus = "Hoạt động";
      else newOverallStatus = "Chưa làm";

      setStepperData(prev => prev ? { ...prev, steps: tempStepperSteps, status: newOverallStatus, assignedTo: profile?.full_name || prev.assignedTo } : null);
    }

    const payload: UpdateTaskPayload = { action, userId: profile.id };
    try {
      const response = await updateTaskStatusAPI(taskId, payload);
      if (response && response.success && response.data) {
        notify({ message: `Công việc ${response.data.title} (đã được ${action})`, severity: 'success' });
        await fetchTasksForStaff(false);
      } else {
        throw new Error(response?.message || `Cập nhật task #${taskId} thất bại.`);
      }
    } catch (err: any) {
      notify({ message: err.message || `Lỗi khi cập nhật task #${taskId}.`, severity: 'error' });
      if (originalDetailedTasksState) setDetailedTasksResponse(originalDetailedTasksState);
      if (originalStepperDataState) setStepperData(originalStepperDataState);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  useEffect(() => {
    if (roomId && profile) {
      const checkInUrl = `${backendHttpUrl}/api/v1/room-actions/staff-checked-in`;

      HttpClient.post(checkInUrl, { roomId })
        .then(() => {
          console.log(`[StaffHome] Successfully checked in for room ${roomId}.`);
        })
        .catch(err => {
          console.error(`[StaffHome] Failed to check in for room ${roomId}:`, err);
        });
    }
  }, [roomId, profile, backendHttpUrl]);

  const handleComplete = async() => {
    try {
      if(!roomId){
        setError("Room ID không hợp lệ.");
        return;
      }
      const todayForAPI = new Date().toISOString().split('T')[0];
      const res = await checkout(roomId, todayForAPI);
      const data = res as any as CheckoutApiResponse;
      setIsCheckout(data.data.is_checkout);
      setOpenConfirmCheckoutDialog(true)
    } catch (error) {
      notify({
        message:'Chấm công thất bại',
        severity:'error'
      })
    }
    
  }

  const totalMinutes = detailedTasksResponse && detailedTasksResponse.tasks.reduce((sum, task) => {
    const minutes = parseInt(task.durationText?.match(/\d+/)?.[0] || "0", 10);
    return sum + minutes;
  },0);


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
              <Grid size={{ xs: 12, md: 12 }}>
                <Box>
                  <Paper sx={{ padding: 1, borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                    <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                      Danh sách công việc
                    </Typography>
                    {stepperData && detailedTasksResponse && detailedTasksResponse.tasks.length > 0 ? (
                      <>
                        <TaskList
                          tasks={detailedTasksResponse.tasks}
                          onTaskAction={handleTaskAction} 
                          onCompleteAll={handleComplete}
                          isCheckout={isCheckout || stepperData.isCheckout}
                        />
                      </>
                    ) : (
                      <Paper elevation={0} sx={{ textAlign: 'center', borderRadius: '12px', backgroundColor: 'transparent', width: '100%' }}>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Box
                            component="img"
                            src={noDataImage}
                            alt="Không có dữ liệu"
                            sx={{
                              width: '100%',
                              maxWidth: { xs: '273px', md: '273px' },
                              height: 'auto',
                              opacity: 0.7,
                            }}
                          />
                          <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                            Chưa có dữ liệu công việc!
                          </Typography>
                        </Box>
                      </Paper>
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
      {openConfirmCheckoutDialog && totalMinutes && stepperData && (
        <DialogConfirmCheckout
          open={openConfirmCheckoutDialog}
          total={totalMinutes}
          roomName={stepperData.roomNumber}
          handleClose={() => {
            setOpenConfirmCheckoutDialog(false)
          }}
        />
      )}
    </Box>
  );
};

export default StaffHome;
