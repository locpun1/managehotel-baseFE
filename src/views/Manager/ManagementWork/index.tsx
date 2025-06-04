import SearchBar from "@/components/SearchBar";
import { Alert, Box, CircularProgress } from "@mui/material"
import { useCallback, useEffect, useState } from "react";
import DialogCreateTask from "../components/DialogCreateTask";
import { Tasks } from "@/types/manager";
import { DataTaskProps, getListTask } from "@/services/manager.service";
import { STATUS_LABELS, TaskStatus } from "@/constants/taskStatus";
import TableTask from "../components/TableTask";

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
function ManagementWork (){
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState(null);
    const [listTasks, setListTask] = useState<Tasks[]>([]);
    const [page, setPage] = useState(0)
    const [rowPerPgae, setRowPerPage] = useState<number>(10)
    const [total, setTotal] = useState(0)

    const fetchListTask = useCallback(async (currentPage: number, currentLimit: number, roomId?: number) => {
        setLoading(true)
        setError(null)
        try {
            const res = await getListTask(currentPage, currentLimit,roomId)
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
                    <TableTask
                        listTask={listTasks}
                        total={total}
                        page={page}
                        rowsPerPage={rowPerPgae}
                        handlePageChange={handlePageChange}
                        from="from-manage-task"
                    />
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