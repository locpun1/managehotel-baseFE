import {
  Box,
  Typography,
  Container,
  Paper,
} from '@mui/material';
import TaskProgressStepper, { StepProps } from './components/TaskProgressStepper';
import { useParams } from 'react-router-dom';
import TaskList, { TaskListAction } from './components/TaskList';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DetailedTasksApiResponse, getRoomDetailedDailyTasks, getRoomProcessSteps, UpdateTaskPayload, updateTaskStatusAPI } from '@/services/task-service';
import useNotification from '@/hooks/useNotification';
import { TaskItemData } from '@/types/task-types';
import { TASK_STATUS_API } from '@/constants/task';
import CardInfoManager from '@/components/CardInfo/CardInfoManager';
import { QRCodeCanvas } from 'qrcode.react';
import { v4 as uuidv4 } from 'uuid';

const LOCAL_STORAGE_DEVICE_ID_KEY = 'hotel_display_device_id_v1';

interface StepperData {
  roomNumber: string;
  taskTitlePrefix?: string;
  status: string;
  currentDate: string;
  steps?: StepProps[];
}

const handleCompleteAll = () => {
  console.log("Complete all tasks");
};

const RoomDisplayPageStatic = () => {

  const { roomId } = useParams<{ roomId: string }>();
  const [stepperData, setStepperData] = useState<StepperData | null>(null);
  const deviceId = useMemo(() => {
    let storedDeviceId = localStorage.getItem(LOCAL_STORAGE_DEVICE_ID_KEY);
    if (!storedDeviceId) {
      storedDeviceId = uuidv4();
      localStorage.setItem(LOCAL_STORAGE_DEVICE_ID_KEY, storedDeviceId);
    } else {
      console.log('[DeviceID] Using existing device ID:', storedDeviceId);
    }
    return storedDeviceId;
  }, []);
  const [loading, setLoading] = useState<boolean>(true);
  const [detailedTasksResponse, setDetailedTasksResponse] = useState<DetailedTasksApiResponse | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [loadingStepper, setLoadingStepper] = useState<boolean>(true);
  const [loadingTaskList, setLoadingTaskList] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const notify = useNotification();

  const backendHttpUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';
  const qrTriggerUrl = `${backendHttpUrl}/api/v1/room-actions/trigger-task-refresh?deviceId=${deviceId}&roomId=${roomId}`;

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

  useEffect(() => {
    setError(null);
    fetchStepperData();
  }, [fetchStepperData]);

  useEffect(() => {
    if (!roomId || !deviceId) {
      console.warn("[WebSocket] Room ID or Device ID is missing, WebSocket connection not started.");
      return;
    }

    // Xác định URL cho WebSocket server
    // Ví dụ: ws://localhost:3002/ws (nếu backend HTTP và WS cùng port)
    // Hoặc ws://your-ws-server.com (nếu WS server riêng)
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // Mặc định là cùng hostname với frontend, nhưng port có thể là của backend
    let wsHost = window.location.hostname;
    let wsPort = window.location.port; // Port của frontend

    // Nếu VITE_API_BASE_URL được định nghĩa và khác với origin hiện tại, dùng nó
    if (import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL !== window.location.origin) {
      try {
        const backendUrl = new URL(import.meta.env.VITE_API_BASE_URL);
        wsHost = backendUrl.hostname;
        wsPort = backendUrl.port || (backendUrl.protocol === 'https:' ? '443' : '80');
      } catch (e) {
        console.error("Invalid VITE_API_BASE_URL for WebSocket:", import.meta.env.VITE_API_BASE_URL);
      }
    } else if (import.meta.env.VITE_BACKEND_PORT) {
      wsPort = import.meta.env.VITE_BACKEND_PORT;
    }
    // Nếu đang dev và backend chạy ở port khác (ví dụ 3002)
    // if (process.env.NODE_ENV === 'development' && !import.meta.env.VITE_WS_BASE_URL) {
    //    wsPort = '3002'; // Cổng backend của bạn
    // }

    const wsUrl = `${wsProtocol}//${wsHost}:${wsPort}/ws?deviceId=${deviceId}&roomId=${roomId}`;
    console.log(`[WebSocket] Attempting to connect to: ${wsUrl}`);


    let socket: WebSocket | null = null;
    let reconnectIntervalId: NodeJS.Timeout | null = null;

    const connect = () => {
      if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
        return; // Đã kết nối hoặc đang kết nối
      }

      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log(`[WebSocket] Connected for device: ${deviceId}, room: ${roomId}`);
        setIsSocketConnected(true);
        if (reconnectIntervalId) clearTimeout(reconnectIntervalId);
      };

      socket.onmessage = (event) => {
        try {
          const messageData = JSON.parse(event.data as string);
          console.log("[WebSocket] Message received:", messageData);
          if (messageData.action === 'REFRESH_DETAILED_TASKS' && messageData.targetRoomId === roomId) {
            console.log(`[WebSocket] Command REFRESH_DETAILED_TASKS received for current room. Fetching tasks...`);
            fetchDetailedTaskData();
          }
        } catch (e) {
          console.error("[WebSocket] Error parsing message or invalid message format:", e);
        }
      };

      socket.onerror = (errorEvent) => {
        console.error(`[WebSocket] Error for ${deviceId}:`, errorEvent);
        // onclose sẽ thường được gọi sau onerror
      };

      socket.onclose = (event) => {
        console.log(`[WebSocket] Disconnected for ${deviceId}. Code: ${event.code}, Reason: '${event.reason}'.`);
        setIsSocketConnected(false);
        if (reconnectIntervalId) clearTimeout(reconnectIntervalId);
        // Chỉ thử kết nối lại nếu không phải là đóng chủ động từ client (ví dụ, component unmount)
        // và không phải lỗi quá nghiêm trọng (một số mã lỗi đóng có thể không nên reconnect)
        if (event.code !== 1000 && event.code !== 1001 /* Going Away */) {
          console.log("[WebSocket] Attempting to reconnect in 5-8 seconds...");
          reconnectIntervalId = setTimeout(connect, 5000 + Math.random() * 3000); // Thêm jitter
        }
      };
    };

    connect(); // Bắt đầu kết nối

    return () => { // Cleanup khi component unmount
      if (reconnectIntervalId) clearTimeout(reconnectIntervalId);
      if (socket) {
        console.log(`[WebSocket] Closing connection on unmount for ${deviceId}`);
        socket.onclose = null; // Ngăn chặn việc tự động reconnect khi unmount
        socket.close(1000, "Component unmounting"); // Mã 1000 là Normal Closure
      }
    };
  }, [roomId, deviceId, fetchDetailedTaskData]);

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
      <Box>
        {isSocketConnected && !error && ( 
          <Paper elevation={1} sx={{ p: 3, textAlign: 'center', borderRadius: '12px', mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Quét mã này để tải hoặc làm mới danh sách công việc chi tiết.
            </Typography>
            <QRCodeCanvas value={qrTriggerUrl} size={180} level="H" />
          </Paper>
        )}
        {!isSocketConnected && !error && ( 
          <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
            Đang chờ kết nối tới máy chủ để có thể làm mới công việc qua QR...
          </Typography>
        )}
      </Box>
      <Box>
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
          <Typography sx={{ mb: 4 }}>Không có thông tin quy trình cho phòng này.</Typography>
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
      </Box>
      <Box>
        {/* <CardInfoManager
          data={profile}
        /> */}
      </Box>
    </Container>
  );
};

export default RoomDisplayPageStatic;