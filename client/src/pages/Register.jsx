import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
  })
  const navigate = useNavigate()
  const [message, setMessage] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:5000/api/user/register', formData)
      setMessage(response.data.message)
      navigate("/login")
      toast.success("Đăng ký thành công!");
    } catch (error) {
  

      setMessage(error.response?.data?.message || 'Đã xảy ra lỗi')
    }
  }

  return (
    <div className="flex items-center justify-center bg-white ">
      <div className="w-full max-w-md p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center">Đăng Ký</h2>

        {message && (
          <div className="p-3 text-center text-white bg-blue-500 rounded">
            {message}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="Họ*"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Tên*"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            type="email"
            name="email"
            placeholder="Email*"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            type="text"
            name="mobile"
            placeholder="Số điện thoại*"
            value={formData.mobile}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu*"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="submit"
            className="w-full py-3 text-white bg-black rounded-lg font-semibold hover:opacity-90 transition"
          >
            ĐĂNG KÝ
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register
