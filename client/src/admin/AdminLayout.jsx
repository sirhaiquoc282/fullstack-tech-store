import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './components/Sidebar'; // Corrected path assuming Sidebar is in 'components/Sidebar/Sidebar.jsx'
import { Box, Toolbar, IconButton, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const AdminLayout = () => {
  const { isLogin } = useSelector((state) => state.authenSlice || {});
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerWidth = 260;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  if (!isLogin && location.pathname !== '/admin/login' && location.pathname !== '/admin/forgot') {
    return <Navigate to="/admin/login" replace />;
  }

  if (location.pathname === '/admin/login' || location.pathname === '/admin/forgot') {
    return (
      <Box display="flex" flexGrow={1} minHeight="100vh" justifyContent="center" alignItems="center">
        <Outlet />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>

      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        drawerWidth={drawerWidth}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: '#f6f8fa',
          minHeight: '100vh',
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          pt: { xs: 3, md: 3 },
          pl: { xs: 2, md: 2 },
          pr: 3,
          pb: 3,
        }}
      >
        {!isMobile && <Toolbar />}
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;