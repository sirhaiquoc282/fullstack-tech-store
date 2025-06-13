// Login.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { doLogin } from "../store/features/AuthenSlice";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.authenSlice.isLogin);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async () => {
  try {
    const res = await axios.post("http://localhost:5000/api/user/login", formData);
    
    const { accessToken, user } = res.data;

    if (!accessToken) {
      toast.error("Không nhận được accessToken từ server");
      return;
    }

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("username", user.firstName); 
    
    dispatch(doLogin({ email: user.email, role: user.role })); 
    
    toast.success("Đăng nhập thành công!");
    navigate("/");
  } catch (err) {
    if (err.response?.data?.message) {
      toast.error("email hoặc mật khẩu không đúng vui lòng nhập lại");
    } else {
      toast.error("Đăng nhập thất bại hoặc lỗi kết nối server");
    }
  }
};

  useEffect(() => {
    if (isLogin) {
      navigate("/");
    }
  }, [isLogin]);

  return (
    <section className="">
      <div className="pt-20">
        <h2 className="text-3xl font-semibold text-center">Login</h2>
        <div className="container">
          <div className="max-w-xl mx-auto">
            <div className="mt-5">
              <input
                name="email"
                type="email"
                className="mt-2 w-full h-[50px] border border-gray p-5 rounded-lg text-[14px]"
                placeholder="Email*"
                onChange={handleChange}
              />
              <div className="mt-3 relative">
                <input
                  name="password"
                  type="password"
                  className="mt-2 w-full h-[50px] border border-gray px-4 pr-12 rounded-lg text-[14px]"
                  placeholder="Mật Khẩu*"
                  onChange={handleChange}
                />
              </div>

              <button
                className="w-full mt-5 mb-5 uppercase h-[50px] bg-black text-white font-semibold text-sm px-4 flex-1 rounded-lg hover:bg-white border duration-100 hover:duration-300 hover:border-black hover:text-black transition-all"
                onClick={handleLogin}
              >
                Đăng nhập
              </button>

              <div className="text-center mt-2">
                <span className="text-sm">Bạn chưa có tài khoản?</span>
                <Link
                  to="/register"
                  className="text-md mt-5 mb-5 block hover:underline hover-text-blue"
                >
                  Đăng ký tại đây
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
