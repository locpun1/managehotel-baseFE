import {Box} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
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
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [roomAndTaskDoneStaff, setRoomAndTaskDoneStaff] = useState<DailyCleaning[]>([]);
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
  const getUser = useCallback(async(id: string | number) => {
          setLoading(true)
          try {
            const res = await getRoomAndTaskDoneByStaff(id);
            const data = res as any as DailyCleaning[];
            setRoomAndTaskDoneStaff(data)
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
      {viewMode === 'daily' && <CleaningDaysCardMobile cleaningHistory={roomAndTaskDoneStaff} />}
      {viewMode === 'weekly' && <CleaningWeeklyCardMobile cleaningHistory={roomAndTaskDoneStaff} />}
      {viewMode === 'monthly' && <CleaningByMonthCardMobile data={roomAndTaskDoneStaff} />}
    </Box>
  );
};

export default Home;
