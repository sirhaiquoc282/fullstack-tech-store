import React, { useState } from "react";
import { FiPackage, FiCheckCircle, FiXCircle, FiClock } from "react-icons/fi";

const ProfileReturns = () => {
    const [activeTab, setActiveTab] = useState("all");

    const returns = [
        {
            id: "#RET-001",
            orderId: "#ORD-002",
            date: "2023-06-25",
            items: [
                { name: "Smart Watch", reason: "Wrong size" }
            ],
            status: "processing"
        },
        {
            id: "#RET-002",
            orderId: "#ORD-001",
            date: "2023-06-15",
            items: [
                { name: "Phone Case", reason: "Defective product" }
            ],
            status: "completed"
        },
        {
            id: "#RET-003",
            orderId: "#ORD-003",
            date: "2023-06-05",
            items: [
                { name: "USB-C Cable", reason: "Changed mind" }
            ],
            status: "cancelled"
        }
    ];

    const filteredReturns = returns.filter(returnItem => {
        if (activeTab === "all") return true;
        return returnItem.status === activeTab;
    });

    const getStatusInfo = (status) => {
        switch (status) {
            case "processing":
                return { text: "Processing", color: "bg-yellow-100 text-yellow-800", icon: <FiClock /> };
            case "completed":
                return { text: "Completed", color: "bg-green-100 text-green-800", icon: <FiCheckCircle /> };
            case "cancelled":
                return { text: "Cancelled", color: "bg-red-100 text-red-800", icon: <FiXCircle /> };
            default:
                return { text: "Unknown", color: "bg-gray-100 text-gray-800" };
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Returns & Exchanges</h1>
                <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">
                    Start a Return
                </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => setActiveTab("all")}
                    className={`px-4 py-2 rounded-md ${activeTab === "all"
                        ? "bg-red-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700"
                        }`}
                >
                    All Returns
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
                    onClick={() => setActiveTab("completed")}
                    className={`px-4 py-2 rounded-md ${activeTab === "completed"
                        ? "bg-red-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700"
                        }`}
                >
                    Completed
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
                {filteredReturns.map((returnItem) => {
                    const statusInfo = getStatusInfo(returnItem.status);

                    return (
                        <div key={returnItem.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{returnItem.id}</p>
                                    <p className="text-sm text-gray-500">For Order: {returnItem.orderId}</p>
                                </div>
                                <div className="flex items-center">
                                    {/* Thay đổi ở đây: Thêm `flex items-center` và `gap-1` vào span */}
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color} flex items-center gap-1`}>
                                        {statusInfo.icon && <span>{statusInfo.icon}</span>}
                                        {statusInfo.text}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4 border-b border-gray-200">
                                {returnItem.items.map((item, index) => (
                                    <div key={index} className="flex items-center py-2">
                                        <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4 flex items-center justify-center">
                                            <FiPackage className="text-gray-500" size={24} />
                                        </div>
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-gray-500">Reason: {item.reason}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 flex justify-between items-center">
                                <p className="text-sm text-gray-500">Requested on {returnItem.date}</p>
                                <button className="text-red-600 hover:text-red-800 font-medium">
                                    View Details
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Return Policy</h2>
                <p className="text-gray-600 mb-4">
                    We want you to be completely satisfied with your purchase. If you're not happy with an item,
                    you can return it within 30 days of receiving your order for a refund or exchange.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>Items must be unused, unworn, and in their original condition with tags attached</li>
                    <li>Returns must be initiated within 30 days of delivery</li>
                    <li>Refunds will be issued to the original payment method</li>
                    <li>Shipping costs for returns are the responsibility of the customer</li>
                </ul>
            </div>
        </div>
    );
};

export default ProfileReturns;