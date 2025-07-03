import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { doLogin } from "../../store/features/AuthenSlice";
import { toast } from "react-toastify";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Link
} from "@mui/material";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [authError, setAuthError] = useState(null);
  const [authStatus, setAuthStatus] = useState("idle"); // 'idle' | 'loading' | 'failed'
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthStatus("loading");
    setAuthError(null);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      const user = res.data.user;
      const { token } = user;

      if (!token) {
        toast.error("Không nhận được accessToken từ server");
        setAuthStatus("failed");
        return;
      }

      localStorage.setItem("accessToken", token);
      localStorage.setItem("username", user.firstName);

      dispatch(doLogin({ email: user.email, role: user.role }));

      toast.success("Đăng nhập thành công!");
      navigate("/admin"); // Navigate đến trang quản trị
    } catch (err) {
      setAuthStatus("failed");
      if (err.response?.data?.message) {
        setAuthError("Email hoặc mật khẩu không đúng. Vui lòng nhập lại.");
      } else {
        setAuthError("Lỗi kết nối đến server. Vui lòng thử lại sau.");
      }
    }
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
            name="email"
            type="email"
            fullWidth
            margin="normal"
            required
            value={formData.email}
            onChange={handleChange}
          />

          <TextField
            label="Mật khẩu"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            required
            value={formData.password}
            onChange={handleChange}
          />

          {authStatus === "failed" && authError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {authError}
            </Alert>
          )}

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            type="submit"
            disabled={authStatus === "loading"}
          >
            {authStatus === "loading" ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Đăng nhập"
            )}
          </Button>
        </form>

        <Box mt={2} textAlign="center">
          <Link component={RouterLink} to="/admin/forgot">
            Quên mật khẩu?
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminLogin;
