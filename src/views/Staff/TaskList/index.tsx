import { Alert, Avatar, Box, Card, CardContent, Chip, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import SearchBar from '@/components/SearchBar';
import React, { useCallback, useEffect, useState } from 'react';
import { Tasks } from '@/types/manager';
import { ID_ROOM } from '../Home';
import { getTasksPerformedStaff, TasksApiResponse } from '@/services/task-service';
import { getReportTaskStatusLabel, getStatusChipColor, getStatusLabel } from '@/utils/status';
import DateTime, { getAgeFromDateOfBirth } from '@/utils/DateTime';
import IconButton from '@/components/IconButton/IconButton';
import { Description} from '@mui/icons-material';
import CustomPagination from '@/components/Pagination/CustomPagination';
import useAuth from '@/hooks/useAuth';
import ModalReportTask from './components/ModalReportTask';
import Grid from '@mui/material/Grid2';
import { getPathImage } from '@/utils/url';
import avatar from "@/assets/images/users/default-avatar.jpg"
import { Dayjs } from 'dayjs';
import { UserProfile } from '@/types/users';
import { getProfileUserCreateTaskAttachedRoom } from '@/services/user-service';
import { getRoleLabel } from '@/utils/labelEnToVni';
import { TaskStatus } from '@/constants/taskStatus';
import { getMinutesDiff, getTime } from '@/utils/date';

const StaffTaskList = () => {
  const roomId = localStorage.getItem(ID_ROOM);

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [listTasks, setListTask] = useState<TasksApiResponse | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowPerPgae, setRowPerPage] = useState(6);
  const [openReportTask, setOpenReportTask] = useState<boolean>(false)
  const [detailTask, setDetailTask] = useState<Tasks | null>(null)
  const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
  const [errorProfile, setErrorProfile] = useState<string | null>(null)

  const { userId, profile } = useAuth();

  const fetchListTask = useCallback(async(currentPage: number, currentRow: number,id: string | number, idRoom?: string | number) => {
      setLoading(true)
      setError(null)
      try {
        const todayForAPI = new Date().toISOString().split('T')[0];
        const res = await getTasksPerformedStaff(currentPage, currentRow,todayForAPI, id, idRoom);
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

  const fetchProfileUserCreatedTask = useCallback(async() => {
    if (!roomId) {
      setProfileUser(null)
      return;
    }
    setErrorProfile(null)
    try {
      const res = await getProfileUserCreateTaskAttachedRoom(roomId);
      setProfileUser(res)
    } catch (error: any) {
      setErrorProfile(error.message)
      setProfileUser(null)
    }
    }, [])

  useEffect(() => {
    if(profile){
      if(roomId){
        fetchListTask(page, rowPerPgae,profile.id, roomId),
        fetchProfileUserCreatedTask()
      }else{
        fetchListTask(page, rowPerPgae,profile.id)
      }
    }

  }, [roomId, profile,page, rowPerPgae])

  const handleSearch = () => {
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
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
            <Grid container spacing={2}>
              {listTasks?.tasks.length === 0 ? (
                <Typography variant='body2'>Không tồn tại bản ghi nào cả</Typography>
              ) : (
                listTasks?.tasks.map((task) => {
                  const time = task.started_at && task.completed_at && getTime(task.started_at, task.completed_at)
                  const total = task.started_at && task.completed_at && getMinutesDiff(task.started_at, task.completed_at)
                  const statusLabel = getStatusLabel(task.status);
                  const statusColor = getStatusChipColor(task.status);
                  const taskReportStatusLabel = getReportTaskStatusLabel(task.is_reported)
                  return (
                    <React.Fragment key={task.id}>
                      <Grid size={{ xs: 12, sm: 6, lg: 4}}>
                          <Card key={task.id} sx={{ borderRadius: 2, boxShadow: 2}}>
                            <CardContent>
                              <Box display='flex' flexDirection='row' justifyContent='space-between'>
                                <Stack direction='row' spacing={2} sx={{mb: 2}} alignItems='center'>
                                  <Avatar
                                    src={profile?.avatar_url ? getPathImage(profile.avatar_url) : avatar}
                                    sx={{
                                      width:150,
                                      height:150,
                                      bgcolor: 'grey',
                                      borderRadius: "50%",
                                      mb:1
                                    }}
                                  />
                                  <Box sx={{ flexGrow: 1}}>
                                    <Typography sx={{ mb: 0.5}} variant='subtitle1' fontWeight={500} color='primary'>
                                      {task.title}
                                    </Typography>
                                    <Typography sx={{ mb: 0.5}} variant="body2">
                                      {`${task.roomName}, ${task.floorName}`}
                                    </Typography>
                                    <Typography sx={{ mb: 0.5}} variant="body2">
                                      {task.due_date} | {time || "00:00 - 00:00"}
                                    </Typography>
                                    <Typography sx={{ mb: 0.5}} variant="body2">
                                      {`Tổng: ${total || 0} phút`}
                                    </Typography>
                                    <Box display='flex' flexDirection='row'>
                                      <Typography sx={{ mt:0.2}} variant="body2">
                                        {`Tiến độ:`}
                                      </Typography>
                                      <Chip sx={{ ml: 1, mb: 0.5}} label={statusLabel} color={statusColor}></Chip>
                                    </Box>
                                    <Typography sx={{ mt:0.2}} variant="body2">
                                        {`Trạng thái báo cáo: `}<b>{taskReportStatusLabel}</b>
                                    </Typography>
                                  </Box>
                                </Stack>
                                {(task.status === TaskStatus.COMPLETED && task.is_reported === 0 && roomId) && (
                                  <IconButton
                                    handleFunt={() => handleOpenReportTask(task)}
                                    icon={<Description color='primary'/>}
                                    tooltip='Báo cáo'
                                    height={22}
                                    width={22}
                                  />
                                )}
                              </Box>
                              <Divider sx={{ mb: 1}} />
                              <Grid container spacing={1.5}>
                                <Grid size={{ xs: 6}}>
                                  <Typography sx={{ mb: 0.5}} variant='body2'>
                                    {`Người thực hiện: ${profile?.full_name}`}
                                  </Typography>
                                  <Typography sx={{ mb: 0.5}} variant='body2'>
                                    {`Giới tính: ${profile?.sex || " "}`}
                                  </Typography>
                                  <Typography sx={{ mb: 0.5}} variant='body2'>
                                    {`Tuổi: ${profile?.date_of_birth && getAgeFromDateOfBirth(profile?.date_of_birth) || " "}`}
                                  </Typography>
                                  <Typography sx={{ mb: 0.5}} variant='body2'>
                                    {`Địa chỉ: ${profile?.address || " "}`}
                                  </Typography>
                                </Grid>
                                <Grid size={{ xs: 6}}>
                                  <Typography sx={{ mb: 0.5}} variant='body2'>
                                    {`Người tạo: ${task.createdPeople}`}
                                  </Typography>
                                  <Typography sx={{ mb: 0.5}} variant='body2'>
                                    {`Chức vụ: ${getRoleLabel(task.createdPeopleRole)}`}
                                  </Typography>
                                  <Typography sx={{ mb: 0.5}} variant='body2'>
                                    {`Công việc: Kiểm tra vệ sinh`}
                                  </Typography>
                                  <Typography sx={{ mb: 0.5}} variant='body2'>
                                    {`Liên hệ: ${profileUser?.phone_number || " "}`}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                      </Grid>
                    </React.Fragment>
                  )
                })
              )}
            </Grid>
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
      {profile && detailTask && openReportTask && roomId &&  (
        <ModalReportTask
          open={openReportTask}
          onClose={() => {
            setOpenReportTask(false);
            fetchListTask(page, rowPerPgae,profile.id,roomId)
          }}
          profile={profile}
          detailTask={detailTask}
        />
      )}
    </Box>
  );
};

export default StaffTaskList;
