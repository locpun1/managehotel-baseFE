import IconButtonBtn from "@/components/IconButton/IconButton";
import CustomPagination from "@/components/Pagination/CustomPagination";
import { STATUS_LABELS, TaskStatus } from "@/constants/taskStatus";
import { DataTaskProps, getTaskByGroupTask } from "@/services/manager.service";
import { GroupTasks, Tasks } from "@/types/manager";
import DateTime from "@/utils/DateTime";
import { Delete, Edit, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { Alert, Box, Chip, CircularProgress, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";

interface TableTaskProps{
    listGroupTask: GroupTasks[],
    titleTypo?:string,
    from?: string,
    total: number,
    page: number,
    rowsPerPage: number,
    handlePageChange: (page: number) => void,
    handleOpenEditTask?: (id: string | number) => void;
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

const TableTask: React.FC<TableTaskProps> = (props) => {
    const { listGroupTask, titleTypo, from, total, page, rowsPerPage, handlePageChange, handleOpenEditTask } = props;

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

    console.log("listTaskByGroupTask: ",listTaskByGroupTask);
    
    const handlePageChangeTask = (newPage: number) => {
        setPageTask(newPage)
    }
    

    return (
        <Box sx={{ m: from ? 2 : 0}}>
            <Typography fontWeight={500}>Danh sách nhóm công việc theo phòng</Typography>
            <TableContainer component={Paper}>
                <Table stickyHeader aria-label="group-task">
                    <TableHead>
                        <TableRow sx={{ height: "50px"}}>
                            {[ 'Tầng', 'Phòng', 'Công việc', 'Số lượng',' Tiến độ','Thời hạn dọn phòng',' Bắt đầu', 'Kết thúc'].map((header) => (
                                <TableCell key={header} align="center" sx={{ fontWeight: 'bold', backgroundColor: '#00C7BE'}}>
                                    {header}
                                </TableCell>
                            ))}
                            {from && <TableCell align="center" sx={{ fontWeight: 'bolid', backgroundColor: '#00C7BE'}}>Hành động</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {listGroupTask?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={from ? 8 : 7} align="center">
                                    Không tìm thấy công việc nào cả
                                </TableCell>
                            </TableRow>
                        ) : (
                            listGroupTask?.map((task) => {
                                // const isDay = task.due_date && checkDay(dayjs(), task.due_date);
                                const statusLabel = getStatusLabel(task.status);
                                const statusColor = getStatusChipColor(task.status);
                                
                                return(
                                    <React.Fragment key={task.id}>
                                        <TableRow hover onClick={() => handleToggle(task.id)}>
                                            <TableCell align="center">{task.floorName}</TableCell>
                                            <TableCell align="center">{task.roomName}</TableCell>
                                            <TableCell align="center">{task.name}</TableCell>
                                            <TableCell align="center">{task.quantity}</TableCell>
                                            <TableCell align="center">
                                                <Chip label={statusLabel} size="small" color={statusColor}/>
                                            </TableCell>
                                            <TableCell align="center">{DateTime.FormatDate(task.due_date) || " "}</TableCell>
                                            <TableCell align="center">{DateTime.Format(task.started_at) || " "}</TableCell>
                                            <TableCell align="center">{DateTime.Format(task.completed_at) || " "}</TableCell>
                                            {from && <TableCell align="center">
                                                <IconButtonBtn
                                                    handleFunt={() => {
                                                        if (task.id && handleOpenEditTask) {
                                                            handleOpenEditTask(task.id);
                                                        }
                                                    }}
                                                    icon={<Edit color="primary"/>}
                                                    tooltip="Sửa"
                                                    height={22}
                                                    width={22}
                                                />
                                                <IconButtonBtn
                                                    handleFunt={() => {}}
                                                    icon={<Delete color="primary"/>}
                                                    tooltip="Xóa"
                                                    height={22}
                                                    width={22}
                                                />  
                                            </TableCell>}
                                        </TableRow>
                                    </React.Fragment>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <CustomPagination
                count={total}
                page={page}
                rowsPerPage={rowsPerPage}
                sx={{ mt: 2, mb: 1}}
                onPageChange={handlePageChange}
            />
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                    <CircularProgress/>
                </Box>
            )}
            {error && !loading && (
                <Alert severity="error" sx={{ my:2 }}>{error}</Alert>
            )}
            {!loading && !error && (
                <Collapse in={selectedTaskId === listGroupTask?.find(el => el.id === selectedTaskId)?.id}>
                <Typography fontWeight={500} sx={{ mt:3}}>{`Danh sách chi tiết theo nhóm công việc: ${listGroupTask?.find(el => el.id === selectedTaskId)?.name}, ${listGroupTask?.find(el => el.id === selectedTaskId)?.roomName}`} </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#aed581" }}>
                                {[ 'Công việc', 'STT',' Tiến độ',' Bắt đầu', 'Kết thúc'].map((header) => (
                                    <TableCell key={header} align="center" sx={{ fontWeight: 'bold'}}>
                                        {header}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {listTaskByGroupTask?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5}>
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
                                                <TableCell align="center">{DateTime.Format(listTask.started_at) || " "}</TableCell>
                                                <TableCell align="center">{DateTime.Format(listTask.completed_at) || " "}</TableCell>
                                            </TableRow>
                                        )
                                    })

                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                </Collapse>
            )}
        </Box>
    )
}

export default TableTask;