import {
  Box,
  Typography,
  Container,
  Paper,
} from '@mui/material';
import TaskProgressStepper, { StepProps } from './components/TaskProgressStepper';
import { useParams } from 'react-router-dom';
import TaskList, { TaskListAction } from './components/TaskList';
import { useCallback, useEffect, useState } from 'react';
import { DetailedTasksApiResponse, getRoomDetailedDailyTasks, getRoomProcessSteps, UpdateTaskPayload, updateTaskStatusAPI } from '@/services/task-service';
import useNotification from '@/hooks/useNotification';
import { TaskItemData } from '@/types/task-types';
import { TASK_STATUS_API } from '@/constants/task';


interface StepperData {
  roomNumber: string;
  taskTitlePrefix?: string;
  status: string;
  currentDate: string;
  steps?: StepProps[];
}

const today = new Date().toLocaleDateString('vi-VN');

const handleCompleteAll = () => {
  console.log("Complete all tasks");
};

const getStatusChipColorForTable = (status: string): 'success' | 'warning' | 'default' | 'error' | 'info' => {
  if (status === 'Hoàn thành') return 'success';
  if (status === 'Đang làm') return 'warning';
  if (status === 'Chưa làm') return 'default';
  if (status === 'Quá hạn') return 'error';
  return 'info';
};


const RoomDisplayPageStatic = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [stepperData, setStepperData] = useState<StepperData | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [detailedTasksResponse, setDetailedTasksResponse] = useState<DetailedTasksApiResponse | null>(null);

  const [loadingStepper, setLoadingStepper] = useState<boolean>(true);
  const [loadingTaskList, setLoadingTaskList] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const notify = useNotification();

  const fetchStepperData = useCallback(async (showLoading = true) => {
    if (!roomId) {
      setError("Room ID không hợp lệ.");
      if(showLoading) setLoadingStepper(false);
      return;
    }
    if(showLoading) setLoadingStepper(true);
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

  const fetchDetailedTaskData = useCallback(async (showLoading = true) => {
    if (!roomId) return;
    if(showLoading) setLoadingTaskList(true);
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
      if(showLoading) setLoadingTaskList(false);
    }
  }, [roomId]);

  useEffect(() => {
    setError(null);
    fetchStepperData();
    fetchDetailedTaskData();
  }, [fetchStepperData,fetchDetailedTaskData]);

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
    <Container sx={{ py: { xs: 2, md: 3 }, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
     {stepperData ? (
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
         <TaskProgressStepper
            roomNumber={stepperData.roomNumber}
            taskTitlePrefix={stepperData.taskTitlePrefix}
            status={stepperData.status}
            currentDate={stepperData.currentDate}
            steps={stepperData.steps}
          />
        </Box>
      ) : (
        <Typography sx={{mb: 4}}>Không có thông tin quy trình cho phòng này.</Typography>
      )}

      <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
        Danh sách công việc
      </Typography>
      {detailedTasksResponse && detailedTasksResponse.tasks.length > 0 ? (
        <>
          <TaskList
              tasks={detailedTasksResponse.tasks}
              onTaskAction={handleTaskAction}
              onCompleteAll={handleCompleteAll}
          />
        </>
      ) : (
         !loadingTaskList && <Paper elevation={1} sx={{ p: 2, textAlign: 'center', borderRadius: '12px' }}>
            <Typography color="text.secondary">Không có công việc chi tiết nào được tìm thấy.</Typography>
          </Paper>
      )}
    </Container>
  );
};

export default RoomDisplayPageStatic;