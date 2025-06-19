// src/pages/Profile/Profile.jsx
import React, { useState } from "react";
import { FiUser, FiMail, FiPhone, FiHome, FiCamera, FiLock, FiEye, FiEyeOff, FiX } from "react-icons/fi";

const Profile = () => {
  const [form, setForm] = useState({
    name: "Sami",
    email: "sami/damored2020@gmail.com",
    phone: "+1-826-889-908-1285",
    address: "Semi bathroom, New York City",
    avatar: null
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setForm({ ...form, avatar: e.target.result });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    console.log("Profile updated successfully!");
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    console.log("Password change request:", passwordForm);

    setPasswordSuccess("Password changed successfully!");

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });

    setTimeout(() => {
      setShowPasswordForm(false);
      setPasswordSuccess("");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Profile</h1>
        <button
          onClick={handleSubmit} // Nút này vẫn gọi handleSubmit
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition text-sm md:text-base"
        >
          Save Changes
        </button>
      </div>

      {/* Password Change Modal */}
      {showPasswordForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md relative">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Change Password</h2>
                <button
                  onClick={() => setShowPasswordForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>

              {passwordSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiCheckCircle size={32} />
                  </div>
                  <p className="text-lg font-medium">{passwordSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  {passwordError && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-md">
                      {passwordError}
                    </div>
                  )}

                  <div>
                    <label className="block text-gray-700 mb-2 flex items-center">
                      <FiLock className="mr-2 text-red-600" />
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        name="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 pr-10"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 flex items-center">
                      <FiLock className="mr-2 text-red-600" />
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        name="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 pr-10"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 flex items-center">
                      <FiLock className="mr-2 text-red-600" />
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        name="confirmPassword" // Đảm bảo tên này khớp với newPassword và logic
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 pr-10"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition font-semibold"
                    >
                      CHANGE PASSWORD
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Profile Form Content (Original Content) */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <div className="flex flex-col items-center mb-6 md:mb-0 md:mr-8">
            <div className="relative">
              <div className="bg-gray-200 border-2 border-dashed rounded-full w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
                {form.avatar ? (
                  <img
                    src={form.avatar}
                    alt="Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="bg-red-600 w-full h-full rounded-full flex items-center justify-center text-white text-3xl md:text-5xl font-bold">
                    {form.name.charAt(0)}
                  </div>
                )}
              </div>

              <label className="absolute bottom-0 right-0 bg-red-600 text-white p-2 rounded-full cursor-pointer hover:bg-red-700 transition-colors">
                <FiCamera size={16} />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <button
              className="mt-4 text-red-600 hover:text-red-800 text-sm font-medium"
              onClick={() => document.querySelector('input[type="file"]').click()}
            >
              Change Photo
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-grow w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* First Name */}
              <div className="col-span-1">
                <label className="block text-gray-700 mb-2 flex items-center">
                  <FiUser className="mr-2 text-red-600" />
                  First Name
                </label>
                <input
                  name="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>

              {/* Last Name */}
              <div className="col-span-1">
                <label className="block text-gray-700 mb-2 flex items-center">
                  <FiUser className="mr-2 text-red-600" />
                  Last Name
                </label>
                <input
                  name="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-gray-700 mb-2 flex items-center">
                  <FiMail className="mr-2 text-red-600" />
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>

              <div className="col-span-1">
                <label className="block text-gray-700 mb-2 flex items-center">
                  <FiPhone className="mr-2 text-red-600" />
                  Phone Number
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>

              <div className="col-span-1">
                <label className="block text-gray-700 mb-2 flex items-center">
                  <FiHome className="mr-2 text-red-600" />
                  Address
                </label>
                <input
                  name="address"
                  type="text"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 md:p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium">Password</p>
                    <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                  </div>
                  <button
                    className="text-red-600 font-medium text-sm md:text-base"
                    onClick={() => setShowPasswordForm(true)} // Nút này hiển thị modal
                  >
                    Change Password
                  </button>
                </div>
                <div className="flex justify-between items-center p-3 md:p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                  <button className="text-red-600 font-medium text-sm md:text-base">Enable</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-4">Account Preferences</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 md:p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive updates about your account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          <div className="flex justify-between items-center p-3 md:p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium">SMS Notifications</p>
              <p className="text-sm text-gray-500">Receive important alerts via SMS</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;