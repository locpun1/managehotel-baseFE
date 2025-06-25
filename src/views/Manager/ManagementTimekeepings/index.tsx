import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
} from '@mui/material';
import { getListUser, getTotalRoomAndMinutesDoneByStaff } from '@/services/user-service';
import { UserProfile } from '@/types/users';
import TabsViewSwitcher from '@/views/Home/components/TabsViewSwitcher';
import TabCleaningDayAllStaff from './components/TabCleaningDayAllStaff';
import TabCleaningWeekAllStaff from './components/TabCleaningWeekAllStaff';
import DialogOpenDetailRoomDoneByStaff from './components/DialogOpenDetailRoomDoneByStaff';
import TabCleaningMonthAllStaff from './components/TabCleaningMonthAllStaff';


export type DayCell = {
  date: string;
  roomCount: number;
  totalMinutes: number;
};

export type CleaningStat = {
  staffId: string | number;
  stats: Record<string, DayCell>;
};

const ManagementTimekeeping: React.FC = () => {
  const [selectedDetail, setSelectedDetail] = useState<DayCell | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string | number>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0)
  const [rowPerPgae, setRowPerPage] = useState<number>(99)
  const [listUsers, setListUsers] = useState<UserProfile[]>([]);
  const [cleaningStats, setCleaningStats] = useState<CleaningStat[]>([]);
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const getUser = useCallback(async(currentPage: number, currentSize: number) => {
    setLoading(true)
    try {
      const res = await getListUser(currentPage, currentSize);
      const data = res.data as any as UserProfile[];
      setListUsers(data)
    } catch (error: any) {
      setListUsers([])
    }finally{
      setLoading(false)
    }
  },[]);

  const getTotalRoomsAndMinutesDoneByStaff = useCallback(async(month: number, year: number) => {
    setLoading(true)
    try {
      const res = await getTotalRoomAndMinutesDoneByStaff(month, year);
      const data = res as any as CleaningStat[];
      setCleaningStats(data)
    } catch (error) {
      setCleaningStats([])
    }finally{
      setLoading(false)
    }
  },[])
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  useEffect(() => {
    getUser(page, rowPerPgae)
    getTotalRoomsAndMinutesDoneByStaff(month, year)
  },[page, rowPerPgae, month, year])

  const handleCellClick = (stat: DayCell, staffId: string | number, date: string) => {
    setSelectedDetail(stat);
    setSelectedStaff(staffId);
    setSelectedDate(date);
  };

  return (
    <Box>
      <TabsViewSwitcher viewMode={viewMode} onChange={setViewMode} />
      {viewMode === 'daily' && <TabCleaningDayAllStaff listUsers={listUsers} cleaningStats={cleaningStats} handleCellClick={handleCellClick} />}
      {viewMode === 'weekly' && <TabCleaningWeekAllStaff listUsers={listUsers} cleaningStats={cleaningStats} handleCellClick={handleCellClick} />}
      {viewMode === 'monthly' && <TabCleaningMonthAllStaff cleaningStats={cleaningStats} />}

      {/* Dialog chi tiết */}
      <DialogOpenDetailRoomDoneByStaff
        open={!!selectedDetail}
        onClose={() => setSelectedDetail(null)}
        title='Chi tiết công việc'
        selectedDetail={selectedDetail}
        selectedStaff={selectedStaff}
        selectedDate={selectedDate}
      />
    </Box>
  );
};

export default ManagementTimekeeping;

