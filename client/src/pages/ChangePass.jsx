import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ChangePass = () => {
  const [form, setForm] = useState({
    passCurrent: "",
    newPass: "",
    passCofirm: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPass !== form.passCofirm) {
      toast.error("Mật khẩu mới không khớp!");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken"); 
      console.log('Token gửi đi:', token)
      const response = await axios.put(
        "http://localhost:5000/api/auth/change-password",
        {
          oldPassword: form.passCurrent,
          newPassword: form.newPass,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message || "Đổi mật khẩu thành công!");
      setForm({
        passCurrent: "",
        newPass: "",
        passCofirm: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi đổi mật khẩu");
    }
  };

  return (
    <div className="flex items-center justify-center mt-10 bg-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl"
      >
        <h2 className="text-2xl font-semibold text-center mb-8">Đổi mật khẩu</h2>

        <input
          name="passCurrent"
          type="password"
          placeholder="Mật khẩu hiện tại*"
          value={form.passCurrent}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-3 border rounded-md"
          required
        />

        <input
          name="newPass"
          type="password"
          placeholder="Mật khẩu mới*"
          value={form.newPass}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-3 border rounded-md"
          required
        />

        <input
          name="passCofirm"
          type="password"
          placeholder="Nhập lại mật khẩu mới*"
          value={form.passCofirm}
          onChange={handleChange}
          className="w-full mb-6 px-4 py-3 border rounded-md"
          required
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-900 transition"
        >
          Đổi mật khẩu
        </button>
      </form>
    </div>
  );
};

export default ChangePass;
