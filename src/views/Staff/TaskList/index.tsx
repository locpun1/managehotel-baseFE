import { Alert, Box, Chip, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import SearchBar from '@/components/SearchBar';
import { useCallback, useEffect, useState } from 'react';
import { Tasks } from '@/types/manager';
import { ID_ROOM } from '../Home';
import { getTasksPerformedStaff, TasksApiResponse } from '@/services/task-service';
import { getReportTaskStatusLabel, getStatusChipColor, getStatusLabel } from '@/utils/status';
import DateTime from '@/utils/DateTime';
import IconButton from '@/components/IconButton/IconButton';
import { Description, Visibility } from '@mui/icons-material';
import CustomPagination from '@/components/Pagination/CustomPagination';
import ModalInfoTask from './components/ModalInfoTask';
import useAuth from '@/hooks/useAuth';
import ModalReportTask from './components/ModalReportTask';
import { TaskStatus } from '@/constants/taskStatus';

const StaffTaskList = () => {
  const roomId = localStorage.getItem(ID_ROOM);

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [listTasks, setListTask] = useState<TasksApiResponse | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowPerPgae, setRowPerPage] = useState(10);
  const [openInfoTask, setOpenInfoTask] = useState<boolean>(false)
  const [openReportTask, setOpenReportTask] = useState<boolean>(false)
  const [detailTask, setDetailTask] = useState<Tasks | null>(null)

  const { userId, profile } = useAuth();

  const fetchListTask = useCallback(async() => {
      setLoading(true)
      setError(null)
      try {
        const todayForAPI = new Date().toISOString().split('T')[0];
        if(!roomId){
          setListTask(null);
          return;
        }
        const res = await getTasksPerformedStaff(page, rowPerPgae, roomId, todayForAPI);
        setListTask(res)
        setTotal(res.totalCount)
      } catch (error: any) {
        setError(error.message)
        setListTask(null)
        setTotal(0)
      }finally{
        setLoading(false)
      }
  },[])

  useEffect(() => {
    if(roomId){
      fetchListTask()
    }
  }, [roomId])

  const handleSearch = () => {
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleOpenInfoTask = (task: Tasks) => {
    setOpenInfoTask(true)
    setDetailTask(task)
  }

  const handleOpenReportTask = (task: Tasks) => {
    setOpenReportTask(true)
    setDetailTask(task)
  }

  return (
    <Box>
      <SearchBar
        onSearch={handleSearch}
        placeholder="Tìm kiếm"
        initialValue={searchTerm}
      />
      <Box>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3}}>
            <CircularProgress/>
          </Box>
        )}
        {error && !loading && (
          <Alert severity='error' sx={{ my: 2}}>{error}</Alert>
        )}
        {!loading && !error && (
          <Box sx={{ m: 2}}>
              <TableContainer component={Paper}>
                <Table stickyHeader aria-label="task-staff">
                  <TableHead>
                    <TableRow sx={{ height: '50px'}}>
                      {[ 'Tầng', 'Phòng', 'Công việc', ' Thời gian', 'Tiến độ', 'Bắt đầu', 'Kết thúc', 'Trạng thái báo cáo', 'Hành động'].map((header) => (
                        <TableCell key={header} align='center' sx={{ fontWeight: 'bold', backgroundColor: '#00C7BE'}}>
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listTasks?.tasks.length === 0 ? (
                      <TableRow>
                        <TableCell align='center' colSpan={8}>Không tồn tại bản ghi nào</TableCell>
                      </TableRow>
                    ) : (
                      listTasks?.tasks.map((task) => {
                        const statusLabel = getStatusLabel(task.status);
                        const statusColor = getStatusChipColor(task.status);
                        const taskReportStatusLabel = getReportTaskStatusLabel(task.is_reported)
                        return(
                          <TableRow key={task.id}>
                            <TableCell align='center'>{task.floorName}</TableCell>
                            <TableCell align='center'>{task.roomName}</TableCell>
                            <TableCell align='center'>{task.title}</TableCell>
                            <TableCell align='center'>{DateTime.FormatDate(task.due_date) || " "}</TableCell>
                            <TableCell align='center'>
                              <Chip label={statusLabel} color={statusColor} ></Chip>
                            </TableCell>
                            <TableCell align='center'>{DateTime.Format(task.started_at) || " "}</TableCell>
                            <TableCell align='center'>{DateTime.Format(task.completed_at) || " "}</TableCell>
                            <TableCell align='center'>{taskReportStatusLabel}</TableCell>
                            <TableCell align='center'>
                              <IconButton
                                handleFunt={() => handleOpenInfoTask(task)}
                                icon={<Visibility color='info'/>}
                                tooltip='Xem'
                                height={22}
                                width={22}
                              />
                              {(task.status === TaskStatus.COMPLETED && task.is_reported === 0) &&(
                                <IconButton
                                  handleFunt={() => handleOpenReportTask(task)}
                                  icon={<Description color='primary'/>}
                                  tooltip='Báo cáo'
                                  height={22}
                                  width={22}
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box display='flex' justifyContent='center' alignItems='center'>
                <CustomPagination
                  count={total}
                  page={page}
                  rowsPerPage={rowPerPgae}
                  onPageChange={handlePageChange}
                  sx={{ mt: 2}}
                />
              </Box>
          </Box>
        )}
      </Box>
      {profile && detailTask &&  (
        <ModalInfoTask
          open={openInfoTask}
          onClose={() => {
            setOpenInfoTask(false)
          }}
          profile={profile}
          detailTask={detailTask}
          setOpenReportTask={setOpenReportTask}
          openReportTask={openReportTask}
        />
      )}
      {profile && detailTask && (
        <ModalReportTask
          open={openReportTask}
          onClose={() => {
            setOpenReportTask(false)
          }}
          profile={profile}
          detailTask={detailTask}
        />
      )}
    </Box>
  );
};

export default StaffTaskList;
