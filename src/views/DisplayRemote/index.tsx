import {
  Box,
  Typography,
  Container,
  Paper,
} from '@mui/material';
import TaskProgressStepper, { StepProps } from './components/TaskProgressStepper';
import { useParams } from 'react-router-dom';
import TaskList from './components/TaskList';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DetailedTasksApiResponse, getRoomDetailedDailyTasks, getRoomProcessSteps } from '@/services/task-service';
import useNotification from '@/hooks/useNotification';
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

  const staffRoomLink = `${window.location.origin}/staff/home/${roomId}?triggeringDeviceId=${deviceId}`;

  const fetchStepperData = useCallback(async (showLoading = true) => {
    if (!roomId) {
      setError("Room ID không hợp lệ.");
      if (showLoading) setLoadingStepper(false);
      return;
    }
    if (showLoading) setLoadingStepper(true);
    if(showLoading) setError(null);
    try {
      const todayForAPI = new Date().toISOString().split('T')[0];
      const responseData = await getRoomProcessSteps(roomId, todayForAPI);
      if (responseData) {
        setStepperData(responseData);
      } else {
        throw new Error("Dữ liệu quy trình không hợp lệ từ API.");
      }
    } catch (err: any) {
      setError(err.message || "Lỗi không xác định khi tải dữ liệu phòng.");
      setStepperData(null);
    } finally {
      if (showLoading) setLoadingTaskList(false);
    }
  }, [roomId]);

  const fetchDetailedTaskData = useCallback(async (showLoading = true) => {
    if (!roomId) return;
    if (showLoading) setLoadingTaskList(true);
    // setError(null); // Không reset lỗi ở đây để giữ lỗi từ fetchProcessData nếu có
    try {
      const todayForAPI = new Date().toISOString().split('T')[0];
      const responseData = await getRoomDetailedDailyTasks(roomId, todayForAPI);
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
    if (roomId) {
        setError(null); 
        fetchStepperData(true); 
    }
  }, [roomId, fetchStepperData]);

  useEffect(() => {
    if (!roomId || !deviceId) {
      console.warn("[WebSocket] Room ID or Device ID is missing, WebSocket connection not started.");
      return;
    }

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    let wsHost = window.location.hostname;
    let wsPort = window.location.port; 

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

    let socket: WebSocket | null = null;
    let reconnectIntervalId: NodeJS.Timeout | null = null;
    let isComponentMounted = true;

    const connect = () => {
      if (!isComponentMounted) return; 
      if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
        return;
      }

      socket = new WebSocket(wsUrl);
      const currentSocket = socket;

      currentSocket.onopen = () => {
        if (!isComponentMounted || currentSocket !== socket) return;
        console.log(`[WebSocket] Connected: ${deviceId}, room: ${roomId}`);
        setIsSocketConnected(true);
        if (reconnectIntervalId) clearTimeout(reconnectIntervalId);
      };

      socket.onopen = () => {
        setIsSocketConnected(true);
        if (reconnectIntervalId) clearTimeout(reconnectIntervalId);
      };

      socket.onmessage = (event) => {
        try {
          const messageData = JSON.parse(event.data as string);
          if (messageData.action === 'REFRESH_DETAILED_TASKS' && messageData.targetRoomId === roomId) {
            fetchDetailedTaskData(true);
            fetchStepperData(false); 
          }
        } catch (e) {
          console.error("[WebSocket] Error parsing message or invalid message format:", e);
        }
      };

      socket.onerror = (errorEvent) => {
        console.error(`[WebSocket] Error for ${deviceId}:`, errorEvent);
      };

      socket.onclose = (event) => {
        setIsSocketConnected(false);
        if (reconnectIntervalId) clearTimeout(reconnectIntervalId);
        if (event.code !== 1000 && event.code !== 1001 /* Going Away */) {
          reconnectIntervalId = setTimeout(connect, 5000 + Math.random() * 3000);
        }
      };
    };

    connect(); 

    return () => { 
      isComponentMounted = false;
      if (reconnectIntervalId) clearTimeout(reconnectIntervalId);
      if (socket) {
        socket.onopen = null;
        socket.onmessage = null;
        socket.onerror = null;
        socket.onclose = null;
        if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
          socket.close(1000, "Component unmounting");
        }
        socket = null;
      }
    };
  }, [roomId, deviceId, fetchDetailedTaskData]);

  return (
    <Container sx={{ py: { xs: 2, md: 3 }, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Box>
        {isSocketConnected && !error && ( 
          <Paper elevation={1} sx={{ p: 3, textAlign: 'center', borderRadius: '12px', mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Quét mã này để tải hoặc làm mới danh sách công việc chi tiết.
            </Typography>
            <QRCodeCanvas value={staffRoomLink} size={180} level="H" />
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