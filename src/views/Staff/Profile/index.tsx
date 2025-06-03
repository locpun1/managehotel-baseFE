import { Avatar, Box, Button, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { Edit, PhotoCamera } from "@mui/icons-material";
import dayjs, { Dayjs } from "dayjs";
import useAuth from "@/hooks/useAuth";
import { ROLE_LABELS, RoleUser } from "@/constants/taskStatus";
import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import useNotification from "@/hooks/useNotification";
import { updateUserProfile } from "@/services/user-service";
import DateTime from "@/utils/DateTime";
import { useAppDispatch } from "@/store";
import { setProfile } from "@/slices/user";
import { UserProfile } from "@/types/users";
// import DialogUpdatedProfile from "../components/DialogUpdatedProfile";
import { getPathImage } from "@/utils/url";
import IconButton from "@/components/IconButton/IconButton";
import InputText from "@/views/Manager/components/InputText";
import DialogUpdatedProfile from "@/views/Manager/components/DialogUpdatedProfile";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL_IMAGE

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
  sex: string;
  date_of_birth: Dayjs | null;
  avatar_url: File | null;
  address: string | null;
  role: string;
  address_work?: string | null;
  phone_number: string;
  email: string | null;
}

const StaffProfile = () => {
    const today = dayjs();
    const eighteenYearsAgo = today.subtract(18, 'year').endOf('year');
    const { userId, profile } = useAuth();
    const dispatch = useAppDispatch();
    const notify = useNotification();
    const [formData, setFormData] = useState<ProfileFormData>({
        full_name: '', sex: '', date_of_birth: null, avatar_url: null,
        address: '', role: '', address_work: '', phone_number: '', email: '',
    });
    const [errors, setErrors] = useState<Partial<Record<'full_name' | 'phone_number' | 'date_of_birth' | 'sex', string>>>({});
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);
    const [initialAvatarUrl, setInitialAvatarUrl] = useState<string | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const phoneRegex = /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/;

    const handleCustomInputChange = (name: string, value: string | Dayjs | null | number) => {
        if (Object.prototype.hasOwnProperty.call(formData, name)) {
        const validName = name as keyof ProfileFormData; 
    
        setFormData((prevData) => ({
            ...prevData,
            [validName]: value, 
        }));

        if (validName === 'full_name' || validName === 'phone_number' || validName === 'date_of_birth' || validName === 'sex') {
            if(validName === 'phone_number' && typeof value === 'string'){
                const phone = value.replace(/\s|-/g, '');
                if (!/^\d+$/.test(phone)) {
                    setErrors(prev => ({
                        ...prev,
                        phone_number: 'Số điện thoại chỉ chứa số',
                    }));
                    return;
                }
                if(phone.startsWith('0') && phone.length !== 10){
                    setErrors(prev => ({
                        ...prev,
                        phone_number: 'Số điện thoại phải có 10 chữ số (nếu bắt đầu bằng 0)',
                    }));
                    return;
                }

                if(phone.startsWith('+84') && (phone.length < 11 || phone.length > 12)){
                    setErrors(prev => ({
                        ...prev,
                        phone_number: 'Số điện thoại phải có 11-12 chữ số (nếu bắt đầu bằng +84)',
                    }));
                    return;
                }

                if(!phoneRegex.test(phone)){
                    setErrors(prev => ({
                        ...prev,
                        phone_number: 'Số điện thoại không đúng định dạng (bắt đầu từ +84|03|05|07|08|09',
                    }));
                    return;
                }
            }
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

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<'full_name' | 'phone_number' | 'date_of_birth' | 'sex', string>> = {};
        if (!formData.full_name.trim()) newErrors.full_name = 'Họ và tên là bắt buộc';
        if (!formData.phone_number) newErrors.phone_number = 'Số điện thoại là bắt buộc';
        if (!formData.date_of_birth) newErrors.date_of_birth = 'Ngày sinh là bắt buộc';
        if (!formData.sex) newErrors.sex = 'Giới tính là bắt buộc';
        // Thêm validation khác nếu cần
  
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // True nếu không có lỗi
    };

    const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if(file && file.type.startsWith('image/')){
            setFormData((prevData) => ({ ...prevData, avatar_url: file}));
            const reader = new FileReader();
            reader.onloadend = () => { setAvatarPreview(reader.result as string); };
            reader.readAsDataURL(file);
        } else {
            if (!file) notify({ message: 'Vui lòng chọn file ảnh.', severity: 'warning' });
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
    } else if (initialAvatarUrl && apiBaseUrl) {
        const baseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
        const imagePath = initialAvatarUrl.startsWith('/') ? initialAvatarUrl.slice(1) : initialAvatarUrl;
        finalDisplayAvatarSrc = `${baseUrl}/${imagePath}`;
    }

    const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(!validateForm()){
            return;
        }
        
        setIsSubmitting(true);
        setSubmitSuccess(null)

        const data = new FormData();
        data.append('full_name', formData.full_name);
        data.append('sex', formData.sex);
        if(formData.date_of_birth) data.append('date_of_birth', formData.date_of_birth.toISOString());
        data.append('phone_number', formData.phone_number);
        if(formData.address_work) data.append('address_work', formData.address_work);
        if(formData.email) data.append('email', formData.email);
        if(formData.address) data.append('address', formData.address)
        if(formData.avatar_url ) data.append('avatar_url', formData.avatar_url);
        
        try {
            const res = await updateUserProfile(userId, data)
            if(res){
                const updatedProfile = res.data;
                notify({ message: 'Cập nhật thông tin thành công!', severity: 'success' });
                setSubmitSuccess(true)
                dispatch(setProfile(updatedProfile))
                setFormData({
                    full_name: '', sex: '', date_of_birth: null, avatar_url: null,
                    address: '', role: '', address_work: '', phone_number: '', email: '',
                })
                setIsEditMode(false)
                setAvatarPreview(null);
                setInitialAvatarUrl(null)
                const avatarInput = document.querySelector('input[type="file"][accept="image/*"]') as HTMLInputElement;
                if (avatarInput) avatarInput.value = '';
            }else{
                throw new Error("Phản hòi cập nhật không hợp lệ từ máy chủ.")
            }
            
        } catch (error: any) {
            const errorMessage = error.message || 'Cập nhật thông tin thất bại. Vui lòng thử lại.';
            notify({ message: errorMessage, severity: 'error' });
            setSubmitSuccess(false);
        }finally{
            setIsSubmitting(false);
        }
        
    }

    const handleRenderInfoProfile = () => {
        setIsEditMode(true)
        if(profile){
            const typedProfile = profile as UserProfile;
            setFormData({
                full_name: typedProfile.full_name,
                sex: typedProfile.sex,
                date_of_birth: typedProfile.date_of_birth ?  dayjs(typedProfile.date_of_birth) : null,
                phone_number: typedProfile.phone_number,
                avatar_url: null,
                address: typedProfile.address ?  typedProfile.address : '',
                address_work: typedProfile.address_work ?  typedProfile.address_work :  '',
                email: typedProfile.email ? typedProfile.email : '',
                role: typedProfile.role ? getRoleLabel(typedProfile.role ) : '',

            })
            const rawAvatarUrlFromApi = typedProfile.avatar_url || null;
                setInitialAvatarUrl(rawAvatarUrlFromApi);
                setAvatarPreview(null);
        }
    }
    
    return(
        <Box sx={{ p: 0.5, m:1, minHeight: "100%"}}>
            <Grid container spacing={2} alignItems="stretch" >
                {/* Hồ sơ người dùng */}
                <Grid size={{ xs: 12, md:3}}>
                    <Paper elevation={2} sx={{ padding: 2, borderRadius: '8px', border: '1px solid #e0e0e0',height: '100%' }}>
                        <Stack direction='row' justifyContent="center" alignItems="center">
                            <Typography variant="h6" align="center" fontWeight={500}> Hồ sơ người dùng</Typography>
                            <IconButton
                                handleFunt={handleRenderInfoProfile}
                                icon={<Edit color="primary"/>}
                                title="Chỉnh sửa"
                            />
                        </Stack>
                        <Box sx={{my: 1 }}>
                            <Stack direction="column" spacing={1} alignItems="center" justifyContent="center" sx={{ py:2}}>
                                <Avatar
                                    src={profile?.avatar_url ? getPathImage(profile?.avatar_url) : ""}
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
                        <DetailItem label="Ngày sinh" value={DateTime.FormatDate(profile?.date_of_birth)}/>
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
                                            disabled={!isEditMode}
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
                                                error={!!errors.full_name}
                                                helperText={errors.full_name}
                                                margin="dense"
                                                disabled={!isEditMode}
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
                                                error={!!errors.sex}
                                                helperText={errors.sex}
                                                margin="dense"
                                                disabled={!isEditMode}
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
                                                error={!!errors.date_of_birth}
                                                helperText={errors.date_of_birth}
                                                margin="dense"
                                                disabled={!isEditMode}
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
                                                disabled={!isEditMode}
                                            />
                                        </Grid>
                                        <Grid  size={{ xs: 12}}>
                                            <Typography variant="body2" fontWeight={600} gutterBottom>Công tác</Typography>
                                            <InputText
                                                label=""
                                                type="text"
                                                name="address_work"
                                                value={formData.address_work ? formData.address_work : ''}
                                                onChange={handleCustomInputChange}
                                                placeholder="Công tác"
                                                sx={{ mt: 0 }}
                                                // error={!!errors.title}
                                                // helperText={errors.title}
                                                margin="dense"
                                                disabled={!isEditMode}
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
                                                error={!!errors.phone_number}
                                                helperText={errors.phone_number}
                                                margin="dense"
                                                disabled={!isEditMode}
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
                                                disabled={!isEditMode}
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
                                                disabled={!isEditMode}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12}}>
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end'}}>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    sx={{ backgroundColor: '#00C7BE', width: '150px', position: 'relative'}}
                                                    disabled={!isEditMode}
                                                >
                                                    {isSubmitting ? 'Đang lưu...' : 'Lưu'}
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
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
            <DialogUpdatedProfile
                open={submitSuccess}
                handleClose={() => setSubmitSuccess(false)}
            />
        </Box>
    )
};

export default StaffProfile;
