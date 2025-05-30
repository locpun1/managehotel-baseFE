import IconButton from "@/components/IconButton/IconButton";
import CustomPagination from "@/components/Pagination/CustomPagination";
import { STATUS_LABELS, TaskStatus } from "@/constants/taskStatus";
import { Tasks } from "@/types/manager";
import { Delete, Edit } from "@mui/icons-material";
import { Box, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React from "react";

interface TableTaskProps{
    listTask: Tasks[],
    titleTypo?:string,
    from?: string,
    total: number,
    page: number,
    rowsPerPage: number,
    handlePageChange: (page: number) => void,
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

const TableTask: React.FC<TableTaskProps> = (props) => {
    const { listTask, titleTypo, from, total, page, rowsPerPage, handlePageChange } = props;
    return (
        <Box>
            <Typography fontWeight={500}>{titleTypo}</Typography>
            <TableContainer component={Paper}>
                <Table stickyHeader aria-label="task">
                    <TableHead>
                        <TableRow sx={{ height: "50px"}}>
                            {[ 'Tầng', 'Phòng', 'Công việc', 'Số lượng',' Tiến độ',' Bắt đầu', 'Kết thúc'].map((header) => (
                                <TableCell key={header} align="center" sx={{ fontWeight: 'bolid', backgroundColor: '#00C7BE'}}>
                                    {header}
                                </TableCell>
                            ))}
                            {from && <TableCell align="center" sx={{ fontWeight: 'bolid', backgroundColor: '#00C7BE'}}>Hành động</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {listTask.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={from ? 8 : 7} align="center">
                                    Không tìm thấy công việc nào cả
                                </TableCell>
                            </TableRow>
                        ) : (
                            listTask?.map((task) => {
                                const statusLabel = getStatusLabel(task.status);
                                const statusColor = getStatusChipColor(task.status);
                                return(
                                    <TableRow hover key={task.id}>
                                        <TableCell align="center">{task.floorName}</TableCell>
                                        <TableCell align="center">{task.roomName}</TableCell>
                                        <TableCell align="center">{task.title}</TableCell>
                                        <TableCell align="center">{task.quantity}</TableCell>
                                        <TableCell align="center">
                                            <Chip label={statusLabel} size="small" color={statusColor}/>
                                        </TableCell>
                                        <TableCell align="center">{task.started_at || " "}</TableCell>
                                        <TableCell align="center">{task.completed_at || " "}</TableCell>
                                        {from && <TableCell align="center">
                                            <IconButton
                                                handleFunt={() => {}}
                                                icon={<Edit color="primary"/>}
                                                tooltip="Sửa"
                                                height={22}
                                                width={22}
                                            />
                                            <IconButton
                                                handleFunt={() => {}}
                                                icon={<Delete color="primary"/>}
                                                tooltip="Xóa"
                                                height={22}
                                                width={22}
                                            />  
                                        </TableCell>}
                                    </TableRow>
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
        </Box>
    )
}

export default TableTask;