import SearchBar from "@/components/SearchBar";
import { Alert, Box, Chip, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from "@mui/material"
import { useCallback, useEffect, useState } from "react";
import DialogCreateTask from "../components/DialogCreateTask";
import { Tasks } from "@/types/manager";
import { DataTaskProps, getListTask } from "@/services/manager.service";
import IconButton from "@/components/IconButton/IconButton";
import { Delete, Edit } from "@mui/icons-material";
import CustomPagination from "@/components/Pagination/CustomPagination";
import { STATUS_LABELS, TaskStatus } from "@/constants/taskStatus";

const getStatusLabel = (status: TaskStatus | null | undefined): string => {
    if(!status) return "Chưa xác định";
    return STATUS_LABELS[status] || status;
}

const getStatusChipColor = (status: TaskStatus | null | undefined): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch(status){
        case TaskStatus.PENDING: return "primary";
        case TaskStatus.PROGRESS: return "warning";
        case TaskStatus.COMPLETED: return "success";
        case TaskStatus.CANCELLED: return "error";
        default: return "default";
    }
}
function ManagementWork (){
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState(null);
    const [listTasks, setListTask] = useState<Tasks[]>([]);
    const [page, setPage] = useState(0)
    const [rowPerPgae, setRowPerPage] = useState(10)
    const [total, setTotal] = useState(0)

    const fetchListTask = useCallback(async (currentPage: number, currentLimit: number) => {
        setLoading(true)
        setError(null)
        try {
            const res = await getListTask(currentPage, currentLimit)
            const data = res.data as any as DataTaskProps
            setListTask(data.result.data)
            setTotal(data.result.totalCount)
        } catch (error: any) {
            setError(error.message);
            setListTask([])
        } finally {
            setLoading(false)
        }
    }, [])


    useEffect(() => {
        fetchListTask(page,rowPerPgae)
    },[page, rowPerPgae])


    const handlePageChange = (newPage: number) => {
        setPage(newPage)
    }
    const handleSearch = () => {
    }

    const handleOpenCreateDialog = () => {
        setOpenCreateDialog(true)
    }

    const handleLoadList = (newTask: Tasks) => {
        setListTask(prev => [newTask, ...prev])
    }
    return (
        <Box>
            <SearchBar
                onSearch={handleSearch}
                placeholder="Tìm kiếm"
                initialValue={searchTerm}
                onOpenDialogCreate={handleOpenCreateDialog}
            />
            <Box>
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                        <CircularProgress />
                    </Box>
                )}
                {error && !loading && (
                    <Alert severity='error' sx={{ my: 2 }}>{error}</Alert>
                )}
                {!loading && !error && (
                    <Box sx={{ m:2 }}>
                        <TableContainer component={Paper}>
                            <Table stickyHeader aria-label="task">
                                <TableHead>
                                    <TableRow sx={{ height:"50px"}}>
                                        {[ 'Tầng', 'Phòng', 'Công việc', 'Số lượng', 'Tiến độ', 'Bắt đầu', 'Kết thúc', 'Hành động'].map((header) => (
                                            <TableCell key={header} align="center" sx={{ fontWeight: 'bolid', backgroundColor: '#00C7BE'}}>
                                                {header}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {listTasks?.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} align="center">
                                                Không tim thấy công việc nào cả
                                            </TableCell>
                                        </TableRow>
                                    ):(
                                        listTasks?.map((task) => {
                                            const statusLabel = getStatusLabel(task.status);
                                            const statusColor = getStatusChipColor(task.status);
                                            return(
                                                <TableRow hover key={task.id}>
                                                    <TableCell align="center">{task.floorName}</TableCell>
                                                    <TableCell align="center">{task.roomName}</TableCell>
                                                    <TableCell align="center">{task.title}</TableCell>
                                                    <TableCell align="center">{task.quantity}</TableCell>
                                                    <TableCell align="center">
                                                        <Chip label={statusLabel} size="small" color={statusColor} />
                                                    </TableCell>
                                                    <TableCell align="center">{task.started_at || " "}</TableCell>
                                                    <TableCell align="center">{task.completed_at || " "}</TableCell>
                                                    <TableCell align="center">
                                                        <IconButton
                                                            handleFunt={() => {}}
                                                            icon={<Edit color="primary"/>}
                                                            tooltip="Sửa"
                                                        />
                                                        <IconButton
                                                            handleFunt={() => {}}
                                                            icon={<Delete color="error"/>}
                                                            tooltip="Xóa"
                                                        />
                                                    </TableCell>
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
                            rowsPerPage={rowPerPgae}
                            sx={{ mt: 2, mb: 1}}
                            onPageChange={handlePageChange}
                        />
                    </Box>
                )}
            </Box>
            <DialogCreateTask
                open={openCreateDialog}
                onClose={() => {
                    setOpenCreateDialog(false)
                }}
                title="Tạo công việc mới"
                handleLoadList={handleLoadList}
            />
        </Box>
    );
}

export default ManagementWork