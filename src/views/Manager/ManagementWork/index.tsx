import SearchBar from "@/components/SearchBar";
import { Alert, Box, CircularProgress } from "@mui/material"
import { useCallback, useEffect, useState } from "react";
import DialogCreateTask from "../components/DialogCreateTask";
import { GroupTasks } from "@/types/manager";
import { DataGroupTaskProps, getListGroupTask } from "@/services/manager.service";
import TableTask from "../components/TableTask";

function ManagementWork (){
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);
    const [openUpdateDialog, setOpenUpdateDialog] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState(null);
    const [listGroupTask, setListGroupTask] = useState<GroupTasks[]>([]);
    const [page, setPage] = useState(0)
    const [rowPerPgae, setRowPerPage] = useState<number>(10)
    const [total, setTotal] = useState(0)
    const [taskId, setTaskId] = useState<string | number>('');
    const [reloadKey, setReloadKey] = useState(0);

    const fetchListTask = useCallback(async (currentPage: number, currentLimit: number) => {
        setLoading(true)
        setError(null)
        try {
            const date = new Date().toISOString().split('T')[0];
            const res = await getListGroupTask(currentPage, currentLimit, date)
            const data = res.data as any as DataGroupTaskProps
            setListGroupTask(data.result.data)
            setTotal(data.result.totalCount)
        } catch (error: any) {
            setError(error.message);
            setListGroupTask([])
        } finally {
            setLoading(false)
        }
    }, [])


    useEffect(() => {
        fetchListTask(page,rowPerPgae)
    },[page, rowPerPgae])

    useEffect(() => {
        fetchListTask(page,rowPerPgae)
    }, [reloadKey, page, rowPerPgae]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
    }
    const handleSearch = () => {
    }

    const handleOpenCreateDialog = () => {
        setOpenCreateDialog(true)
    }

    const handleLoadList = useCallback((newTask: GroupTasks) => {
    setListGroupTask(prev => {
        const index = prev.findIndex(task => task.id === newTask.id);
        if (index !== -1) {
        const updated = [...prev];
        updated[index] = newTask;
        return updated;
        }
        return [newTask, ...prev];
    });
    }, []);
 

    const handleOpenEditTask = (id: string | number) => {
        setTaskId(id)
        setOpenUpdateDialog(true)
    }  
    return (
        <Box>
            <SearchBar
                onSearch={handleSearch}
                placeholder="Tìm kiếm theo tầng, phòng, tiến độ, người dọn dẹp, tên công việc...."
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
                        listGroupTask={listGroupTask}
                        total={total}
                        page={page}
                        rowsPerPage={rowPerPgae}
                        handlePageChange={handlePageChange}
                        from="from-manage-task"
                        handleOpenEditTask={handleOpenEditTask}
                    />
                )}
            </Box>
            {openCreateDialog &&
                <DialogCreateTask
                    open={openCreateDialog}
                    onClose={() => {
                        setOpenCreateDialog(false)
                    }}
                    title="Tạo công việc mới"
                    // handleLoadList={handleLoadList}
                    setReloadKey={setReloadKey}
                />
            }
            {openUpdateDialog &&
                <DialogCreateTask
                    open={openUpdateDialog}
                    onClose={() => {
                        setOpenUpdateDialog(false)
                    }}
                    title="Chỉnh sửa công việc"
                    taskId={taskId}
                    from="updateTask"
                    setReloadKey={setReloadKey}
                />
            }
        </Box>
    );
}

export default ManagementWork