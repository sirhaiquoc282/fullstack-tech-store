import React, { useState, useEffect } from 'react';
import { Box, Button, Paper, TextField, Typography, Link, CircularProgress, Alert } from '@mui/material'; // Thêm CircularProgress, Alert
import { useDispatch, useSelector } from 'react-redux'; // Thêm useSelector
import { doLogin } from '../../store/features/AuthenSlice'; // Đảm bảo đường dẫn đúng
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  // Lấy trạng thái đăng nhập, lỗi và cờ đã đăng nhập từ Redux store
  const authStatus = useSelector((state) => state.authenSlice.status); // Trạng thái: 'idle', 'loading', 'succeeded', 'failed'
  const authError = useSelector((state) => state.authenSlice.error);     // Thông báo lỗi
  const isLoggedIn = useSelector((state) => state.authenSlice.isLogin);   // Cờ đã đăng nhập thành công

  // Sử dụng useEffect để chuyển hướng sau khi đăng nhập thành công
  // Điều này đảm bảo việc chuyển hướng xảy ra sau khi state Redux đã được cập nhật
  useEffect(() => {
    if (isLoggedIn && authStatus === 'succeeded') {
      navigate('/admin'); // Chuyển hướng đến trang admin dashboard
    }
  }, [isLoggedIn, authStatus, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(doLogin({ email: form.email, password: form.password }));
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper sx={{ p: 4, width: 360 }}>
        <Typography variant="h5" gutterBottom align="center">
          Admin Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            label="Mật khẩu"
            type="password"
            fullWidth
            margin="normal"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {/* Hiển thị thông báo lỗi nếu đăng nhập thất bại */}
          {authStatus === 'failed' && authError && (
            <Alert severity="error" sx={{ mt: 2 }}>{authError}</Alert>
          )}
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            type="submit"
            // Vô hiệu hóa nút khi đang tải để tránh gửi nhiều request
            disabled={authStatus === 'loading'}
          >
            {/* Hiển thị spinner khi đang tải */}
            {authStatus === 'loading' ? <CircularProgress size={24} color="inherit" /> : 'Đăng nhập'}
          </Button>
        </form>
        <Box mt={2} textAlign="center">
          <Link href="/admin/forgot">Quên mật khẩu?</Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminLogin;