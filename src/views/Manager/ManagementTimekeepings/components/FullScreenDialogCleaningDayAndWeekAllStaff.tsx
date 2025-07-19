import FullScreenDialog from "@/components/FullScreenDialog";
import TabsViewSwitcher from "@/views/Home/components/TabsViewSwitcher";
import { useCallback, useEffect, useState } from "react";
import { CleaningStat, DayCell } from "..";
import { getListUser, getTotalRoomAndMinutesDoneByStaff } from "@/services/user-service";
import { UserProfile } from "@/types/users";
import TabCleaningDayAllStaff from "./TabCleaningDayAllStaff";
import TabCleaningWeekAllStaff from "./TabCleaningWeekAllStaff";
import DialogOpenDetailRoomDoneByStaff from "./DialogOpenDetailRoomDoneByStaff";

interface FullScreenDialogCleaningDayAndWeekAllStaffProps{
    open: boolean,
    onClose: () => void;
    title: string;
    from: string;
    month: number;
    year: number;
}

const FullScreenDialogCleaningDayAndWeekAllStaff = (props: FullScreenDialogCleaningDayAndWeekAllStaffProps) => {
    const { open, onClose, title, from, month, year } = props;
    const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');
    const [cleaningStats, setCleaningStats] = useState<CleaningStat[]>([]);
    const [listUsers, setListUsers] = useState<UserProfile[]>([]);
    const [selectedDetail, setSelectedDetail] = useState<DayCell | null>(null);
    const [selectedStaff, setSelectedStaff] = useState<string | number>('');
    const [selectedDate, setSelectedDate] = useState<string>('');

    const handleClose = () => {
        onClose()
    }

      const getUser = useCallback(async() => {
        try {
          const res = await getListUser(0, 99);
          const data = res.data as any as UserProfile[];
          setListUsers(data)
        } catch (error: any) {
          setListUsers([])
        }
      },[]);

    const getTotalRoomsAndMinutesDoneByStaff = useCallback(async(month: number, year: number) => {
        try {
          const res = await getTotalRoomAndMinutesDoneByStaff(month, year);
          const data = res as any as CleaningStat[];
          setCleaningStats(data)
        } catch (error) {
          setCleaningStats([])
        }
      },[])

      useEffect(() => {
        getUser()
        getTotalRoomsAndMinutesDoneByStaff(month, year)
      },[month, year])
      
    const handleCellClick = (stat: DayCell, staffId: string | number, date: string) => {
        setSelectedDetail(stat);
        setSelectedStaff(staffId);
        setSelectedDate(date);
    };
      
    return(
        <FullScreenDialog
            open={open}
            onClose={handleClose}
            title={title}
        >
            <TabsViewSwitcher from={from} viewMode={viewMode} onChange={setViewMode} />
            {viewMode === 'daily' && <TabCleaningDayAllStaff from="day-of-month" monthTabMonth={month} listUsers={listUsers} cleaningStats={cleaningStats} handleCellClick={handleCellClick} />}
            {viewMode === 'weekly' && <TabCleaningWeekAllStaff from="week-of-month" monthTabMonth={month} listUsers={listUsers} cleaningStats={cleaningStats} handleCellClick={handleCellClick} />}
        
          <DialogOpenDetailRoomDoneByStaff
            open={!!selectedDetail}
            onClose={() => setSelectedDetail(null)}
            title="Chi tiết công việc"
            selectedDetail={selectedDetail}
            selectedStaff={selectedStaff}
            selectedDate={selectedDate}
          /> 
        </FullScreenDialog>
    )
}

export default FullScreenDialogCleaningDayAndWeekAllStaff;