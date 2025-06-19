import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import SettingsIcon from "@mui/icons-material/Settings"; // Import SettingsIcon
import LogoutIcon from "@mui/icons-material/Logout"; // Import LogoutIcon
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'; // Icon cho Personal
import LockIcon from '@mui/icons-material/Lock'; // Icon cho Change Password

import { useDispatch, useSelector } from "react-redux";
import { doLogout } from "../../../store/features/AuthenSlice"; // Đảm bảo đường dẫn đúng
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'; // Đã comment out phần axios trong handleLogout, nhưng vẫn giữ import

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  // Giả định `username` và `userEmail` được lưu trong authenSlice
  const username = useSelector((state) => state.authenSlice.username);
  const userEmail = useSelector((state) => state.authenSlice.email); // Lấy email nếu có
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose(); // Đóng menu trước khi logout
    try {
      // const token = localStorage.getItem("accessToken");
      // Logic gọi API logout (nếu có)
      // const response = await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });

      dispatch(doLogout()); // Dispatch action Redux
      localStorage.removeItem("accessToken"); // Xóa token
      localStorage.removeItem("username"); // Xóa username
      // localStorage.removeItem("userEmail"); // Xóa email nếu có
      toast.success("Đăng xuất thành công!");
      navigate("/login"); // Điều hướng về trang login
    } catch (error) {
      toast.error("Đăng xuất thất bại!");
      console.error("Logout error:", error);
    }
  };

  // Hàm lấy chữ cái đầu tên
  const getAvatarInitials = (name) => {
    if (!name) return 'U'; // 'U' for User
    return name.charAt(0).toLocaleUpperCase();
  }

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Cài đặt tài khoản">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{
              ml: 2,
              p: 0, // Remove default padding for better control
              '&:hover': {
                transform: 'scale(1.1)', // Subtle scale on hover
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
                bgcolor: '#DC2626', // Màu đỏ chủ đạo (#DC2626)
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
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))", // Shadow nhẹ hơn
              mt: 1.5,
              borderRadius: '8px', // Bo góc menu
              minWidth: 180, // Chiều rộng tối thiểu
              '& .MuiAvatar-root': {
                width: 28, // Avatar nhỏ hơn trong menu
                height: 28,
                ml: 0, // Reset margin
                mr: 1, // Khoảng cách phải
                bgcolor: '#DC2626', // Màu đỏ chủ đạo
                color: 'white',
                fontSize: '0.8rem',
              },
              '&::before': {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper", // Màu nền menu
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
                borderLeft: '1px solid #e0e0e0', // Viền cho mũi tên
                borderTop: '1px solid #e0e0e0',
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* Thông tin user trong menu */}
        <MenuItem sx={{ py: 1.5, px: 2, cursor: 'default', '&:hover': { bgcolor: 'transparent' } }}>
          <Avatar sx={{ bgcolor: 'transparent !important', color: '#DC2626 !important' }}> {/* Avatar trong menu item */}
            {getAvatarInitials(username)}
          </Avatar>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{username || 'Guest'}</Typography>
            <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>{userEmail || 'N/A'}</Typography>
          </Box>
        </MenuItem>
        <Divider sx={{ my: 0.5 }} /> {/* Khoảng cách divider */}

        <MenuItem
          onClick={() => {
            handleClose();
            navigate("/profile/my-profile"); // Điều hướng đến trang My Profile
          }}
          sx={{ py: 1, px: 2, '&:hover': { bgcolor: '#FEE2E2', color: '#DC2626' } }} // Hover effect
        >
          <ListItemIcon sx={{ minWidth: 36 }}> {/* Căn chỉnh icon */}
            <PersonOutlineIcon fontSize="small" sx={{ color: '#DC2626' }} /> {/* Icon Personal màu đỏ */}
          </ListItemIcon>
          Hồ sơ của tôi
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            navigate("/profile/my-profile"); // Điều hướng đến trang My Profile (tùy bạn có thể đổi thành "/profile/security" nếu có)
          }}
          sx={{ py: 1, px: 2, '&:hover': { bgcolor: '#FEE2E2', color: '#DC2626' } }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <SettingsIcon fontSize="small" sx={{ color: '#DC2626' }} /> {/* Icon Settings màu đỏ */}
          </ListItemIcon>
          Cài đặt tài khoản
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            navigate("/profile/my-profile"); // Điều hướng đến trang My Profile, nơi có phần đổi mật khẩu
          }}
          sx={{ py: 1, px: 2, '&:hover': { bgcolor: '#FEE2E2', color: '#DC2626' } }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <LockIcon fontSize="small" sx={{ color: '#DC2626' }} /> {/* Icon Lock màu đỏ */}
          </ListItemIcon>
          Đổi mật khẩu
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem
          onClick={handleLogout}
          sx={{ py: 1, px: 2, '&:hover': { bgcolor: '#FEE2E2', color: '#DC2626' } }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <LogoutIcon fontSize="small" sx={{ color: '#DC2626' }} /> {/* Icon Logout màu đỏ */}
          </ListItemIcon>
          Đăng xuất
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}