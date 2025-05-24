import { useContext } from 'react';

import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { CollapseContext } from '.';
import { Avatar } from '@mui/material';
import { useAppSelector } from '@/store';
import avatar1 from '@/assets/images/users/avatar-1.png';

const Logo = () => {
  const collapsed = useContext(CollapseContext);
const profile = useAppSelector((state) => state.auth.profile);


  if (collapsed) {
    return (
      <Box sx={{ paddingX: '12px', paddingY: '20px' }}>
        <Avatar src={avatar1} sx={{ width: 40, height: 40, mb: 2, bgcolor: 'grey.300', borderRadius:'50%' }} />
        {/* <Typography sx={{ whiteSpace: 'nowrap' }}>TS</Typography> */}
      </Box>
    );
  }

  return (
    <Toolbar sx={{ whiteSpace: 'nowrap', display:'flex', justifyContent:"center", textAlign:'center', flexDirection:"column", mt:6 }}>
      <Avatar src={avatar1} sx={{ width: 120, height: 120, mb: 2, bgcolor: 'grey.300', borderRadius:'50%' }} />
      <Typography>{profile?.full_name}</Typography>
    </Toolbar>
  );
};

export default Logo;
