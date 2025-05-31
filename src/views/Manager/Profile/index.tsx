import { Avatar, Box, Button, Paper, Stack, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import avatar1 from '@/assets/images/users/avatar-1.png';
import { PhotoCamera } from "@mui/icons-material";
import InputText from "../components/InputText";
import dayjs, { Dayjs } from "dayjs";
import useAuth from "@/hooks/useAuth";
import { ROLE_LABELS, RoleUser } from "@/constants/taskStatus";
import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import useNotification from "@/hooks/useNotification";

interface DetailItemProps {
    label: string;
    value: React.ReactNode;
}
const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
    <Grid container spacing={1} sx={{ mt: 1, mx:4 }}>
            <Grid size={{ xs: 4 }}>
                <Typography variant="body1" fontWeight={400} sx={{ fontWeight: 'medium' }}>
                    {label}:
                </Typography>
            </Grid>
            <Grid size={{ xs: 8 }} >
                {typeof value === 'string' || typeof value === 'number' ? (
                    <Typography variant="body1" component="span" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {value || '-'}
                    </Typography>
                ) : (
                    value || '-'
                )}
            </Grid>
    </Grid>
);

const getRoleLabel = (role: RoleUser | null | undefined): string => {
    if(!role) return "Chưa xác định";
    return ROLE_LABELS[role] || role;
}

interface ProfileFormData {
  full_name: string;
  sex: string | null;
  date_of_birth: Dayjs | null;
  avatar_url: File | null;
  address: string | null;
  role: string;
  address_work: string | null;
  phone_number: string | null;
  email: string | null;
}

function ProfileManager (){
    const today = dayjs();
    const eighteenYearsAgo = today.subtract(18, 'year');
    const { profile } = useAuth();
    const notify = useNotification();
    const [formData, setFormData] = useState<ProfileFormData>({
        full_name: '', sex: '', date_of_birth: null, avatar_url: null,
        address: '', role: getRoleLabel(profile?.role), address_work: '', phone_number: '', email: '',
    });
    const [errors, setErrors] = useState<Partial<Record<'full_name' | 'phone_number' | 'date_of_birth' | 'sex', string>>>({});
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const handleCustomInputChange = (name: string, value: string | Dayjs | null | number) => {
        if (Object.prototype.hasOwnProperty.call(formData, name)) {
        const validName = name as keyof ProfileFormData; 
    
        setFormData((prevData) => ({
            ...prevData,
            [validName]: value, 
        }));

        if (validName === 'full_name' || validName === 'phone_number' || validName === 'date_of_birth' || validName === 'sex') {
            if (errors[validName as 'full_name' | 'phone_number' | 'date_of_birth' | 'sex']) {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[validName as 'full_name' | 'phone_number' | 'date_of_birth' | 'sex'];
                    return newErrors;
                });
            }
        }
        } else {
        console.warn(`CustomInput called onChange with an unexpected name: ${name}`);
        }
    };

    const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if(file && file.type.startsWith('image/')){
            setFormData((prevData) => ({ ...prevData, avatar_url: file}));
            const reader = new FileReader();
            reader.onloadend = () => { setAvatarPreview(reader.result as string); };
            reader.readAsDataURL(file);
        } else {
            if (file) notify({ message: 'Vui lòng chọn file ảnh.', severity: 'warning' });
            setFormData(prev => ({ ...prev, avatarFile: null }));
            setAvatarPreview(null);
            event.target.value = '';
        }
    }

    useEffect(() => {
    let objectUrl: string | null = null;
    if (avatarPreview && (avatarPreview.startsWith('blob:') || avatarPreview.startsWith('data:'))) {
      if (avatarPreview.startsWith('blob:')) objectUrl = avatarPreview;
    }
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
    }, [avatarPreview]);

    let finalDisplayAvatarSrc: string | undefined = undefined;
    if (avatarPreview) {
        finalDisplayAvatarSrc = avatarPreview;
    } 
//   else if (initialAvatarUrl && apiBaseUrl) {
//     const baseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
//     const imagePath = initialAvatarUrl.startsWith('/') ? initialAvatarUrl.slice(1) : initialAvatarUrl;
//     finalDisplayAvatarSrc = `${baseUrl}/${imagePath}`;
//   }

    const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("formData: ",formData);
        
    }
    
    return(
        <Box sx={{ p: 1, m:1, minHeight: "100%"}}>
            <Grid container spacing={2} alignItems="stretch" >
                {/* Hồ sơ người dùng */}
                <Grid size={{ xs: 12, md:3}}>
                    <Paper elevation={2} sx={{ padding: 2, borderRadius: '8px', border: '1px solid #e0e0e0',height: '100%' }}>
                        <Typography variant="h6" align="center" fontWeight={500}> Hồ sơ người dùng</Typography>
                        <Box sx={{my: 1 }}>
                            <Stack direction="column" spacing={1} alignItems="center" justifyContent="center" sx={{ py:2}}>
                                <Avatar
                                    src={avatar1}
                                    sx={{ width: 120, height: 120, bgcolor: 'grey.300', borderRadius:'50%', mb:2 }}
                                >
                                </Avatar>
                                <Typography fontWeight='bold'>{profile?.full_name}</Typography>
                                <Typography sx={{ color: 'text.secondary', fontStyle: "italic"}}>{getRoleLabel(profile?.role) || " - "}</Typography>
                            </Stack>
                        </Box>
                        <Box sx={{ mx:4}} display='flex' flexDirection='column'>
                            <Typography variant="body1" sx={{ color: 'text.secondary'}}>Thông tin cá nhân</Typography>
                        </Box>
                        <DetailItem label="Tên" value={profile?.full_name}/>
                        <DetailItem label="Giới tính" value={profile?.sex}/>
                        <DetailItem label="Ngày sinh" value={profile?.date_of_birth}/>
                        <DetailItem label="Chức vụ" value={getRoleLabel(profile?.role)}/>
                        <DetailItem label="Công tác" value={profile?.address_work}/>
                        <Box sx={{ mx:4, mt:4}} display='flex' flexDirection='column'>
                            <Typography variant="body1" sx={{ color: 'text.secondary'}}>Thông tin liên lạc</Typography>
                        </Box>
                        <DetailItem label="Địa chỉ" value={profile?.address}/>
                        <DetailItem label="Điện thoại" value={profile?.phone_number} />
                        <DetailItem label="Email" value={profile?.email} />
                    </Paper>
                </Grid>

                {/* Chỉnh sửa thông tin người dùng */}
                <Grid size={{ xs: 12, md: 9}}>
                    <Paper elevation={2} sx={{ padding: 2, borderRadius: '8px', border: '1px solid #e0e0e0', height: '100%' }}>
                        <Box onSubmit={handleSubmit} component='form' sx={{my: 1 }}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs:12 }} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: { md: 2.5 } }}>
                                    <Box sx={{ position: 'relative', width: 180, height: 180 }}>
                                        <Avatar src={finalDisplayAvatarSrc} sx={{ width: '100%', height: '100%', mb: 2, bgcolor: 'grey.300', borderRadius:'50%' }} />
                                        <Button 
                                            variant="contained" 
                                            sx={{ 
                                                backgroundColor:'#00C7BE', 
                                                borderRadius: '50%', 
                                                minWidth: '35px', 
                                                width: '35px', 
                                                height: '35px', 
                                                position: 'absolute', 
                                                bottom: 6,
                                                right: 12,
                                            }} 
                                            component="label" 
                                            startIcon={<PhotoCamera sx={{  width: '25px', height: '25px', ml: 1.2}} />}
                                        >
                                            <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
                                        </Button>
                                    </Box>
                                </Grid>
                                <Grid sx={{ mt: 2}} size={{ xs: 12}}>
                                    <Grid container spacing={2}>
                                        <Grid  size={{ xs: 12, md: 6}}>
                                            <Typography variant="body2" fontWeight={600} gutterBottom>Họ và tên</Typography>
                                            <InputText
                                                label=""
                                                type="text"
                                                name="full_name"
                                                value={formData.full_name}
                                                onChange={handleCustomInputChange}
                                                placeholder="Họ và tên"
                                                sx={{ mt: 0 }}
                                                // error={!!errors.title}
                                                // helperText={errors.title}
                                                margin="dense"
                                            />
                                        </Grid>
                                        <Grid  size={{ xs: 12, md: 6}}>
                                            <Typography variant="body2" fontWeight={600} gutterBottom>Giới tính</Typography>
                                            <InputText
                                                label=""
                                                type="text"
                                                name="sex"
                                                value={formData.sex}
                                                onChange={handleCustomInputChange}
                                                placeholder="Nam/nữ"
                                                sx={{ mt: 0 }}
                                                // error={!!errors.title}
                                                // helperText={errors.title}
                                                margin="dense"
                                            />
                                        </Grid>
                                        <Grid  size={{ xs: 12, md: 6}}>
                                            <Typography variant="body2" fontWeight={600} gutterBottom>Ngày sinh</Typography>
                                            <InputText
                                                label=""
                                                type="date"
                                                name="date_of_birth"
                                                value={formData.date_of_birth}
                                                onChange={(name, value) => handleCustomInputChange(name, value as Dayjs | null)}
                                                placeholder="Ngày sinh"
                                                sx={{ mt: 0 }}
                                                maxDate={eighteenYearsAgo}
                                                // error={!!errors.title}
                                                // helperText={errors.title}
                                                margin="dense"
                                            />
                                        </Grid>
                                        <Grid  size={{ xs: 12, md: 6}}>
                                            <Typography variant="body2" fontWeight={600} gutterBottom>Chức vụ</Typography>
                                            <InputText
                                                label=""
                                                type="text"
                                                name="role"
                                                value={formData.role}
                                                onChange={() => {}}
                                                placeholder="Chức vụ"
                                                sx={{ mt: 0 }}
                                                // error={!!errors.title}
                                                // helperText={errors.title}
                                                margin="dense"
                                            />
                                        </Grid>
                                        <Grid  size={{ xs: 12}}>
                                            <Typography variant="body2" fontWeight={600} gutterBottom>Công tác</Typography>
                                            <InputText
                                                label=""
                                                type="text"
                                                name="address_work"
                                                value={formData.address_work}
                                                onChange={handleCustomInputChange}
                                                placeholder="Công tác"
                                                sx={{ mt: 0 }}
                                                // error={!!errors.title}
                                                // helperText={errors.title}
                                                margin="dense"
                                            />
                                        </Grid>
                                        <Grid  size={{ xs: 12, md: 6}}>
                                            <Typography variant="body2" fontWeight={600} gutterBottom>Điện thoại</Typography>
                                            <InputText
                                                label=""
                                                type="text"
                                                name="phone_number"
                                                value={formData.phone_number}
                                                onChange={handleCustomInputChange}
                                                placeholder="Điện thoại"
                                                sx={{ mt: 0 }}
                                                // error={!!errors.title}
                                                // helperText={errors.title}
                                                margin="dense"
                                            />
                                        </Grid>
                                        <Grid  size={{ xs: 12, md: 6}}>
                                            <Typography variant="body2" fontWeight={600} gutterBottom>Email</Typography>
                                            <InputText
                                                label=""
                                                type="text"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleCustomInputChange}
                                                placeholder="Email"
                                                sx={{ mt: 0 }}
                                                // error={!!errors.title}
                                                // helperText={errors.title}
                                                margin="dense"
                                            />
                                        </Grid>
                                        <Grid  size={{ xs: 12}}>
                                            <Typography variant="body2" fontWeight={600} gutterBottom>Địa chỉ</Typography>
                                            <InputText
                                                label=""
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleCustomInputChange}
                                                placeholder="Địa chỉ"
                                                sx={{ mt: 0 }}
                                                // error={!!errors.title}
                                                // helperText={errors.title}
                                                margin="dense"
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12}}>
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end'}}>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    sx={{ backgroundColor: '#00C7BE', width: '150px'}}
                                                    
                                                >
                                                    Lưu
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )
}

export default ProfileManager;