import { UserProfile } from "@/types/users";
import { Avatar, Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import avatar from "@/assets/images/users/default-avatar.jpg"
import { getPathImage } from "@/utils/url";
import { getRoleLabel } from "@/utils/labelEnToVni";
import { getAgeFromDateOfBirth } from "@/utils/DateTime";
import Grid from '@mui/material/Grid2';

interface CardInfoStaffProps{
    data: UserProfile
}

const CardInfoStaff = ({ data }: CardInfoStaffProps) => {
    return (
        <Card sx={{ border: '1px solid #e0e0e0'}}>
            <CardContent>
                <Stack direction='column' alignItems='center' justifyContent='center'>
                    <Avatar
                        src={data.avatar_url ? getPathImage(data.avatar_url) : avatar}
                        sx={{ width: 120, height: 120, bgcolor: 'grey.300', borderRadius:'50%', mb:2 }}
                    />
                    <Typography fontWeight={500}>{data.full_name}</Typography>
                    <Typography sx={{ color: 'text.secondary', fontStyle: "italic"}}>{getRoleLabel(data.role)}</Typography>
                    {data.date_of_birth && <Typography sx={{ fontSize: '12px'}}>
                        {`${data.sex} giới` + '/' + `${getAgeFromDateOfBirth(data.date_of_birth)} tuổi`}
                    </Typography>}
                </Stack>
                <Divider sx={{ my:1}}/>
                    <Grid container spacing={1}>
                        <Grid size={{ xs: 4.5}}>
                        <Typography variant="body2" component="span">Tầng: </Typography>
                        </Grid>
                        <Grid size={{ xs: 7.5}}>
                        <Typography sx={{ display:'flex', justifyContent:'start'}} variant="body2" component="span"> Tầng 02</Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 4.5}}>
                        <Typography variant="body2" component="span">Phòng: </Typography>
                        </Grid>
                        <Grid size={{ xs: 7.5}}>
                        <Typography sx={{ display:'flex', justifyContent:'start'}} variant="body2" component="span"> Phòng 201</Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 4.5}}>
                        <Typography variant="body2" component="span">Công việc: </Typography>
                        </Grid>
                        <Grid size={{ xs: 7.5}}>
                        <Typography sx={{ display:'flex', justifyContent:'start'}} variant="body2" component="span"> Dọn vệ sinh phòng</Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 4.5}}>
                        <Typography variant="body2" component="span">Thời gian: </Typography>
                        </Grid>
                        <Grid size={{ xs: 7.5}}>
                        <Typography sx={{ display:'flex', justifyContent:'start'}} variant="body2" component="span"> - </Typography>
                        </Grid>
                    </Grid>
            </CardContent>
        </Card>
    )
}

export default CardInfoStaff;