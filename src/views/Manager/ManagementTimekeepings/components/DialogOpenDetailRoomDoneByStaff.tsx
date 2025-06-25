import DialogComponent from "@/components/DialogComponent";
import ActionButton from "@/components/ProButton/ActionButton";
import { Box, Card, CardContent, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import React, {useCallback, useEffect, useState } from "react";
import { DayCell } from "..";
import { getTasksAndRoomPerformedStaff } from "@/services/task-service";
import { GroupTasks } from "@/types/manager";
import { getMinutesDiff, getTime } from "@/utils/date";
import { isYearDisabled } from "node_modules/react-datepicker/dist/date_utils";
import DateTime from "@/utils/DateTime";
import { getStatusLabel } from "@/utils/status";
import CustomPagination from "@/components/Pagination/CustomPagination";

interface DialogOpenDetailRoomDoneByStaffProps{
    open:boolean,
    title?: string,
    onClose: () => void;
    selectedDate: string;
    selectedStaff: string | number;
    selectedDetail: DayCell | null;
}


const DialogOpenDetailRoomDoneByStaff: React.FC<DialogOpenDetailRoomDoneByStaffProps> = (props) => {
    const {open, title, onClose, selectedDate, selectedStaff, selectedDetail } = props;
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowPerPage, setRowPerPage] = useState(4);
    const [total, setTotal] = useState(0);
    const [detailTaskAndRoom, setDetailTaskAndRoom] = useState<GroupTasks[]>([]);

    const handleClose = () => {
        onClose()
    }

    const getTaskAndRoomDetail = useCallback(async(currentPage: number, currentSize: number, date: string, staffId: string | number) => {
        setLoading(true)
        try {
            const res = await getTasksAndRoomPerformedStaff(currentPage,currentSize, date, staffId);
            const data = res.tasks as any as GroupTasks[];
            setDetailTaskAndRoom(data)
            setTotal(res.totalCount)
        } catch (error) {
            setDetailTaskAndRoom([])
        }finally{
            setLoading(false)
        }
    },[])

    useEffect(() => {
        if(selectedDate && selectedStaff){
            getTaskAndRoomDetail(page, rowPerPage, selectedDate, selectedStaff)
        }
    },[page, rowPerPage, selectedStaff, selectedDate])
    
    const handlePageChange = (newPage: number) => {
        setPage(newPage)
    }
    
    return (
        <DialogComponent
            dialogKey={open}
            handleClose={handleClose}
            dialogTitle={title}
            fullWidth={true}
        >
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                    <CircularProgress />
                </Box>
            )}
            {!loading && (
                <Box sx={{ flexGrow: 1}}>
                    <Grid container spacing={1}>
                        {detailTaskAndRoom.map((item) => {
                            const total = item.started_at && item.completed_at && getMinutesDiff(item.started_at, item.completed_at)
                            const time = item.started_at && item.completed_at && getTime(item.started_at, item.completed_at)
                            return(
                                <Grid item xs={12} md={6}>
                                    <Card key={item.id} sx={{ borderRadius: 2, boxShadow: 2, border: "solid 1px rgba(0, 0, 0, 0.2)"}}>
                                        <CardContent>
                                            <Stack flexGrow='1' direction='column'>
                                                <Typography variant="body2" fontWeight={600} gutterBottom>
                                                    {`🏨 Phòng ${item.roomName} - ${item.floorName}`}
                                                </Typography>
                                                <Typography variant="body2" fontWeight={600} gutterBottom>
                                                    {`📅 Thời gian dọn: ${time}`}
                                                </Typography>
                                                <Typography variant="body2" fontWeight={600} gutterBottom>
                                                    {`👤 Người dọn: ${item.staffName}`}
                                                </Typography>
                                                <Typography variant="body2" fontWeight={600} gutterBottom>
                                                    {`📅 Ngày dọn: ${DateTime.FormatDate(item.due_date)}`}
                                                </Typography>
                                                <Typography variant="body2" fontWeight={600} gutterBottom>
                                                    {`⏱️ Tổng thời gian dọn: ${total} phút`}
                                                </Typography>
                                                <Typography variant="body2" fontWeight={600} gutterBottom>
                                                        {`📅 Trạng thái: ${getStatusLabel(item.status)}`}
                                                </Typography>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )
                        })}
                        <Box display='flex' justifyContent='center'>
                            <CustomPagination
                                count={total}
                                page={page}
                                rowsPerPage={rowPerPage}
                                onPageChange={handlePageChange}
                            />
                        </Box>
                    </Grid>
                </Box>
            )}

        </DialogComponent>
    )
}

export default DialogOpenDetailRoomDoneByStaff;