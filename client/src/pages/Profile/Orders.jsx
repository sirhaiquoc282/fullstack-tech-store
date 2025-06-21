import React, { useState, useEffect } from "react";
import { FiSearch, FiFilter, FiTruck, FiCheckCircle, FiPackage, FiXCircle, FiInfo } from "react-icons/fi";
import apiService from "../../service/apiService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProfileOrders = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("all");
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await apiService.getUserOrders();
                if (response.status === 200) {
                    console.log("Fetched Orders Data:", response.data.orders);
                    setOrders(response.data.orders);
                } else {
                    setError("Failed to fetch orders.");
                    toast.error("Failed to fetch orders.");
                }
            } catch (err) {
                console.error("Error fetching orders:", err);
                setError(err.response?.data?.message || "Error connecting to server.");
                toast.error(err.response?.data?.message || "Failed to load orders.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusInfo = (status) => {
        const s = status ? status.toLowerCase() : 'unknown';
        switch (s) {
            case "delivered":
                return { text: "Delivered", color: "bg-green-100 text-green-800", icon: <FiCheckCircle /> };
            case "shipped":
                return { text: "Shipped", color: "bg-blue-100 text-blue-800", icon: <FiTruck /> };
            case "processing":
                return { text: "Processing", color: "bg-yellow-100 text-yellow-800", icon: <FiPackage /> };
            case "pending":
                return { text: "Pending", color: "bg-yellow-100 text-yellow-800", icon: <FiPackage /> };
            case "cancelled":
                return { text: "Cancelled", color: "bg-red-100 text-red-800", icon: <FiXCircle /> };
            default:
                return { text: "Unknown", color: "bg-gray-100 text-gray-800", icon: <FiInfo /> };
        }
    };

    const filteredOrders = orders.filter(order => {
        const orderIdDisplay = order.orderIdDisplay || '';
        const orderStatus = order.status || '';

        const matchesTab = activeTab === "all" || orderStatus.toLowerCase() === activeTab;
        const matchesSearch = orderIdDisplay.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.items && order.items.some(item => item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())));
        return matchesTab && matchesSearch;
    });

    const formatCurrency = (amount) => {
        if (typeof amount !== 'number') return '$0.00';
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
                <p className="ml-4 text-gray-600">Loading orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Orders</h2>
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

    return (
        <div className="space-y-6 p-4 md:p-6 bg-white rounded-xl shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">My Orders</h1>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search orders..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-red-700 transition-all duration-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex-shrink-0 flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors">
                        <FiFilter className="mr-2" />
                        Filter
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`
                            px-4 py-2 rounded-lg text-sm font-medium
                            ${activeTab === tab
                                ? "bg-red-700 text-white shadow-sm"
                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                            }
                            transition-all duration-220 focus:outline-none focus:ring-2 focus:ring-red-300
                        `}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
                    </button>
                ))}
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {/* Corrected ternary and map structure below */}
                        {filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-8 text-gray-600">No orders found for this filter.</td>
                            </tr>
                        ) : (
                            filteredOrders.map((order) => {
                                const statusInfo = getStatusInfo(order.status);
                                return (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {order.orderIdDisplay}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                            {order.date}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                            {order.itemsCount}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                            {formatCurrency(order.amount)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 ${statusInfo.color}`}>
                                                {statusInfo.icon && <span>{statusInfo.icon}</span>}
                                                {statusInfo.text}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => navigate(`/profile/orders/${order.id}`)}
                                                className="text-red-700 hover:text-red-800 font-medium text-sm transition-colors"
                                            >
                                                View Details
                                            </button>
                                            {order.status === "Delivered" && (
                                                <button className="ml-4 text-gray-600 hover:text-red-700 font-medium text-sm transition-colors">
                                                    Return
                                                </button>
                                            )}
                                            {order.status === "Shipped" && (
                                                <button className="ml-4 text-gray-600 hover:text-blue-700 font-medium text-sm transition-colors">
                                                    Track
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ); // Make sure this 'return' and its closing ')' are present
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 pt-4 mt-6">
                <div className="text-sm text-gray-700 mb-2 sm:mb-0">
                    Showing <span className="font-medium">{filteredOrders.length > 0 ? 1 : 0}</span> to <span className="font-medium">{filteredOrders.length}</span> of{' '}
                    <span className="font-medium">{filteredOrders.length}</span> orders
                </div>
                <div className="inline-flex rounded-md shadow-sm">
                    <button className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-300">
                        Previous
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-300">
                        1
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-300">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileOrders;