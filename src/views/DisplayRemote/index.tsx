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
import { QRCodeCanvas } from 'qrcode.react';
import { v4 as uuidv4 } from 'uuid';
import noDataImage from '@/assets/images/no-data.png';
import CardInfoManager from '@/components/CardInfo/CardInfoManager';
import { UserProfile } from '@/types/users';
import { getProfileUserCreateTaskAttachedRoom } from '@/services/user-service';
import CardInfoStaff from '@/components/CardInfo/CardInfoStaff';

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
  const [error, setError] = useState<string | null>(null);
  const [profileManager, setProfileManager] = useState<UserProfile | null>(null);
  const [profileStaff, setProfileStaff] = useState<UserProfile | null>(null);

  const staffRoomLink = `${window.location.origin}/staff/home/${roomId}`;

  const fetchInitialData = useCallback(async () => {
    if (!roomId) {
      setError("Room ID không hợp lệ.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const todayForAPI = new Date().toISOString().split('T')[0];
      const [stepperResp, profileResp] = await Promise.all([
        getRoomProcessSteps(roomId, todayForAPI),
        getProfileUserCreateTaskAttachedRoom(roomId)
      ]);
      setStepperData(stepperResp || null);
      setProfileManager(profileResp || null);
    } catch (err: any) {
      setError(err.message || "Lỗi khi tải dữ liệu ban đầu.");
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  const fetchDetailedTaskData = useCallback(async () => {
    if (!roomId) return;
    try {
      const todayForAPI = new Date().toISOString().split('T')[0];
      const responseData = await getRoomDetailedDailyTasks(roomId, todayForAPI);
      setDetailedTasksResponse(responseData);
    } catch (err: any) {
      console.error("Lỗi tải công việc chi tiết:", err);
    }
  }, [roomId]);

  const refreshStepperData = useCallback(async () => {
    if (!roomId) return;
    try {
      const todayForAPI = new Date().toISOString().split('T')[0];
      setStepperData(await getRoomProcessSteps(roomId, todayForAPI));
    } catch (err) {
      console.error("Lỗi làm mới quy trình:", err);
    }
  }, [roomId]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    if (!roomId || !deviceId) return;

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
    const wsUrl = `${wsProtocol}//${wsHost}:${wsPort}/ws?deviceId=${deviceId}&roomId=${roomId}`;

    let socket: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;
    let isComponentMounted = true;

    const connect = () => {
      if (!isComponentMounted) return;
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        if (!isComponentMounted) return;
        setIsSocketConnected(true);
        if (reconnectTimeout) {
          clearTimeout(reconnectTimeout);
          reconnectTimeout = null;
        }
      };

      socket.onmessage = (event) => {
        if (!isComponentMounted) return;
        try {
          const messageData = JSON.parse(event.data as string);
          if (messageData.targetRoomId !== roomId) return;

          switch (messageData.action) {
            case 'STAFF_INFO_UPDATE':
              setProfileStaff(messageData.payload as UserProfile);
              break;
            case 'REFRESH_DETAILED_TASKS':
              fetchDetailedTaskData();
              break;
            case 'REFRESH_DATA':
              fetchDetailedTaskData();
              refreshStepperData();
              break;
          }
        } catch (e) {
           console.error("[WebSocket] Error parsing message:", e);
        }
      };

      socket.onclose = (event) => {
        if (!isComponentMounted) return;
        setIsSocketConnected(false);
        if (event.code !== 1000 && !reconnectTimeout) {
          reconnectTimeout = setTimeout(connect, 5000);
        }
      };

      socket.onerror = (err) => {
        console.error("[WebSocket] Error:", err);
        socket?.close();
      };
    };

    connect();

    return () => {
      isComponentMounted = false;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (socket) {
        socket.onopen = null;
        socket.onmessage = null;
        socket.onclose = null;
        socket.onerror = null;
        socket.close(1000, "Component unmounting");
      }
    };
  }, [roomId, deviceId, fetchDetailedTaskData, refreshStepperData]);

  return (
    <Container sx={{ py: { xs: 2, md: 3 }, backgroundColor: '#f9f9f9', minHeight: '100vh', display: 'flex', gap: '10px' }}>
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
        <Box sx={{ display: 'flex', width: '100%', gap: '10px' }}>
          <Box sx={{
            flex: '1',
            p: 3,
            boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
            borderRadius: '8px'
          }}>
            <Typography sx={{ fontSize: '22px', fontWeight: '500', fontFamily: 'Static/Title Large/Font', textAlign: 'center' }}>
              Mã QR của bạn
            </Typography>
            {isSocketConnected && (
              <Paper elevation={1} sx={{ p: 3, textAlign: 'center', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography color="text.secondary" sx={{ mb: 2, fontWeight: '400', fontSize: '12px', fontFamily: 'Roboto' }}>
                  Quét mã QR code để nhận danh sách công việc ngày hôm nay.
                </Typography>
                <QRCodeCanvas value={staffRoomLink} size={180} level="H" />
                <Typography sx={{ mt: 2, fontWeight: '500', fontSize: '12px', fontFamily: 'Roboto', color: '#007AFF' }}>
                  Bạn cần hoàn thành 5/5 công việc để quét mã QR điểm danh ngày hôm nay
                </Typography>
              </Paper>
            )}
            {!isSocketConnected && (
              <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
                Đang chờ kết nối tới máy chủ để có thể làm mới công việc qua QR...
              </Typography>
            )}
          </Box>
          <Box sx={{
            flex: '2', p: 3,
            boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
            borderRadius: '8px'
          }}>
            <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: '500', fontSize: '22px', fontFamily: 'Static/Title Large/Font' }}>
              Danh sách công việc
            </Typography>
            {detailedTasksResponse && detailedTasksResponse.tasks.length > 0 ? (
              <>
                <TaskList
                  tasks={detailedTasksResponse.tasks}
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
          </Box>
        </Box>
      </Box>
      <Box>
        {profileManager && (
          <CardInfoManager
            data={profileManager}
          />
        )}
        {profileStaff && stepperData &&
              <CardInfoStaff
                data={profileStaff}
                stepperData={stepperData}
              />
            }
      </Box>
    </Container>
  );
};

export default RoomDisplayPageStatic;