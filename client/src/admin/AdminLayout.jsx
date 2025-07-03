import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './components/Sidebar';
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

      {/* Conditional IconButton for mobile to open sidebar */}
      {isMobile && (
        <Toolbar sx={{ position: 'fixed', top: 0, left: 0, zIndex: theme.zIndex.drawer + 2, width: '100%', backgroundColor: '#f6f8fa', boxShadow: theme.shadows[1], pr: '24px !important' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }} // Show only on small screens
          >
            <MenuIcon />
          </IconButton>
          {/* You might want a title or logo here */}
          <Box sx={{ flexGrow: 1 }} />
        </Toolbar>
      )}

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
          width: '100%', // Outlet always takes full width
          // Remove ml: { sm: `${drawerWidth}px` } as we want it to overlay, not push
          pt: { xs: 8, md: 3 }, // Adjust padding top to account for fixed toolbar on mobile
          pl: { xs: 2, md: 2 },
          pr: 3,
          pb: 3,
        }}
      >
        {/*
          No need for this Toolbar as it was meant for pushing content.
          Instead, we added a fixed Toolbar for the menu icon on mobile.
          <Toolbar />
        */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;