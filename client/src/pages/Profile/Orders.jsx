import React, { useState } from "react";
import { FiPackage, FiSearch, FiFilter, FiTruck, FiCheckCircle } from "react-icons/fi";

const ProfileOrders = () => {
    const [activeTab, setActiveTab] = useState("all");

    const orders = [
        {
            id: "#ORD-001",
            date: "2023-06-20",
            items: [
                { name: "Wireless Headphones", price: 99.99, quantity: 1 },
                { name: "Phone Case", price: 19.99, quantity: 2 }
            ],
            total: 139.97,
            status: "delivered"
        },
        {
            id: "#ORD-002",
            date: "2023-06-18",
            items: [
                { name: "Smart Watch", price: 199.99, quantity: 1 }
            ],
            total: 199.99,
            status: "shipped"
        },
        {
            id: "#ORD-003",
            date: "2023-06-15",
            items: [
                { name: "Laptop Backpack", price: 49.99, quantity: 1 },
                { name: "USB-C Cable", price: 12.99, quantity: 3 }
            ],
            total: 88.96,
            status: "processing"
        },
        {
            id: "#ORD-004",
            date: "2023-06-10",
            items: [
                { name: "Bluetooth Speaker", price: 79.99, quantity: 1 }
            ],
            total: 79.99,
            status: "cancelled"
        }
    ];

    const filteredOrders = orders.filter(order => {
        if (activeTab === "all") return true;
        return order.status === activeTab;
    });

    const getStatusInfo = (status) => {
        switch (status) {
            case "delivered":
                return { text: "Delivered", color: "bg-green-100 text-green-800", icon: <FiCheckCircle /> };
            case "shipped":
                return { text: "Shipped", color: "bg-blue-100 text-blue-800", icon: <FiTruck /> };
            case "processing":
                return { text: "Processing", color: "bg-yellow-100 text-yellow-800", icon: <FiPackage /> };
            case "cancelled":
                return { text: "Cancelled", color: "bg-red-100 text-red-800", icon: <FiPackage /> };
            default:
                return { text: "Unknown", color: "bg-gray-100 text-gray-800" };
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Orders</h1>
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <FiSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search orders..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                        />
                    </div>
                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                        <FiFilter className="mr-2" />
                        Filter
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => setActiveTab("all")}
                    className={`px-4 py-2 rounded-md ${activeTab === "all"
                        ? "bg-red-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700"
                        }`}
                >
                    All Orders
                </button>
                <button
                    onClick={() => setActiveTab("processing")}
                    className={`px-4 py-2 rounded-md ${activeTab === "processing"
                        ? "bg-red-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700"
                        }`}
                >
                    Processing
                </button>
                <button
                    onClick={() => setActiveTab("shipped")}
                    className={`px-4 py-2 rounded-md ${activeTab === "shipped"
                        ? "bg-red-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700"
                        }`}
                >
                    Shipped
                </button>
                <button
                    onClick={() => setActiveTab("delivered")}
                    className={`px-4 py-2 rounded-md ${activeTab === "delivered"
                        ? "bg-red-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700"
                        }`}
                >
                    Delivered
                </button>
                <button
                    onClick={() => setActiveTab("cancelled")}
                    className={`px-4 py-2 rounded-md ${activeTab === "cancelled"
                        ? "bg-red-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700"
                        }`}
                >
                    Cancelled
                </button>
            </div>

            <div className="space-y-4">
                {filteredOrders.map((order) => {
                    const statusInfo = getStatusInfo(order.status);

                    return (
                        <div key={order.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{order.id}</p>
                                    <p className="text-sm text-gray-500">Ordered on {order.date}</p>
                                </div>
                                <div className="flex items-center">
                                    {/* Thay đổi ở đây: Thêm `flex items-center` và `gap-1` vào span */}
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color} flex items-center gap-1`}>
                                        {statusInfo.icon && <span>{statusInfo.icon}</span>} {/* Bọc icon trong span để dễ kiểm soát khoảng cách */}
                                        {statusInfo.text}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4 border-b border-gray-200">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex justify-between py-2">
                                        <div>
                                            <p>{item.name}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p>${item.price.toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 flex justify-between items-center">
                                <p className="font-semibold">Total: ${order.total.toFixed(2)}</p>
                                <div className="flex space-x-3">
                                    <button className="text-red-600 hover:text-red-800 font-medium">
                                        View Details
                                    </button>
                                    {order.status === "delivered" && (
                                        <button className="text-red-600 hover:text-red-800 font-medium">
                                            Return Item
                                        </button>
                                    )}
                                    {order.status === "shipped" && (
                                        <button className="text-red-600 hover:text-red-800 font-medium">
                                            Track Order
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of{' '}
                    <span className="font-medium">4</span> orders
                </div>
                <div className="inline-flex rounded-md shadow-sm">
                    <button className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        Previous
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        1
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileOrders;