import IconButton from "@/components/IconButton/IconButton";
import { UserProfile } from "@/types/users";
import { Close, PhotoCamera } from "@mui/icons-material";
import { Box, Button, Card, CardMedia, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { Tasks } from "@/types/manager";
import { useCallback, useEffect, useState, ChangeEvent, useRef, FormEvent } from "react";
import { useParams } from "react-router-dom";
import { getProfileUserCreateTaskAttachedRoom } from "@/services/user-service";
import InputText from "@/views/Manager/components/InputText";
import { ReportStatus } from "@/constants/taskStatus";
import useNotification from "@/hooks/useNotification";
import { sendReportTask } from "@/services/report-service";
import dayjs, { Dayjs } from "dayjs";

interface ModalReportTaskProps{
    open: boolean, 
    onClose: () => void;
    profile: UserProfile;
    detailTask: Tasks
}

interface ReportFormData{
    reported_by_id: number | string;
    room_id: number | String;
    task_id: number | string;
    title: string;
    description: string;
    image_url: File | null;
    status: ReportStatus;
    date_today: string
}

const MAX_IMAGE_SIZE = 800; // px

const ModalReportTask = (props: ModalReportTaskProps) => {
    const { roomId } = useParams<{ roomId: string }>();
    const { open, onClose, profile, detailTask } = props;
    const [error, setError] = useState<string | null>(null);
    const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
    const [errorProfile, setErrorProfile] = useState<string | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const notify = useNotification();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errors, setErrors] = useState<Partial<Record<'description' | 'image_url', string>>>({});
    
    const [formData, setFormData] = useState<ReportFormData>({
        reported_by_id: profile.id, room_id: detailTask.room_id , task_id: detailTask.id, title: detailTask.title, description: '',
        image_url: null, status: ReportStatus.NEW, date_today: dayjs().toISOString()
    })

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
        setFormData({
            reported_by_id: profile.id, room_id: detailTask.room_id , task_id: detailTask.id, title: detailTask.title, description: '',
            image_url: null, status: ReportStatus.NEW, date_today: dayjs().toISOString()
        })
        setImagePreview(null)
    }

    const handleCustomInputChange = (name: string, value: string | Dayjs | null | number) => {
        if (Object.prototype.hasOwnProperty.call(formData, name)) {
        const validName = name as keyof ReportFormData; 
    
        setFormData((prevData) => ({
            ...prevData,
            [validName]: value, 
        }));

        if (validName === 'description' || validName === 'image_url') {
            if (errors[validName as 'description' || validName as 'image_url']) {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[validName as 'description'];
                    return newErrors;
                });
            }
        }
        } else {
        console.warn(`CustomInput called onChange with an unexpected name: ${name}`);
        }
    }

    const resizeImage = (
        file: File,
        maxSize: number
    ): Promise<{ blob: Blob; previewUrl: string }> => {
        return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === "string") {
            img.src = reader.result;
            }
        };

        img.onload = () => {
            const canvas = document.createElement("canvas");
            let width = img.width;
            let height = img.height;

            if (width > height) {
            if (width > maxSize) {
                height = Math.round((height *= maxSize / width));
                width = maxSize;
            }
            } else {
            if (height > maxSize) {
                width = Math.round((width *= maxSize / height));
                height = maxSize;
            }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (!ctx) return reject(new Error("Canvas context not found"));

            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
            (blob) => {
                if (blob) {
                resolve({
                    blob,
                    previewUrl: URL.createObjectURL(blob),
                });
                } else {
                reject(new Error("Resize failed"));
                }
            },
            "image/jpeg",
            0.8
            );
        };

        reader.onerror = reject;
        reader.readAsDataURL(file);
        });
    };


    const handleImageChange = async(event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if(file && file.type.startsWith('image/')){
            const { blob, previewUrl } = await resizeImage(file, MAX_IMAGE_SIZE);
            const newFile = new File([blob], file.name, { type: "image/jpeg" })
            setFormData((prevData) => ({ ...prevData, image_url: newFile}))
            setImagePreview(previewUrl)
        }else{
            if (!file) notify({ message: 'Vui lòng chọn file ảnh.', severity: 'warning' });
            setFormData(prev => ({ ...prev, avatarFile: null }));
            setImagePreview(null);
            event.target.value = "";
        }

        //Reset lại input để onChange được gọi nếu chọn lại cùng 1 ảnh
        if(fileInputRef.current){
            fileInputRef.current.value = "";
        }
    }

    useEffect(() => {
        let objectUrl: string | null = null;
        if (imagePreview && (imagePreview.startsWith('blob:') || imagePreview.startsWith('data:'))) {
          if (imagePreview.startsWith('blob:')) objectUrl = imagePreview;
        }
        return () => {
          if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
          }
        };
    }, [imagePreview]);

    let finalDisplayAvatarSrc: string | undefined = undefined;
    if (imagePreview) {
        finalDisplayAvatarSrc = imagePreview;
    } 
    // else if (initialAvatarUrl && apiBaseUrl) {
    //     const baseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
    //     const imagePath = initialAvatarUrl.startsWith('/') ? initialAvatarUrl.slice(1) : initialAvatarUrl;
    //     finalDisplayAvatarSrc = `${baseUrl}/${imagePath}`;
    // }

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<'description' | 'image_url', string>> = {};
        if(!formData.description.trim()) newErrors.description = 'Vấn đề báo cáo không được bỏ trống';
        if(!formData.image_url) newErrors.image_url = "Hình ảnh bắt buộc phải chụp"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0;
    }
    const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(!validateForm()){
            return;
        }
        setIsSubmitting(true)
        const data = new FormData();
        data.append('reported_by_id', String(formData.reported_by_id));
        data.append('room_id', String(formData.room_id));
        data.append('task_id', String(formData.task_id));
        data.append('title', formData.title);
        if(formData.description) data.append('description', formData.description)
        if(formData.image_url) data.append('image_url', formData.image_url);
        if(formData.date_today) data.append('date_today', formData.date_today);

        try {
            await sendReportTask(data);
            handleClose()
            notify({
                message: "Gửi báo cáo công việc thành công",
                severity: 'success'
            })
        } catch (error) {
            notify({
                message: "Gửi báo cáo công việc thất bại",
                severity: 'error'
            })
        }finally{
            setIsSubmitting(false)
        }
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
                <Typography variant="h6">Báo cáo công việc</Typography>
                <IconButton
                    handleFunt={handleClose}
                    icon={<Close sx={{ color: (theme) => theme.palette.grey[800]}}/>}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                />
            </DialogTitle>
            <DialogContent dividers>
                <Box id="send-report-task" component='form' onSubmit={handleSubmit}>
                    <Grid container>
                        <Grid size={{ xs: 12}}>
                            <Typography variant="body2" fontWeight={600} gutterBottom>Người dọn dẹp</Typography>
                            <InputText
                                label=""
                                type="text"
                                name="reported_by_id"
                                value={profile.full_name}
                                onChange={handleCustomInputChange}
                                placeholder="Người dọn dẹp"
                                sx={{ mt: 0}}
                                margin="dense"
                            />
                        </Grid>
                        <Grid size={{ xs: 12}}>
                            <Typography variant="body2" fontWeight={600} gutterBottom>Số tầng/phòng</Typography>
                            <InputText
                                label=""
                                type="text"
                                name="room_id"
                                value={`${detailTask.floorName}/${detailTask.roomName}`}
                                onChange={handleCustomInputChange}
                                placeholder="Tầng/phòng"
                                sx={{ mt: 0}}
                                margin="dense"
                            />
                        </Grid>
                        <Grid size={{ xs: 12}}>
                            <Typography variant="body2" fontWeight={600} gutterBottom>Tên công việc</Typography>
                            <InputText
                                label=""
                                type="text"
                                name="title"
                                value={detailTask.title}
                                onChange={handleCustomInputChange}
                                placeholder="Tên công việc"
                                sx={{ mt: 0}}
                                margin="dense"
                            />
                        </Grid>
                        <Grid size={{ xs: 12}}>
                            <Typography variant="body2" fontWeight={600} gutterBottom>Vấn đề báo cáo</Typography>
                            <InputText
                                label=""
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleCustomInputChange}
                                placeholder="Vấn đề báo cáo"
                                sx={{ mt: 0}}
                                margin="dense"
                                error={!!errors.description}
                                helperText={errors.description}
                                multiline={true}
                                rows={4}
                            />
                        </Grid>
                        <Grid size={{ xs: 12}}>
                            <Typography variant="body2" fontWeight={600} gutterBottom>Hình ảnh</Typography>
                            <Button 
                                variant="contained" 
                                component="label"
                                sx={{ bgcolor: '#00C7BE'}}
                                startIcon={<PhotoCamera/>}
                            >
                                Chụp ảnh/ chọn ảnh
                                <input
                                    type="file"
                                    accept="image/"
                                    capture="environment"
                                    hidden
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                />
                            </Button>
                            {errors.image_url && !finalDisplayAvatarSrc && (
                                <Typography color="error" sx={{ mt: 1}} variant="body2">{errors.image_url}</Typography>
                            )}
                            {finalDisplayAvatarSrc && (
                                <Card sx={{ position:'relative', maxWidth: 300, margin: '10px auto'}}>
                                    <IconButton
                                        handleFunt={() => {
                                            setImagePreview(null);
                                            setFormData(prev => ({ ...prev, image_url: null }));
                                        }}
                                        icon={<Close sx={{ color: (theme) => theme.palette.grey[800]}}/>}
                                        sx={{ position: 'absolute', right: -10, top: -5 }}
                                    />
                                    <CardMedia
                                        component='img'
                                        height={200}
                                        image={finalDisplayAvatarSrc}
                                        alt="Ảnh"
                                        sx={{ objectFit: 'contain' }}
                                    />
                                </Card>
                            )}
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    type="submit"
                    form="send-report-task"
                    onClick={() => {}}
                    sx={{ bgcolor: '#00C7BE'}}
                >
                    {isSubmitting ? "Đang gửi....." : "Gửi"}
                    {isSubmitting && (
                        <CircularProgress
                            size={24}
                            sx={{
                                color: 'primary.contrastText',
                                position: 'absolute',
                                top: '50%', left: '50%',
                                marginTop: '-12px', marginLeft: '-12px',
                            }}
                        />
                    )}
                </Button>
                <Button 
                    onClick={handleClose} 
                    sx={{ color: '#00C7BE', border: "1px solid #00C7BE"}}
                    variant="outlined"
                >
                    Hủy
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ModalReportTask;