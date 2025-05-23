import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { LogoutOutlined } from '@mui/icons-material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
  ButtonBase,
  Card,
  ClickAwayListener,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Stack,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import avatar1 from '@/assets/images/users/avatar-1.png';
import { ROUTE_PATH } from '@/constants/routes';
import { signOut } from '@/services/auth-service';
import { setIsAuth, setProfile } from '@/slices/auth';
import { useAppDispatch, useAppSelector } from '@/store';
import { getStorageToken, removeStorageToken } from '@/utils/AuthHelper';
import useNotification from '@/hooks/useNotification';

// ==============================|| PROFILE COMPONENT ||============================== //

const Profile = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.auth.profile);
  const navigate = useNavigate();
  const notify = useNotification()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleLogout = async () => {
    const refreshToken = getStorageToken.refreshToken;
    await signOut({
      refreshToken: refreshToken
    });
    dispatch(setIsAuth(false));
    dispatch(setProfile(null));
    removeStorageToken();
  };

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <ButtonBase
        sx={{
          p: 0.25,
          borderRadius: 1,
          '&:hover': { bgcolor: 'secondary.lighter' },
          '&:focus-visible': {
            outline: `2px solid ${theme.palette.secondary.dark}`,
            outlineOffset: 2,
          },
        }}
        aria-label='open profile'
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup='true'
        onClick={handleClick}
      >
        <Stack direction='row' spacing={1.25} alignItems='center' sx={{ p: 0.5 }}>
          <Avatar
            alt='profile user'
            src={avatar1}
            sx={{ width: 32, height: 32, borderRadius: '100%' }}
          />
          <Typography variant='subtitle1'>{profile?.full_name}</Typography>
        </Stack>
      </ButtonBase>
      <Popper
        open={open}
        anchorEl={anchorEl}
        sx={{
          zIndex: 999,
          marginTop: '10px !important',
        }}
        placement='bottom-start'
      >
        <Paper sx={{ width: 290, minWidth: 240, maxWidth: { xs: 250, md: 250 } }}>
          <ClickAwayListener onClickAway={handleClick}>
            <Card>
              <List component='nav' sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 24 } }}>
                <ListItemButton>
                  <ListItemIcon>
                    <EditOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText
                    onClick={() => navigate(ROUTE_PATH.TO_PROFILE)}
                    primary='Edit Profile'
                    sx={{
                      '& .MuiTypography-root': {
                        fontSize: '14px',
                      },
                    }}
                  />
                </ListItemButton>
                <Divider />
                <ListItemButton>
                  <ListItemIcon>
                    <LogoutOutlined />
                  </ListItemIcon>
                  <ListItemText
                    onClick={handleLogout}
                    primary='Logout'
                    sx={{
                      '& .MuiTypography-root': {
                        fontSize: '14px',
                      },
                    }}
                  />
                </ListItemButton>
              </List>
            </Card>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </Box>
  );
};

export default Profile;