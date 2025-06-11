import { UserProfile } from "@/types/users";
import { Avatar, Box, Button, Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import { useState } from "react";
import avatar from "@/assets/images/users/default-avatar.jpg"
import { getPathImage } from "@/utils/url";
import { getRoleLabel } from "@/utils/labelEnToVni";
import Grid from '@mui/material/Grid2';
import PhoneContact from "./PhoneContact";

interface CardInfoManagerProps{
    data: UserProfile
}

const CardInfoManager = ({data} : CardInfoManagerProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    return(
        <Card sx={{ mb: 1.5, border: "1px solid #e0e0e0"}}>
            <CardContent>
                <Stack direction='column' alignItems='center' justifyContent='center'>
                    <Avatar
                        src={data.avatar_url ? getPathImage(data.avatar_url) : avatar}
                        sx={{ width: 120, height: 120, bgcolor: 'grey.300', borderRadius: '50%', mb:2}}
                    />
                    <Typography fontWeight={500}>{data.full_name || " - "}</Typography>
                    <Typography sx={{ color: 'text.secondary', fontStyle: 'italic'}}>{getRoleLabel(data.role) || " - "}</Typography>
                </Stack>
                <Divider sx={{ my: 1}} />
                <Grid container>
                    <Grid size={{ xs: 5}}>
                        <Typography variant="body2" component='span'>Số điện thoại: </Typography>
                    </Grid>
                    <Grid size={{ xs:7}} sx={{mt: 0.5}}>
                        <Typography sx={{ display: 'flex', justifyContent: 'start'}} variant="body2" component='span'>
                            {data.phone_number || ' - '}
                        </Typography>
                    </Grid>
                </Grid>
                <Box display='flex' justifyContent='center' alignContent='center'>
                    <Button variant='outlined' sx={{ width: '150px', mt: 1}} onClick={handleClick}>
                        Liên hệ
                    </Button>
                </Box>
                <PhoneContact
                    phone={data?.phone_number}
                    anchorEl={anchorEl}
                    setAnchorEl={setAnchorEl}
                />
            </CardContent>
        </Card>
    )
}

export default CardInfoManager;