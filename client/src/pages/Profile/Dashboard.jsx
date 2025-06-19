import React from "react";
import { FiShoppingBag, FiPackage, FiCreditCard, FiStar } from "react-icons/fi";

const Dashboard = () => {
    // Stats cards
    const statsCards = [
        {
            title: "Total Orders",
            value: "12",
            icon: <FiShoppingBag size={24} />,
            color: "bg-blue-100 text-blue-600"
        },
        {
            title: "Pending Orders",
            value: "2",
            icon: <FiPackage size={24} />,
            color: "bg-yellow-100 text-yellow-600"
        },
        {
            title: "Saved Cards",
            value: "3",
            icon: <FiCreditCard size={24} />,
            color: "bg-green-100 text-green-600"
        },
        {
            title: "Wishlist Items",
            value: "8",
            icon: <FiStar size={24} />,
            color: "bg-red-100 text-red-600"
        },
    ];

    // Recent orders
    const recentOrders = [
        { id: "#ORD-001", date: "2023-06-20", items: 3, amount: "$245.00", status: "Delivered" },
        { id: "#ORD-002", date: "2023-06-18", items: 5, amount: "$189.50", status: "Processing" },
        { id: "#ORD-003", date: "2023-06-15", items: 2, amount: "$89.99", status: "Cancelled" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Shopping Dashboard</h1>
                <p className="text-gray-600">Last login: Today, 14:30</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg shadow p-4">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">{stat.title}</p>
                                <p className="text-xl font-bold mt-1">{stat.value}</p>
                            </div>
                            <div className={`p-2 rounded-lg ${stat.color}`}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Recent Orders</h2>
                    <a href="/profile/orders" className="text-red-600 hover:underline">View All</a>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-2">Order ID</th>
                                <th className="text-left py-2">Date</th>
                                <th className="text-left py-2">Items</th>
                                <th className="text-left py-2">Amount</th>
                                <th className="text-left py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3">{order.id}</td>
                                    <td className="py-3">{order.date}</td>
                                    <td className="py-3">{order.items}</td>
                                    <td className="py-3">{order.amount}</td>
                                    <td className="py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs ${order.status === "Delivered" ? "bg-green-100 text-green-800" :
                                            order.status === "Processing" ? "bg-yellow-100 text-yellow-800" :
                                                "bg-red-100 text-red-800"
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <h3 className="font-semibold mb-2">Need Help?</h3>
                    <p className="text-sm text-gray-600 mb-4">Contact our support team for assistance</p>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">
                        Contact Support
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <h3 className="font-semibold mb-2">Your Wishlist</h3>
                    <p className="text-sm text-gray-600 mb-4">8 items saved for later</p>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">
                        View Wishlist
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <h3 className="font-semibold mb-2">Shopping Preferences</h3>
                    <p className="text-sm text-gray-600 mb-4">Customize your shopping experience</p>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">
                        Update Preferences
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;