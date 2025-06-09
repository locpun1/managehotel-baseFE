import { useCachedImage } from "@/hooks/useCachedImage";
import { Rooms, Tasks } from "@/types/manager";
import { Box, Card, CardMedia, Chip, Grid, styled, Typography } from "@mui/material";
import React from "react";
import defaultAvatar from '@/assets/images/users/default-avatar.jpg';
import IconButton from "@/components/IconButton/IconButton";
import { Delete, Edit, InsertLink, QrCodeScanner } from "@mui/icons-material";
import DateTime from "@/utils/DateTime";
import { TaskStatus } from "@/constants/taskStatus";

interface InfoProps{
    data?: Rooms,
    personalPhoto?: string | null,
    handleOpenTable: (id: string | number) => void,
    handleGenerate: (id: string | number) => void,
}

const ObjectCardStyled = styled(Card)(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
    transition: 'box-shadow 0.3s ease-in-out',
    '&:hover':{
        boxShadow: theme.shadows[6],
    },
    border:`1px solid ${theme.palette.divider}`,
    cursor:"pointer"
}));

const CardInfo: React.FC<InfoProps> = (props) => {
    const { data, personalPhoto, handleOpenTable, handleGenerate } = props;
    
    const cachedImgSrc = useCachedImage(personalPhoto);
    const imgSrc = cachedImgSrc ?? defaultAvatar;

    const getCardStatus = (status: TaskStatus) : 'Đang trong quá trình' | 'Hoàn thành' | 'Chưa bắt đầu' | 'Hủy' => {
        if(status === "in_progress"){
            return "Đang trong quá trình";
        }
        if(status === "completed"){
            return "Hoàn thành";
        }
        if(status === "completed"){
            return "Hoàn thành"
        }
        
        return "Chưa bắt đầu";
    }

    
    const getDateTime = (data: Rooms) : string => {
        const batDau = DateTime.FormatHour(data?.started_at) || ' 00:00 ';
        const ketThuc = DateTime.FormatHour(data?.completed_at) || ' 00:00 ';
        return `${batDau} - ${ketThuc}, ${DateTime.FormatDate(data.due_date)}`
    }

    const date = data && getDateTime(data);
    


    const status = data && getCardStatus(data.statusTask);
    
    const getStatusColor = (status: string) => {
        switch(status){
            case 'Đang trong quá trình':
                return 'warning';
            case 'Hoàn thành':
                return 'success';
            case 'Hủy':
                return 'error';
            default:
                return 'primary';
        }
    }
    return (
        <ObjectCardStyled variant="outlined">
            <Grid container spacing={1}>
                <Grid item xs={12} md={5} onClick={() => data !== undefined && handleOpenTable(data.id)}>
                    <CardMedia
                        component='img'
                        image={imgSrc}
                        onError={(e) => {
                        //Chỉ đổi sang defaultAvatar nếu thực sự lỗi (không có cachedImgSrc)
                            if(!cachedImgSrc){
                                (e.target as HTMLImageElement).src = defaultAvatar;
                            }
                        }}
                        alt="Avatar"
                        sx={{
                            objectFit: 'cover',
                            backgroundColor: '#f5f5f5',
                            height: "200px",
                            width:"100%",
                        }}
                    />
                </Grid>
                <Grid sx={{ mt: 2}} item xs={12} md={7}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box onClick={() => data !== undefined && handleOpenTable(data.id)}>
                            <Typography variant="body2" component="span">Số phòng: </Typography>
                            <Typography variant="body2" component="span" fontWeight="bold">{data?.room_number}</Typography>
                        </Box>
                        <Box sx={{ mx:1}}>
                            <IconButton
                                handleFunt={() => data !== undefined && handleGenerate(data.id)}
                                icon={<InsertLink color="primary" sx={{ width:"20px", height: "20px"}} />}
                                height={22}
                                width={22}
                                tooltip="Tạo link"
                            />
                            <IconButton
                                handleFunt={() => {}}
                                icon={<QrCodeScanner color="success" sx={{ width:"20px", height: "20px"}}/>}
                                height={22}
                                width={22}
                                tooltip="Tạo QR"
                            />
                            <IconButton
                                handleFunt={() => {}}
                                icon={<Edit color="info" sx={{ width:"20px", height: "20px"}}/>}
                                height={22}
                                width={22}
                                tooltip="Sửa"
                            />
                            <IconButton
                                handleFunt={() => {}}
                                icon={<Delete color="error" sx={{ width:"20px", height: "20px"}}/>}
                                height={22}
                                width={22}
                                tooltip="Xóa"
                            />
                        </Box>
                    </Box>
                    <Box sx={{ mb:1}} onClick={() => data !== undefined && handleOpenTable(data.id)}>
                        <Typography variant="body2">{`Số tầng: ${data?.floorName}`}</Typography>
                    </Box>
                    <Box sx={{ mb:1}} onClick={() => data !== undefined && handleOpenTable(data.id)}>
                        <Typography variant="body2">{`Công việc: ${data?.taskName}`}</Typography>
                    </Box>
                    <Box sx={{ mb:1}} onClick={() => data !== undefined && handleOpenTable(data.id)}>
                        <Typography variant="body2">{`Thời gian: ${date}`}</Typography>
                    </Box>
                    <Box onClick={() => data !== undefined && handleOpenTable(data.id)}>
                        {status && <Chip sx={{ width: 150, my:1.5 }} label={status} color={getStatusColor(status)}/>}
                    </Box>
                </Grid>
            </Grid>
        </ObjectCardStyled>
    )
}
export default CardInfo;