// src/components/Sidebar/Sidebar.jsx
import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Divider,
  useMediaQuery,
  IconButton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Import Material-UI Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RateReviewIcon from '@mui/icons-material/RateReview';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SettingsIcon from '@mui/icons-material/Settings';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';

// Redux
import { useDispatch } from 'react-redux';
import { doLogout } from '../../store/features/AuthenSlice';

const mainMenuItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
  { label: 'Orders', path: '/admin/orders', icon: <ShoppingCartIcon /> },
  { label: 'Categories', path: '/admin/categories', icon: <CategoryIcon /> },
  { label: 'Products', path: '/admin/products', icon: <Inventory2Icon /> },
  { label: 'Reviews & Feedback', path: '/admin/reviews', icon: <RateReviewIcon /> },
  { label: 'Support Tickets', path: '/admin/support', icon: <SupportAgentIcon /> },
];

const settingsMenuItems = [
  { label: 'Settings', path: '/admin/settings', icon: <SettingsIcon /> },
  { label: 'Logout', path: '/admin/logout', icon: <LogoutIcon /> },
];

const Sidebar = ({ mobileOpen, handleDrawerToggle, drawerWidth }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Vẫn cần isMobile để điều khiển Drawer tạm thời

  const handleLogout = () => {
    dispatch(doLogout());
    navigate('/admin/login');
    if (isMobile) {
      handleDrawerToggle();
    }
  };

  const drawerContent = (
    <Box className="flex flex-col h-full">
      <Toolbar className="bg-red-600 text-white min-h-[64px] border-b border-white/[0.2] flex justify-between items-center">
        <Typography variant="h6" noWrap component="div" className="font-bold text-xl">
          Admin Panel
        </Typography>
        {isMobile && ( // Nút đóng chỉ hiển thị trên mobile
          <IconButton
            color="inherit"
            aria-label="close drawer"
            edge="end"
            onClick={handleDrawerToggle}
            className="md:hidden" // Responsive class
          >
            <CloseIcon />
          </IconButton>
        )}
      </Toolbar>

      <List className="pt-0">
        {mainMenuItems.map(({ label, path, icon }) => {
          const isActive = location.pathname === path;

          return (
            <ListItemButton
              key={path}
              onClick={() => {
                navigate(path);
                if (isMobile) {
                  handleDrawerToggle();
                }
              }}
              className={`py-3 px-6 ${isActive ? 'bg-red-600 text-white font-bold border-l-4 border-red-800' : 'text-gray-700 border-l-4 border-transparent'} hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200`}
            >
              <ListItemIcon className={`${isActive ? 'text-white' : 'text-gray-600'}`}>
                {icon}
              </ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          );
        })}
      </List>

      <Divider className="my-1 border-gray-200" />

      <List>
        {settingsMenuItems.map(({ label, path, icon }) => {
          const isActive = location.pathname === path;

          return (
            <ListItemButton
              key={path}
              onClick={() => {
                if (label === 'Logout') {
                  handleLogout();
                } else {
                  navigate(path);
                  if (isMobile) {
                    handleDrawerToggle();
                  }
                }
              }}
              className={`py-3 px-6 ${isActive ? 'bg-red-600 text-white font-bold border-l-4 border-red-800' : 'text-gray-700 border-l-4 border-transparent'} hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200`}
            >
              <ListItemIcon className={`${isActive ? 'text-white' : 'text-gray-600'}`}>
                {icon}
              </ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          );
        })}
      </List>
      <Box className="p-4 mt-auto text-center text-gray-700 text-xs">
        <Typography variant="body2">&copy; {new Date().getFullYear()} QAD Admin. All rights reserved.</Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      className="flex-shrink-0" // md:w-[260px] sẽ nằm trong global CSS hoặc theme
      sx={{ width: { md: drawerWidth } }} // Giữ lại sx này để Drawer biết width cố định của nó trên desktop
      aria-label="mailbox folders"
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          // display responsive classes
          // Loại bỏ: display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth, // Width vẫn cần cho Drawer Paper
            backgroundColor: '#fff',
            boxShadow: '0px 0px 15px rgba(0,0,0,0.05)',
          },
        }}
        // Add responsive display class directly to Drawer if needed for a smoother transition
        className={`${isMobile ? 'block' : 'hidden'} md:block`} // Example: block on mobile, block on md and up
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          // display responsive classes
          // Loại bỏ: display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth, // Width vẫn cần cho Drawer Paper
            boxSizing: 'border-box',
            backgroundColor: '#fff',
            boxShadow: '0px 0px 15px rgba(0,0,0,0.05)',
            borderRight: '1px solid #e0e0e0',
          },
        }}
        open
        // Add responsive display class directly to Drawer
        className={`${isMobile ? 'hidden' : 'block'} md:block`} // Example: hidden on mobile, block on md and up
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;