import React, { useEffect, useState } from "react";
import { FiShoppingBag, FiPackage, FiCreditCard, FiStar, FiClock } from "react-icons/fi";
import apiService from "../../service/apiService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await apiService.getUserDashboardStats();
                if (response.status === 200) {
                    setDashboardData(response.data);
                } else {
                    setError("Failed to load dashboard data. Please try again.");
                    toast.error("Failed to load dashboard data.");
                }
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError(err.response?.data?.message || "Error connecting to server.");
                toast.error(err.response?.data?.message || "Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const formatCurrency = (amount) => {
        if (typeof amount !== 'number') return '$N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const getOrderStatusColor = (status) => {
        switch (status) {
            case "Delivered": return "bg-green-100 text-green-800";
            case "Processing": return "bg-yellow-100 text-yellow-800";
            case "Pending": return "bg-yellow-100 text-yellow-800";
            case "Cancelled": return "bg-red-100 text-red-800";
            case "Shipped": return "bg-blue-100 text-blue-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
                <p className="ml-4 text-gray-600">Loading dashboard data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Dashboard</h2>
                <p className="text-gray-700">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                >
                    Retry
                </button>
            </div>
        );
    }

    const statsCards = [
        {
            title: "Total Orders",
            value: dashboardData?.dashboardStats?.totalOrders || 0,
            icon: <FiShoppingBag size={24} />,
            color: "bg-blue-100 text-blue-600"
        },
        {
            title: "Pending Orders",
            value: dashboardData?.dashboardStats?.pendingOrders || 0,
            icon: <FiClock size={24} />, // Changed icon to FiClock
            color: "bg-yellow-100 text-yellow-600"
        },
        {
            title: "Saved Cards",
            value: dashboardData?.dashboardStats?.savedCards || 0,
            icon: <FiCreditCard size={24} />,
            color: "bg-green-100 text-green-600"
        },
        {
            title: "Wishlist Items",
            value: dashboardData?.dashboardStats?.wishlistItems || 0,
            icon: <FiStar size={24} />,
            color: "bg-red-100 text-red-600"
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Shopping Dashboard</h1>
                <p className="text-gray-600 text-sm mt-2 sm:mt-0">
                    Last login: {dashboardData?.dashboardStats?.lastLogin ? new Date(dashboardData.dashboardStats.lastLogin).toLocaleString() : 'N/A'}
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-4 md:p-5 border border-gray-100">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-full ${stat.color}`}> {/* Icon background larger, rounded-full */}
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-4 border-b pb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
                    <button
                        onClick={() => navigate('/profile/orders')}
                        className="text-red-700 hover:text-red-800 font-medium transition-colors"
                    >
                        View All
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {dashboardData?.recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-gray-600">No recent orders found.</td>
                                </tr>
                            ) : (
                                dashboardData?.recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderIdDisplay}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{order.date}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{order.itemsCount}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{formatCurrency(order.amount)}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getOrderStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-md p-6 text-center border border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-2">Need Help?</h3>
                    <p className="text-sm text-gray-600 mb-4">Contact our support team for assistance</p>
                    <button
                        onClick={() => navigate('/profile/support')}
                        className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-800 transition"
                    >
                        Contact Support
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 text-center border border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-2">Your Wishlist</h3>
                    <p className="text-sm text-gray-600 mb-4">{dashboardData?.dashboardStats?.wishlistItems || 0} items saved for later</p>
                    <button
                        onClick={() => navigate('/wishlist')} // Navigate to /wishlist
                        className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-800 transition"
                    >
                        View Wishlist
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 text-center border border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-2">Account Settings</h3>
                    <p className="text-sm text-gray-600 mb-4">Manage your profile and preferences</p>
                    <button
                        onClick={() => navigate('/profile/settings')} // Navigate to /profile/settings
                        className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-800 transition"
                    >
                        Go to Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;