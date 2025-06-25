import {Box} from '@mui/material';
import { useTranslation } from 'react-i18next';
import React, { useCallback, useEffect, useState } from 'react';
import InputText from '../Manager/components/InputText';
import { Dayjs } from 'dayjs';
import useAuth from '@/hooks/useAuth';
import { getRoomAndTaskDoneByStaff } from '@/services/user-service';
import TabsViewSwitcher from './components/TabsViewSwitcher';
import CleaningDaysCardMobile from './components/TabCleaningDay';
import CleaningWeeklyCardMobile from './components/TabCleaningWeek';
import CleaningByMonthCardMobile from './components/TabCleaningMonth';

interface Room{
  id: number | string,
  room_number: number,
  total: string
}

export interface DailyCleaning {
  date: string,
  rooms: Room[]
}

export interface WeeklyCleaning {
  weekLabel: string;
  days: DailyCleaning[];
  totalMinutes: number;
}

export interface HomeStaffProps{
  cleaningHistory: DailyCleaning[];
}
 

const Home = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [roomAndTaskDoneStaff, setRoomAndTaskDoneStaff] = useState<DailyCleaning[]>([]);
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
  const handleCustomInputChange = (name: string, value: Dayjs) => {
    if(value){
      setSelectedDate(value)
    }
  }

  const getUser = useCallback(async(id: string | number) => {
          setLoading(true)
          try {
            const res = await getRoomAndTaskDoneByStaff(id);
            // Kiểm tra là mảng hay không
            if (Array.isArray(res)) {
                setRoomAndTaskDoneStaff(res);
            } else {
                setRoomAndTaskDoneStaff([res]); // ép về mảng nếu không phải mảng
            }
          } catch (error: any) {
            setRoomAndTaskDoneStaff([])
          }finally{
            setLoading(false)
          }
  },[])

  useEffect(() => {
    if(profile && profile.id){
      getUser(profile.id)
    }
  }, [profile])
  return (
    <Box>
        <TabsViewSwitcher viewMode={viewMode} onChange={setViewMode} />
        {/* <Box width="50%">
          <InputText
            label="Ngày/tháng/năm"
            type="date"
            name="dateToday"
            value={selectedDate}
            onChange={(name, value) => handleCustomInputChange(name, value as Dayjs)}
            placeholder="Ngày sinh"
            sx={{ mt: 0 }}
            margin="dense"
            />
        </Box> */}
      {viewMode === 'daily' && <CleaningDaysCardMobile cleaningHistory={roomAndTaskDoneStaff} />}
      {viewMode === 'weekly' && <CleaningWeeklyCardMobile cleaningHistory={roomAndTaskDoneStaff} />}
      {viewMode === 'monthly' && <CleaningByMonthCardMobile data={roomAndTaskDoneStaff} />}
    </Box>
  );
};

export default Home;
