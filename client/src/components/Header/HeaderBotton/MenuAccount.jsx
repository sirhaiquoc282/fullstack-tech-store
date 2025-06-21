import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

// Import các icons từ react-icons/fi
import {
  FiUser, FiCreditCard, FiShoppingBag, FiPackage,
  FiHelpCircle, FiMapPin, FiHome, FiSettings,
  FiLogOut
} from "react-icons/fi";

import { useDispatch, useSelector } from "react-redux";
import { doLogout } from "../../../store/features/AuthenSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// import axios from 'axios';

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const username = useSelector((state) => state.authenSlice?.username || 'Guest');
  const userEmail = useSelector((state) => state.authenSlice?.email || 'N/A');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    try {
      // Your API logout logic here if needed
      // await axios.post("http://localhost:5000/api/auth/logout");

      dispatch(doLogout());
      localStorage.removeItem("accessToken");
      localStorage.removeItem("username");
      // localStorage.removeItem("userEmail"); // Uncomment if you store user email in localStorage

      toast.success("Logout successful!", { theme: "colored" });
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed!", { theme: "colored" });
      console.error("Logout error:", error);
    }
  };

  const getAvatarInitials = (name) => {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return 'U';
    }
    return name.charAt(0).toLocaleUpperCase();
  }

  // Định nghĩa các mục menu với tên, path, và component icon từ react-icons/fi
  const accountMenuItems = [
    { name: "Dashboard", path: "/profile/dashboard", icon: <FiHome /> },
    { name: "My Orders", path: "/profile/orders", icon: <FiShoppingBag /> },
    { name: "Payment Methods", path: "/profile/payment-methods", icon: <FiCreditCard /> },
    { name: "Addresses", path: "/profile/addresses", icon: <FiMapPin /> },
    { name: "Returns & Exchanges", path: "/profile/returns", icon: <FiPackage /> },
    { name: "Profile", path: "/profile/my-profile", icon: <FiUser /> },
    { name: "Support", path: "/profile/support", icon: <FiHelpCircle /> },
    { name: "Settings", path: "/profile/settings", icon: <FiSettings /> },
  ];

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{
              ml: 2,
              p: 0,
              '&:hover': {
                transform: 'scale(1.1)',
                transition: 'transform 0.2s ease-in-out',
              },
            }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: '#DC2626', // Primary red color
                color: 'white',
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              {getAvatarInitials(username)}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose} // Close menu when any MenuItem is clicked
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))", // Subtle shadow
              mt: 1.5,
              borderRadius: '8px',
              minWidth: 200, // Increased min-width for longer text items
              '& .MuiAvatar-root': { // Style for Avatar within MenuItem
                width: 28, height: 28, ml: 0, mr: 1,
                bgcolor: '#DC2626', color: 'white', fontSize: '0.8rem',
              },
              '& .MuiListItemIcon-root': { // Style for ListItemIcon
                minWidth: 36, // Ensures consistent icon alignment
                color: '#DC2626', // Red color for icons
              },
              '&::before': { // Triangle pointer
                content: '""', display: "block", position: "absolute", top: 0, right: 14,
                width: 10, height: 10, bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)", zIndex: 0,
                borderLeft: '1px solid #e0e0e0', borderTop: '1px solid #e0e0e0',
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* Thông tin user trong menu */}
        <MenuItem
          sx={{
            py: 1.5,
            px: 2,
            cursor: 'default',
            '&:hover': { bgcolor: 'transparent' },
            display: 'flex',       // Kích hoạt flexbox
            flexDirection: 'column', // Xếp avatar và box xuống dòng
            alignItems: 'center',  // Căn giữa theo chiều ngang
            justifyContent: 'center', // Căn giữa theo chiều dọc
            textAlign: 'center',   // Căn giữa text
            '& .MuiAvatar-root': { // Override avatar style for this specific MenuItem
              width: 50,         // Kích thước avatar lớn hơn
              height: 50,
              mb: 1,             // Margin bottom
              mt: 0, ml: 0, mr: 0, // Reset margin
              fontSize: '1.5rem', // Kích thước chữ avatar lớn hơn
            }
          }}
        >
          <Avatar>{getAvatarInitials(username)}</Avatar>
          <Box sx={{ flexGrow: 1 }}> {/* flexGrow để box chiếm hết không gian */}
            <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{username || 'Guest'}</Typography>
            <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>{userEmail || 'N/A'}</Typography>
          </Box>
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />

        {/* Render Profile Menu Items */}
        {accountMenuItems.map((item) => (
          <MenuItem
            key={item.path}
            onClick={() => {
              handleClose();
              navigate(item.path);
            }}
            sx={{ py: 1, px: 2, '&:hover': { bgcolor: '#FEE2E2', color: '#DC2626' } }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: '#DC2626' }}>
              {React.cloneElement(item.icon, { size: 20 })}
            </ListItemIcon>
            {item.name}
          </MenuItem>
        ))}

        <Divider sx={{ my: 0.5 }} />

        {/* Logout Button */}
        <MenuItem
          onClick={handleLogout}
          sx={{ py: 1, px: 2, '&:hover': { bgcolor: '#FEE2E2', color: '#DC2626' } }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: '#DC2626' }}>
            <FiLogOut size={20} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}