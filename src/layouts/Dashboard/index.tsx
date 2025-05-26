import Box from '@mui/material/Box';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import Sidebar, { SidebarContext } from './Sidebar';
import { SidebarTitleContext } from '@/contexts/SidebarTitleContext';


const DashboardLayout = () => {
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [title, setTitle] = useState('');

  const handleToggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  const handleToggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <SidebarTitleContext.Provider value={{ title, setTitle}}>
      <Box sx={{ display: 'flex' }}>
        <Sidebar
          collapsed={collapsed}
          openSidebar={openSidebar}
          onCloseSidebar={handleToggleSidebar}
          onToggleCollapsed={handleToggleCollapsed}
        />
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100svh',
            paddingTop: '114px',
            overflow: 'hidden',
          }}
        >
          <Header
            collapsed={collapsed}
            onToggleSidebar={handleToggleSidebar}
            onToggleCollapsed={handleToggleCollapsed}
          />

          <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
            <Outlet />
          </Box>
          <Footer />
        </Box>
      </Box>
    </SidebarTitleContext.Provider>
  );
};

export default DashboardLayout;
