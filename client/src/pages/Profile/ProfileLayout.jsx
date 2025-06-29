import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux"; // Import useDispatch
import { doLogout } from "../../store/features/AuthenSlice"; // Import doLogout action từ AuthenSlice
import { toast } from "react-toastify"; // Import toast
import {
    FiUser, FiCreditCard, FiShoppingBag, FiPackage,
    FiHelpCircle, FiMapPin, FiHome, FiSettings,
    FiLogOut, FiCamera, FiShoppingCart, FiMenu, FiX
} from "react-icons/fi";

const ProfileLayout = () => {
    const [form, setForm] = useState({
        name: localStorage.getItem("username"),
        avatar: null
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch(); // Khai báo useDispatch

    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    const handleAvatarChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setForm({ ...form, avatar: e.target.result });
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleLogout = async () => {
        try {
            dispatch(doLogout()); // Dispatch Redux action để cập nhật trạng thái login

            // Xóa thông tin người dùng khỏi localStorage
            localStorage.removeItem("accessToken");
            localStorage.removeItem("username");

            toast.success("Đăng xuất thành công!", { theme: "colored" }); // Thông báo thành công
            navigate("/login"); // Điều hướng về trang đăng nhập
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Đăng xuất thất bại. Vui lòng thử lại.", { theme: "colored" }); // Thông báo thất bại
        }
    };

    const menuItems = [
        { name: "Dashboard", icon: <FiHome size={20} />, path: "/profile/dashboard" },
        { name: "Orders", icon: <FiShoppingBag size={20} />, path: "/profile/orders" },
        { name: "Payment Methods", icon: <FiCreditCard size={20} />, path: "/profile/payment-methods" },
        { name: "Addresses", icon: <FiMapPin size={20} />, path: "/profile/addresses" },
        { name: "Returns & Exchanges", icon: <FiPackage size={20} />, path: "/profile/returns" },
        { name: "My Profile", icon: <FiUser size={20} />, path: "/profile/my-profile" },
        { name: "Support", icon: <FiHelpCircle size={20} />, path: "/profile/support" },
        { name: "Settings", icon: <FiSettings size={20} />, path: "/profile/settings" },
    ];

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Header / Topbar cho Mobile (chứa nút hamburger) */}
            <div className="md:hidden bg-white shadow-md p-4 flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-800">My Account</h1>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                    {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <div className={`
                w-full md:w-64 bg-white shadow-lg flex-shrink-0
                fixed md:static top-0 left-0 h-full transform transition-transform duration-300 ease-in-out z-40
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0
            `}>
                {/* Nút đóng menu bên trong Sidebar (chỉ hiển thị trên mobile) */}
                <div className="md:hidden p-4 flex justify-end">
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="text-gray-600 hover:text-gray-800 focus:outline-none"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                <div className="p-6 flex flex-col items-center border-b border-gray-200">
                    <div className="relative">
                        <div className="bg-gray-200 border-2 border-dashed rounded-full w-24 h-24 flex items-center justify-center">
                            {form.avatar ? (
                                <img
                                    src={form.avatar}
                                    alt="Avatar"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <div className="bg-red-600 w-full h-full rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                    {form.name.charAt(0).toLocaleUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 text-center">
                        <p className="font-semibold">{form.name}</p>
                    </div>
                </div>

                <nav className="mt-6">
                    {menuItems.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => navigate(item.path)}
                            className={`flex items-center px-6 py-3 cursor-pointer ${isActive(item.path)
                                ? "text-red-600 border-l-4 border-red-600 bg-red-50"
                                : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            <span className="mr-4">{item.icon}</span>
                            <span>{item.name}</span>
                        </div>
                    ))}
                </nav>

                <div className="p-6 border-t border-gray-200">
                    {/* Settings - đã chuyển vào menuItems */}
                    {/* Logout - Thêm onClick handler */}
                    <div
                        onClick={handleLogout} // <-- Gọi hàm handleLogout ở đây
                        className="flex items-center mt-3 text-gray-600 hover:text-red-600 cursor-pointer"
                    >
                        <FiLogOut className="mr-3" />
                        Logout
                    </div>
                </div>
            </div>

            {/* Overlay (Lớp phủ mờ tối) */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="
                        fixed inset-0 bg-black z-30 md:hidden
                        transition-opacity duration-300 ease-in-out
                        opacity-0
                        " style={{ opacity: isSidebarOpen ? '0.5' : '0' }}
                ></div>
            )}

            {/* Main Content */}
            <div className="flex-grow p-4 md:p-8">
                <Outlet />
            </div>
        </div>
    );
};

export default ProfileLayout;