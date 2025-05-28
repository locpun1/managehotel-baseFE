import { MINI_SIDEBAR_WIDTH, SIDEBAR_WIDTH } from '@/constants/layouts';
import { ChevronLeft, ChevronRight, DensityMedium } from '@mui/icons-material';
import { Box, Stack, Typography, useMediaQuery } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import { CSSObject, Theme, useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import SelectLanguage from './SelectLanguage';
import Profile from './Sidebar/Profile';
import { useSidebarTitle } from '@/contexts/SidebarTitleContext';
import { useAppSelector } from '@/store';

interface Props {
  collapsed: boolean;
  onToggleSidebar: () => void;
  onToggleCollapsed: () => void;
}

const openedMixin = (theme: Theme): CSSObject => ({
  width: `calc(100% - ${MINI_SIDEBAR_WIDTH}px)`,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
});

const closedMixin = (theme: Theme): CSSObject => ({
  width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
});

const Header = (props: Props) => {
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'));
  const { title } = useSidebarTitle();
   const profile = useAppSelector((state) => state.auth.profile);

  return (
    <AppBar
      position='fixed'
      elevation={10}
      sx={{
        color: 'common.black',
        backgroundColor: '#fff',
        borderBottom: 'thin solid #E6E8F0',
        marginLeft: 'auto',
        height:"86px",
        zIndex: 9,
        width: lgUp
          ? props.collapsed
            ? openedMixin(theme).width
            : closedMixin(theme).width
          : '100%',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', height: '100%' }}>
        <Stack direction='row'>
          <IconButton
            onClick={props.onToggleCollapsed}
            edge='start'
            sx={{
              color: '#000',
              borderRadius: '4px',
              width: '36px',
              height: '36px',
              fontSize: '1rem',
              backgroundColor: '#f0f0f0',
            }}
          >
            {props.collapsed ? <DensityMedium /> : <DensityMedium />}
          </IconButton>
          <Typography display='flex' justifyContent="center" alignItems='center'>{title}</Typography>
        </Stack>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SelectLanguage />
          <Profile />
        </Box>
      </Toolbar>
      <Box sx={{ display: 'flex', textAlign: 'center', height:"50px", backgroundColor:"#00C7BE"}}>
        <Typography color='info.contrastText' mx={3} my={1.5}>{`Xin chào, ${profile?.full_name}`}</Typography>
      </Box>
    </AppBar>
  );
};

export default Header;
