import { DataRoomsProps, getRooms } from "@/services/manager.service";
import { getUserAttachedRoomAndTask, UserAttachedRoom } from "@/services/user-service";
import { Rooms } from "@/types/manager";
import { Alert, Box, Checkbox, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import InputText from "../components/InputText";

const ManagementTimekeeping: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0)
    const [rowPerPgae, setRowPerPage] = useState<number>(99)
    const [listRooms, setListRooms] = useState<Rooms[]>([]);
    const [userAttachedRoom, setUserAttachedRoom] = useState<UserAttachedRoom[]>([]);
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

    const loadList = useCallback(async(currentPage: number, currentLimit: number) => {
        setLoading(true)
        setError(null)
        try {
          const res = await getRooms(currentPage, currentLimit);
          const data = res.data as any as DataRoomsProps;
          setListRooms(data.data);
        } catch (error: any) {
          setError(error.message)
          setListRooms([])
        }finally{
          setLoading(false)
        }
    },[])
    
    const getUser = useCallback(async(date: string) => {
        setLoading(true)
        try {
          const res = await getUserAttachedRoomAndTask(date);
            // Kiểm tra là mảng hay không
            if (Array.isArray(res)) {
                setUserAttachedRoom(res);
            } else {
                setUserAttachedRoom([res]); // ép về mảng nếu không phải mảng
            }
        } catch (error: any) {
            setUserAttachedRoom([])
        }finally{
            setLoading(false)
        }
    },[])
    
    const todayForAPI = new Date().toISOString().split('T')[0]; 
    
    useEffect(() => {
        loadList(page, rowPerPgae);
        getUser(todayForAPI)
    },[page, rowPerPgae])
    
    const handleCustomInputChange = (name: string, value: Dayjs) => {
        if(value){
            setSelectedDate(value)
            const date = value.format("YYYY-MM-DD")
            getUser(date)
        }
    }
    return(
        <Box>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                my={2}
                px={2}
            >
                <Typography variant="h6">
                    Bảng quản lý danh sách phòng được dọn dẹp ngày {selectedDate.format("DD-MM-YYYY")}
                </Typography>
                <Box width="30%">
                    <InputText
                        label="Ngày"
                        type="date"
                        name="dateToday"
                        value={selectedDate}
                        onChange={(name, value) => handleCustomInputChange(name, value as Dayjs)}
                        placeholder="Ngày sinh"
                        sx={{ mt: 0 }}
                        margin="dense"
                    />
                </Box>
            </Box>
            <Box>
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 3}}>
                        <CircularProgress/>
                    </Box>
                )}
                {error && !loading && (
                    <Alert severity="error" sx={{ my: 2}}>{error}</Alert>
                )}
                {!loading && !error && (
                    <Box sx={{ 
                        m: 2,
                    }}>
                        <TableContainer component={Paper} sx={{
                            overflowY: 'auto',
                            '&::-webkit-scrollbar': { height: '6px' },
                            '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 1 },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: '#f1f1f1',
                            },
                        }}>
                            <Table stickyHeader aria-label="time-keepings">
                                <TableHead>
                                    <TableRow sx={{ 
                                        height: "60px"
                                    }}>
                                        <TableCell align="center" sx={{ fontWeight: 'bolid', backgroundColor: '#00C7BE', minWidth: 100, maxWidth: 200, whiteSpace: 'nowrap'}}>
                                            Nhân viên/ Phòng
                                        </TableCell>
                                        {listRooms.map((room) => (
                                            <TableCell align="center" sx={{ fontWeight: 'bolid', backgroundColor: '#00C7BE', minWidth: 120, maxWidth: 200, whiteSpace: 'nowrap'}}>
                                                {`Phòng ${room.room_number}`}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {userAttachedRoom.length === 0 ? (
                                        <TableRow>
                                            <TableCell align="center" colSpan={listRooms.length + 1}>Không tồn tại bản ghi nào cả</TableCell>
                                        </TableRow>
                                    ) : (
                                        userAttachedRoom.map((staff) => (
                                        <TableRow key={staff.id}>
                                            <TableCell sx={{ height: '55px'}}>{staff.fullName}</TableCell>
                                            {listRooms.map((room) => {
                                                const record = staff.records.find(
                                                    (el) => el.roomId === room.id
                                                );
                                                return(
                                                    <TableCell align="center" key={room.id}>
                                                        {record?.isCheckout === 1 ? (
                                                            <>
                                                                <Checkbox checked disabled size="small"/>
                                                                <Typography variant="caption">
                                                                    {`${record.totalMinutes || 0} phút`}
                                                                </Typography>
                                                            </>
                                                        ) : (
                                                            " - "
                                                        )}
                                                    </TableCell>
                                                )
                                            })}
                                        </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}
            </Box>
        </Box>
    )
}

export default ManagementTimekeeping;