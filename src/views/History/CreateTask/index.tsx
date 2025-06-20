import SearchBar from "@/components/SearchBar";
import { Alert, Box, CircularProgress } from "@mui/material"
import { useCallback, useEffect, useState } from "react";
import { GroupTasks } from "@/types/manager";
import { DataGroupTaskProps, getListGroupTask } from "@/services/manager.service";
import TableTask from "@/views/Manager/components/TableTask";
import { ROUTE_PATH } from "@/constants/routes";

const HistoryCreateTask: React.FC = () => {
     const [searchTerm, setSearchTerm] = useState<string>('');
        const [loading, setLoading] = useState<boolean>(false);
        const [error, setError] = useState(null);
        const [listGroupTask, setListGroupTask] = useState<GroupTasks[]>([]);
        const [page, setPage] = useState(0)
        const [rowPerPgae, setRowPerPage] = useState<number>(10)
        const [total, setTotal] = useState(0)
    
        const fetchListTask = useCallback(async (currentPage: number, currentLimit: number) => {
            setLoading(true)
            setError(null)
            try {
                const res = await getListGroupTask(currentPage, currentLimit)
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
    
        const handlePageChange = (newPage: number) => {
            setPage(newPage)
        }
        const handleSearch = () => {
        }
    
      
        return (
            <Box>
                <SearchBar
                    onSearch={handleSearch}
                    placeholder="Tìm kiếm"
                    initialValue={searchTerm}
                    isCheckOpenCreate={location.pathname === `/${ROUTE_PATH.MANAGE}/${ROUTE_PATH.MANAGE_HISTORY_CREATE_TASK}`}
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
                            from="from-history-create-task"
                        />
                    )}
                </Box>
            </Box>
        );
}

export default HistoryCreateTask;