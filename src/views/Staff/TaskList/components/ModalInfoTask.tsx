import IconButton from "@/components/IconButton/IconButton";
import { UserProfile } from "@/types/users";
import { Close } from "@mui/icons-material";
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, Typography } from "@mui/material";
import avatar from "@/assets/images/users/default-avatar.jpg"
import { getPathImage } from "@/utils/url";
import DateTime, { getAgeFromDateOfBirth } from "@/utils/DateTime";
import Grid from '@mui/material/Grid2';
import { Tasks } from "@/types/manager";
import { useCallback, useEffect, useState } from "react";
import { getProfileUserCreateTaskAttachedRoom } from "@/services/user-service";
import { getRoleLabel } from "@/utils/labelEnToVni";
import ModalReportTask from "./ModalReportTask";
import { TaskStatus } from "@/constants/taskStatus";
import dayjs, { Dayjs } from "dayjs";
import { ID_ROOM } from "../../Home";

interface ModalInfoTaskProps{
    open: boolean, 
    onClose: () => void;
    profile: UserProfile;
    detailTask: Tasks,
    setOpenReportTask: React.Dispatch<React.SetStateAction<boolean>>,
    openReportTask: boolean
}

const ModalInfoTask = (props: ModalInfoTaskProps) => {
    const roomId = localStorage.getItem(ID_ROOM)
    const { open, onClose, profile, detailTask, setOpenReportTask, openReportTask } = props;
    const [error, setError] = useState<string | null>(null);
    const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
    const [errorProfile, setErrorProfile] = useState<string | null>(null)
    
    const fetchProfileUserCreatedTask = useCallback(async() => {
        if (!roomId) {
          setError("Room ID không hợp lệ.");
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
        if(roomId){
           fetchProfileUserCreatedTask() 
        }
    },[roomId])
    const handleClose = () => {
        onClose()
    }

    const handleReportTask = () => {
        setOpenReportTask(true)
        handleClose()
    }

    const getTime = (startDate: string | Dayjs| Date | null, completeDate: string | Dayjs| Date | null) : string => {
        const startHour = DateTime.FormatHour(startDate);
        const completeHour = DateTime.FormatHour(completeDate);
        return `${startHour} - ${completeHour}`
    }

    const getMinutesDiff = (startDate: string | Dayjs| Date | null, completeDate: string | Dayjs| Date | null): number => {
        const start = DateTime.FormatHour(startDate);
        const complete = DateTime.FormatHour(completeDate);
        if(start && complete){
            const [startHour, startMinute] = start.split(':').map(Number);
            const [endHour, endMinute] = complete.split(':').map(Number);
            const startDate = new Date(0, 0, 0, startHour, startMinute);
            const endDate = new Date(0, 0, 0, endHour, endMinute);
            const diffMs = endDate.getTime() - startDate.getTime();
            return Math.floor(diffMs / 60000); // 60,000 ms = 1 phút
        }
        return 0;
    }

    return(
        <Dialog 
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            scroll="paper"
            aria-labelledby="info-task-dialog-title"
        >
            <DialogTitle id='info-task-dialog-title'>
                <IconButton
                    handleFunt={handleClose}
                    icon={<Close sx={{ color: (theme) => theme.palette.grey[800]}}/>}
                    sx={{ position: 'absolute', right: 8, top: 0 }}
                />
            </DialogTitle>
            <DialogContent dividers>
                <Stack direction={{ xs: 'column', sm: 'row'}} spacing={3} sx={{ mb: 3 }} alignItems="center">
                    <Avatar
                        src={profile?.avatar_url ? getPathImage(profile?.avatar_url) : avatar}
                        sx={{ width: 150, height: 150, bgcolor: 'grey', borderRadius:'50%', mb:2 }}
                    />
                    <Box sx={{ flexGrow: 1}}>
                        <Typography variant="h5" fontWeight={500}>{profile.full_name}</Typography>
                        <Typography variant="body2">{`Giới tính: ${profile.sex || " "}`}</Typography>
                        <Typography variant="body2">{`Tuổi: ${getAgeFromDateOfBirth(profile.date_of_birth) || " "}`}</Typography>
                        <Typography variant="body2">{`Địa chỉ: ${profile.address || " "}`}</Typography>
                    </Box>
                </Stack>
                <Divider sx={{ my: 1}}/>
                <Typography sx={{ textAlign: { xs:'center', sm: 'start'}}} fontWeight={500} variant="h6">Thông tin công việc</Typography>
                <Grid container sx={{ mt: 2}}>
                    <Grid size={{ xs: 12, sm: 6}}>
                        <Box
                            sx={{
                                display: { xs: 'flex', sm: 'block' },              // flex khi xs, block khi sm
                                justifyContent: { xs: 'center', sm: 'flex-start' },// căn giữa ngang khi xs
                                alignItems: { xs: 'center' },                      // căn giữa dọc nếu cần
                                textAlign: { xs: 'center', sm: 'left' },           // căn giữa chữ nếu muốn
                                borderBottom: { xs: '1px solid #E0E0E0', sm: '0'},
                                mb: {xs: 2, sm: 0}
                            }}
                        >
                            <Box sx={{ borderRight: { sm: '1px solid #E0E0E0'} , pr: { sm: 2} }}>
                                <Stack direction='row'>
                                    <Typography variant="body2" fontWeight={500}>Tầng: </Typography>
                                    <Typography variant="body2">{detailTask.floorName}</Typography>
                                </Stack>
                                <Stack direction='row'>
                                    <Typography variant="body2" fontWeight={500}>Phòng: </Typography>
                                    <Typography variant="body2">{detailTask.roomName}</Typography>
                                </Stack>
                                <Stack direction='row'>
                                    <Typography variant="body2" fontWeight={500}>Công việc: </Typography>
                                    <Typography variant="body2">{detailTask.title}</Typography>
                                </Stack>
                                <Stack direction='row'>
                                    <Typography variant="body2" fontWeight={500}>Thời gian: </Typography>
                                    {detailTask.started_at && detailTask.completed_at &&<Typography variant="body2">{getTime(detailTask.started_at, detailTask.completed_at)}</Typography>}
                                </Stack>
                                <Stack direction='row' sx={{ mb: {xs: 2, sm: 0}}}>
                                    <Typography variant="body2" fontWeight={500}>Tổng : </Typography>
                                    {detailTask.started_at && detailTask.completed_at &&<Typography variant="body2">{`${getMinutesDiff(detailTask.started_at, detailTask.completed_at)} phút`}</Typography>}
                                </Stack>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6}}>
                        <Box
                            sx={{
                                display: { xs: 'flex', sm: 'block' },              // flex khi xs, block khi sm
                                justifyContent: { xs: 'center', sm: 'flex-start' },// căn giữa ngang khi xs
                                alignItems: { xs: 'center' },                      // căn giữa dọc nếu cần
                                textAlign: { xs: 'center', sm: 'left' },           // căn giữa chữ nếu muốn
                            }} 
                        >
                            <Box sx={{ml: { xs: 0, sm: 5}}}>
                                <Stack direction='row'>
                                    <Typography variant="body2" fontWeight={500}>Tên: </Typography>
                                    <Typography variant="body2">{profileUser?.full_name || " "}</Typography>
                                </Stack>
                                <Stack direction='row'>
                                    <Typography variant="body2" fontWeight={500}>Chức vụ: </Typography>
                                    <Typography variant="body2">{getRoleLabel(profileUser?.role)}</Typography>
                                </Stack>
                                <Stack direction='row'>
                                    <Typography variant="body2" fontWeight={500}>Công việc: </Typography>
                                    <Typography variant="body2">{`Kiểm tra vệ sinh`}</Typography>
                                </Stack>
                                <Stack direction='row' sx={{ mb: {xs: 2, sm: 0}}}>
                                    <Typography variant="body2" fontWeight={500}>Liên hệ: </Typography>
                                    <Typography variant="body2">{profileUser?.phone_number || " "}</Typography>
                                </Stack>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                {detailTask.status === TaskStatus.COMPLETED && detailTask.is_reported === 0 &&  (
                    <Button
                        onClick={handleReportTask}
                        sx={{ color: '#00C7BE', border: "1px solid #00C7BE"}}
                        variant="outlined"
                    >
                        Báo cáo
                    </Button>
                )}
                <Button onClick={handleClose} sx={{ bgcolor: "#00C7BE"}}>
                    Hủy
                </Button>
            </DialogActions>
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
        </Dialog>
    )
}

export default ModalInfoTask;