// src/pages/Profile/Settings.jsx
import React, { useState } from "react";
import {
    FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiBell,
    FiSettings, FiGlobe, FiDollarSign, FiTrash2, FiToggleRight, FiToggleLeft
} from "react-icons/fi"; // Thêm các icons cần thiết
import { toast } from "react-toastify"; // Dùng toast để thông báo

const Settings = () => {
    // State cho General Settings
    const [generalSettings, setGeneralSettings] = useState({
        email: "user@example.com",
        phone: "0123456789",
        language: "english", // Giả định có lựa chọn ngôn ngữ
        currency: "usd" // Giả định có lựa chọn tiền tệ
    });

    // State cho Password Form
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    // State cho Notification Settings
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        smsNotifications: false,
        orderUpdates: true,
        promotions: false
    });

    // --- Handlers for General Settings ---
    const handleGeneralChange = (e) => {
        const { name, value } = e.target;
        setGeneralSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateGeneralSettings = (e) => {
        e.preventDefault();
        // Logic gọi API cập nhật general settings
        console.log("Updating General Settings:", generalSettings);
        toast.success("General settings updated successfully!", { theme: "colored" });
    };

    // --- Handlers for Password Change ---
    const handlePasswordFormChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({ ...prev, [name]: value }));
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        // Validation
        if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
            toast.error("New password and confirmation do not match.", { theme: "colored" });
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            toast.error("New password must be at least 6 characters.", { theme: "colored" });
            return;
        }
        // Logic gọi API đổi mật khẩu
        console.log("Changing Password:", passwordForm);
        toast.success("Password changed successfully!", { theme: "colored" });
        setPasswordForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" }); // Reset form
    };

    // --- Handlers for Notification Settings ---
    const handleNotificationToggle = (settingName) => {
        setNotificationSettings(prev => ({ ...prev, [settingName]: !prev[settingName] }));
        toast.info(`${settingName.replace(/([A-Z])/g, ' $1').toLowerCase()} notifications ${notificationSettings[settingName] ? 'disabled' : 'enabled'}.`, { theme: "colored" });
    };

    // --- Handler for Account Deletion ---
    const handleDeleteAccount = () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            // Logic gọi API xóa tài khoản
            console.log("Deleting account...");
            toast.success("Your account has been deleted.", { theme: "colored" });
            // Navigate to logout/homepage after deletion
        }
    };


    return (
        <div className="space-y-8 p-4 md:p-6 bg-white rounded-xl shadow-lg"> {/* Main Container */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Account Settings</h1>

            {/* General Settings */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <FiSettings className="text-red-700" size={20} /> General Preferences
                </h2>
                <form onSubmit={handleUpdateGeneralSettings} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">Email Address</label>
                        <div className="relative">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={generalSettings.email}
                                onChange={handleGeneralChange}
                                className="w-full px-4 pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-red-700 transition-all duration-200"
                                required
                            />
                            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                    {/* Phone */}
                    <div>
                        <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-1">Phone Number</label>
                        <div className="relative">
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={generalSettings.phone}
                                onChange={handleGeneralChange}
                                className="w-full px-4 pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-red-700 transition-all duration-200"
                                required
                            />
                            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                    {/* Language (Example) */}
                    <div>
                        <label htmlFor="language" className="block text-gray-700 text-sm font-medium mb-1">Language</label>
                        <div className="relative">
                            <select
                                id="language"
                                name="language"
                                value={generalSettings.language}
                                onChange={handleGeneralChange}
                                className="w-full px-4 pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-red-700 appearance-none bg-white pr-8 transition-all duration-200"
                            >
                                <option value="english">English</option>
                                <option value="vietnamese">Tiếng Việt</option>
                            </select>
                            <FiGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </div>
                    {/* Currency (Example) */}
                    <div>
                        <label htmlFor="currency" className="block text-gray-700 text-sm font-medium mb-1">Currency</label>
                        <div className="relative">
                            <select
                                id="currency"
                                name="currency"
                                value={generalSettings.currency}
                                onChange={handleGeneralChange}
                                className="w-full px-4 pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-red-700 appearance-none bg-white pr-8 transition-all duration-200"
                            >
                                <option value="usd">USD ($)</option>
                                <option value="vnd">VND (₫)</option>
                            </select>
                            <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="
                      w-full bg-red-700 text-white py-2.5 rounded-lg font-semibold
                      hover:bg-red-800 transition-colors duration-200
                      focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2
                    ">Save General Settings</button>
                </form>
            </div>

            <hr className="my-8 border-gray-200" />

            {/* Password Settings */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <FiLock className="text-red-700" size={20} /> Password & Security
                </h2>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    {/* Current Password */}
                    <div>
                        <label htmlFor="currentPassword" className="block text-gray-700 text-sm font-medium mb-1">Current Password</label>
                        <div className="relative">
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                id="currentPassword"
                                name="currentPassword"
                                value={passwordForm.currentPassword}
                                onChange={handlePasswordFormChange}
                                className="w-full px-4 pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-red-700 transition-all duration-200 pr-10"
                                required
                            />
                            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>
                    {/* New Password */}
                    <div>
                        <label htmlFor="newPassword" className="block text-gray-700 text-sm font-medium mb-1">New Password</label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                id="newPassword"
                                name="newPassword"
                                value={passwordForm.newPassword}
                                onChange={handlePasswordFormChange}
                                className="w-full px-4 pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-red-700 transition-all duration-200 pr-10"
                                required
                            />
                            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showNewPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                    </div>
                    {/* Confirm New Password */}
                    <div>
                        <label htmlFor="confirmNewPassword" className="block text-gray-700 text-sm font-medium mb-1">Confirm New Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmNewPassword ? "text" : "password"}
                                id="confirmNewPassword"
                                name="confirmNewPassword"
                                value={passwordForm.confirmNewPassword}
                                onChange={handlePasswordFormChange}
                                className="w-full px-4 pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-red-700 transition-all duration-200 pr-10"
                                required
                            />
                            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <button
                                type="button"
                                onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showConfirmNewPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="
                      w-full bg-red-700 text-white py-2.5 rounded-lg font-semibold
                      hover:bg-red-800 transition-colors duration-200
                      focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2
                    ">Change Password</button>
                </form>

                {/* Two-Factor Authentication */}
                <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                    <div>
                        <p className="font-medium text-gray-800">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account.</p>
                    </div>
                    <button className="
                        bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold text-sm
                        hover:bg-gray-300 transition-colors duration-200
                        focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
                    ">Enable</button>
                </div>
            </div>

            <hr className="my-8 border-gray-200" />

            {/* Notification Settings */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <FiBell className="text-red-700" size={20} /> Notification Preferences
                </h2>
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-800">Email Notifications</p>
                            <p className="text-sm text-gray-500">Receive updates about your account via email.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={notificationSettings.emailNotifications}
                                onChange={() => handleNotificationToggle('emailNotifications')}
                            />
                            <div className="
                                w-11 h-6 bg-gray-200 rounded-full
                                peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300
                                peer-checked:after:translate-x-full peer-checked:after:border-white
                                after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                                after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                                peer-checked:bg-red-700
                            "></div>
                        </label>
                    </div>
                    <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-800">SMS Notifications</p>
                            <p className="text-sm text-gray-500">Receive important alerts and updates via SMS.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={notificationSettings.smsNotifications}
                                onChange={() => handleNotificationToggle('smsNotifications')}
                            />
                            <div className="
                                w-11 h-6 bg-gray-200 rounded-full
                                peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300
                                peer-checked:after:translate-x-full peer-checked:after:border-white
                                after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                                after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                                peer-checked:bg-red-700
                            "></div>
                        </label>
                    </div>
                    <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-800">Order Updates</p>
                            <p className="text-sm text-gray-500">Get notified about your order status changes.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={notificationSettings.orderUpdates}
                                onChange={() => handleNotificationToggle('orderUpdates')}
                            />
                            <div className="
                                w-11 h-6 bg-gray-200 rounded-full
                                peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300
                                peer-checked:after:translate-x-full peer-checked:after:border-white
                                after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                                after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                                peer-checked:bg-red-700
                            "></div>
                        </label>
                    </div>
                    <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-800">Promotional Offers</p>
                            <p className="text-sm text-gray-500">Receive special offers and discounts.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={notificationSettings.promotions}
                                onChange={() => handleNotificationToggle('promotions')}
                            />
                            <div className="
                                w-11 h-6 bg-gray-200 rounded-full
                                peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300
                                peer-checked:after:translate-x-full peer-checked:after:border-white
                                after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                                after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                                peer-checked:bg-red-700
                            "></div>
                        </label>
                    </div>
                </div>
            </div>

            <hr className="my-8 border-gray-200" />

            {/* Danger Zone: Delete Account */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-red-700 flex items-center gap-2">
                    <FiTrash2 className="text-red-700" size={20} /> Danger Zone
                </h2>
                <div className="p-4 border border-red-300 rounded-lg bg-red-50 text-red-800 flex justify-between items-center">
                    <div>
                        <p className="font-medium">Delete Account</p>
                        <p className="text-sm">Permanently delete your account and all associated data.</p>
                    </div>
                    <button
                        onClick={handleDeleteAccount}
                        className="
                            bg-red-700 text-white px-4 py-2 rounded-lg font-semibold text-sm
                            hover:bg-red-800 transition-colors duration-200
                            focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2
                        "
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;