import { useCachedImage } from "@/hooks/useCachedImage";
import { Rooms, Tasks } from "@/types/manager";
import { Box, Card, CardMedia, Chip, Grid, styled, Typography } from "@mui/material";
import React, { useState } from "react";
import defaultAvatar from '@/assets/images/users/default-avatar.jpg';
import IconButton from "@/components/IconButton/IconButton";
import { Delete, Edit, InsertLink, QrCodeScanner } from "@mui/icons-material";

interface InfoProps{
    data?: Rooms,
    personalPhoto?: string | null,
    handleOpenTable: (id: string | number) => void
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
    const { data, personalPhoto, handleOpenTable } = props;
    
    const cachedImgSrc = useCachedImage(personalPhoto);
    const imgSrc = cachedImgSrc ?? defaultAvatar;

    

    return (
        <ObjectCardStyled onClick={() => data !== undefined && handleOpenTable(data.id)} variant="outlined">
            <Grid container spacing={1}>
                <Grid item xs={12} md={5}>
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
                    <Grid sx={{ ml: { xs: 1, md: 0}}} container>
                        <Grid xs={12}>
                            <Box sx={{ mb:1 }} display='flex' justifyContent='space-between'>
                                <Typography variant="body2">{`Số phòng: Phòng ${data?.room_number}`}</Typography>
                                <Box sx={{ mx:1, mt:-0.5}}>
                                    <IconButton
                                        handleFunt={() => {}}
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
                        </Grid>
                        <Grid xs={12}>
                            <Typography sx={{ mb:1}} variant="body2">{`Số tầng: ${data?.floorName}`}</Typography>
                        </Grid>
                        <Grid xs={12}>
                            <Typography sx={{ mb:1}} variant="body2">Công việc: Dọn dẹp tổng vệ sinh phòng</Typography>
                        </Grid>
                        <Grid xs={12}>
                            <Typography sx={{ mb:1}} variant="body2">Thời gian: 00h00 - 00h00, 27/05/2025</Typography></Grid>
                        <Grid xs={12}>
                            <Chip sx={{ width: 150, my:1.5 }} label='Chưa làm' color="primary"/>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </ObjectCardStyled>
    )
}
export default CardInfo;