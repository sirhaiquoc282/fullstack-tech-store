import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify"; // Đảm bảo react-toastify đã được cấu hình
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff } from "react-icons/fi"; // Icons cần thiết

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Thêm state loading cho button

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setErrors({ ...errors, confirmPassword: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^0[0-9]{9,10}$/;

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name cannot be empty!";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name cannot be empty!";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email cannot be empty!";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format!";
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Phone number cannot be empty!";
    } else if (!phoneRegex.test(formData.mobile)) {
      newErrors.mobile = "Invalid phone number (e.g., 0912345678)!";
    }
    if (!formData.password) {
      newErrors.password = "Password cannot be empty!";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters!";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password cannot be empty!";
    } else if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = "Confirm password does not match!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateForm()) {
      toast.error("Please review your information. There are errors in the registration form!", { theme: "colored" });
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);

      toast.success(response.data.message || "Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || 'An error occurred during registration. Please try again later.', { theme: "colored" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Left Column - Welcome Section (Copied directly from Login.jsx) */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-red-600 to-red-800 text-white p-8 md:p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <h1 className="text-2xl font-bold">QAD Tech Store</h1>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your Tech, Your Future. Unleash Innovation, One Device at a Time.
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Explore cutting-edge technology, find your next favorite device, and redefine your digital experience.
          </p>

          <div className="flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <FiPhone size={24} />
            </div>
            <div>
              <p className="font-medium">Need Assistance?</p>
              <p>+84 123 456 789</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Register Form (Updated based on previous Register.jsx) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1> {/* Updated title */}
            <p className="text-gray-600">Join our community today!</p> {/* Updated subtitle */}
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-gray-700 mb-2">First Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  placeholder="First Name*"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className={`
                    w-full h-12 px-4 pl-12 border rounded-lg outline-none
                    text-base text-gray-800 focus:ring-2 focus:ring-red-700 focus:border-red-700
                    transition-all duration-200 placeholder-gray-500
                    ${errors.firstName ? 'border-red-500' : 'border-gray-300'}
                  `}
                />
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              </div>
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-gray-700 mb-2">Last Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  placeholder="Last Name*"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className={`
                    w-full h-12 px-4 pl-12 border rounded-lg outline-none
                    text-base text-gray-800 focus:ring-2 focus:ring-red-700 focus:border-red-700
                    transition-all duration-200 placeholder-gray-500
                    ${errors.lastName ? 'border-red-500' : 'border-gray-300'}
                  `}
                />
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              </div>
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email*"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`
                    w-full h-12 px-4 pl-12 border rounded-lg outline-none
                    text-base text-gray-800 focus:ring-2 focus:ring-red-700 focus:border-red-700
                    transition-all duration-200 placeholder-gray-500
                    ${errors.email ? 'border-red-500' : 'border-gray-300'}
                  `}
                />
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Mobile */}
            <div>
              <label htmlFor="mobile" className="block text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <input
                  type="text"
                  name="mobile"
                  id="mobile"
                  placeholder="Phone Number*"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  className={`
                    w-full h-12 px-4 pl-12 border rounded-lg outline-none
                    text-base text-gray-800 focus:ring-2 focus:ring-red-700 focus:border-red-700
                    transition-all duration-200 placeholder-gray-500
                    ${errors.mobile ? 'border-red-500' : 'border-gray-300'}
                  `}
                />
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              </div>
              {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Password*"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`
                    w-full h-12 px-4 pl-12 pr-12 border rounded-lg outline-none
                    text-base text-gray-800 focus:ring-2 focus:ring-red-700 focus:border-red-700
                    transition-all duration-200 placeholder-gray-500
                    ${errors.password ? 'border-red-500' : 'border-gray-300'}
                  `}
                />
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="Confirm Password*"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                  className={`
                    w-full h-12 px-4 pl-12 pr-12 border rounded-lg outline-none
                    text-base text-gray-800 focus:ring-2 focus:ring-red-700 focus:border-red-700
                    transition-all duration-200 placeholder-gray-500
                    ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}
                  `}
                />
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div
              >
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full h-12 mt-5 uppercase
                text-white font-semibold text-lg rounded-lg
                ${isLoading
                  ? "bg-red-400 cursor-not-allowed"
                  : "bg-red-700 hover:bg-red-800 hover:shadow-md"
                }
                transition-all duration-300 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2
                flex items-center justify-center
              `}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "REGISTER"
              )}
            </button>
          </form>

          {/* Link to Login */}
          <div className="text-center mt-6">
            <p className="text-gray-600">Already have an account?</p>
            <Link
              to="/login"
              className="
                block text-base font-medium text-red-700 mt-2
                hover:underline hover:text-red-800
                transition-colors duration-200
              "
            >
              Login here
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;