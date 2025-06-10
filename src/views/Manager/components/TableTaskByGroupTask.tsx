import IconButtonBtn from "@/components/IconButton/IconButton";
import CustomPagination from "@/components/Pagination/CustomPagination";
import { STATUS_LABELS, TaskStatus } from "@/constants/taskStatus";
import { DataTaskProps, getTaskByGroupTask } from "@/services/manager.service";
import { GroupTasks, Tasks } from "@/types/manager";
import DateTime from "@/utils/DateTime";
import { Delete, Edit} from "@mui/icons-material";
import { Alert, Box, Chip, CircularProgress, Collapse, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";

interface TableTaskByGroupTaskProps{
    id: string| number,
}
export const getStatusLabel = (status: TaskStatus | null | undefined): string => {
    if(!status) return "Chưa xác định";
    return STATUS_LABELS[status] || status;
}

export const getStatusChipColor = (status: TaskStatus | null | undefined): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch(status){
        case TaskStatus.PENDING: return "primary";
        case TaskStatus.PROGRESS: return "warning";
        case TaskStatus.COMPLETED: return "success";
        case TaskStatus.CANCELLED: return "error";
        default: return "default";
    }
}

export const checkDay = (today:Dayjs |string, dueDate: Dayjs | string) : boolean => {
        if(dayjs(dueDate).isBefore(today, 'day')){
            return true
        }
        return false;
}

const TableTaskByGroupTask: React.FC<TableTaskByGroupTaskProps> = (props) => {
    const { id } = props;

    const [selectedTaskId, setSelectedTaskId] = useState<string | number | null>(null);
    const [pageTask, setPageTask] = useState(0);
    const [rowsPerPageTask, setRowPerPageTask] = useState(6);
    const [listTaskByGroupTask, setListTaskByGroupTask] = useState<Tasks[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalTask, setTotalTask] = useState(0)

    const handleToggle = (id: string | number) => {
        setSelectedTaskId((prevId) => (prevId === id ? null : id))
    }

    useEffect(() => {
        if(id){
            setSelectedTaskId(id)
        }
    },[id])

    useEffect(() => {
        if(selectedTaskId){
            const fetchTaskByGroupTask = async() => {
                setLoading(true)
                    try {
                        const res = await getTaskByGroupTask(pageTask, rowsPerPageTask, selectedTaskId);
                        const data = res.data as any as DataTaskProps
                        setListTaskByGroupTask(data.result.data);
                        setTotalTask(data.result.totalCount)
                    } catch (error:any) {
                        setError(error.message);
                        setListTaskByGroupTask([]);
                        setTotalTask(0)
                    }finally{
                        setLoading(false)
                    }
            }
            fetchTaskByGroupTask()
        }
    }, [selectedTaskId])

    const handlePageChangeTask = (newPage: number) => {
        setPageTask(newPage)
    }
    

    return (
        <Box>
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                    <CircularProgress/>
                </Box>
            )}
            {error && !loading && (
                <Alert severity="error" sx={{ my:2 }}>{error}</Alert>
            )}
            {!loading && !error && (
                <Collapse in={selectedTaskId === id} timeout='auto' unmountOnExit>
                    <Typography fontWeight={500} sx={{ mt:3}}>{`Danh sách công việc theo phòng`} </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#aed581" }}>
                                    {[ 'Công việc', 'STT',' Tiến độ','Thời hạn',' Bắt đầu', 'Kết thúc'].map((header) => (
                                        <TableCell key={header} align="center" sx={{ fontWeight: 'bold'}}>
                                            {header}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {listTaskByGroupTask?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6}>
                                            <Typography variant="body2">Không tôn tại bản ghi nào cả</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    listTaskByGroupTask
                                        ?.map((listTask, index)=> {
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell align="center">{listTask.title}</TableCell>
                                                    <TableCell align="center">{listTask.order_in_process}</TableCell>
                                                    <TableCell align="center">
                                                        <Chip label={getStatusLabel(listTask.status)} color={getStatusChipColor(listTask.status)} ></Chip>
                                                    </TableCell>
                                                    <TableCell align="center">{DateTime.FormatDate(listTask.due_date) || " "}</TableCell>
                                                    <TableCell align="center">{DateTime.Format(listTask.started_at) || " "}</TableCell>
                                                    <TableCell align="center">{DateTime.Format(listTask.completed_at) || " "}</TableCell>
                                                </TableRow>
                                            )
                                        })

                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <CustomPagination
                        count={totalTask}
                        page={pageTask}
                        rowsPerPage={rowsPerPageTask}
                        sx={{ mt: 2, mb: 1}}
                        onPageChange={handlePageChangeTask}
                    />
                </Collapse>
            )}
        </Box>
    )
}

export default TableTaskByGroupTask;