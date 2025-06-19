import React, { useState, useRef } from "react"; // Import useRef
import { FiHelpCircle, FiMessageSquare, FiSearch, FiPlus, FiChevronDown, FiChevronUp } from "react-icons/fi"; // Thêm FiChevronDown, FiChevronUp

const Supports = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [openFaqIndex, setOpenFaqIndex] = useState(null); // State cho FAQ accordion

    // Tạo ref cho phần FAQ
    const faqSectionRef = useRef(null);

    // Mock support tickets
    const tickets = [
        { id: 1, subject: "Payment Issue", status: "open", priority: "high", lastUpdate: "2 hours ago" },
        { id: 2, subject: "Account Verification", status: "in-progress", priority: "medium", lastUpdate: "1 day ago" },
        { id: 3, subject: "Product Return", status: "resolved", priority: "medium", lastUpdate: "3 days ago" },
        { id: 4, subject: "Shipping Inquiry", status: "closed", priority: "low", lastUpdate: "1 week ago" },
        { id: 5, subject: "Technical Support", status: "open", priority: "high", lastUpdate: "Just now" },
    ];

    const filteredTickets = tickets.filter(ticket => {
        if (activeTab === "all") return true;
        return ticket.status === activeTab;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case "open": return "bg-red-100 text-red-800";
            case "in-progress": return "bg-yellow-100 text-yellow-800";
            case "resolved": return "bg-blue-100 text-blue-800";
            case "closed": return "bg-green-100 text-green-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    // Hàm xử lý cuộn đến phần FAQ
    const handleViewFaqsClick = () => {
        if (faqSectionRef.current) {
            faqSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    // Hàm toggle FAQ accordion
    const handleFaqToggle = (index) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Support Center</h1>
                <button className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-red-700 transition">
                    <FiPlus className="mr-2" />
                    New Ticket
                </button>
            </div>

            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 text-white">
                <div className="flex items-start">
                    <div className="mr-4">
                        <FiHelpCircle size={32} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold mb-2">How can we help you?</h2>
                        <p className="mb-4">Our support team is here to assist you with any questions or issues you may have.</p>
                        <div className="flex space-x-3">
                            <button
                                onClick={handleViewFaqsClick} // Thêm onClick để cuộn
                                className="bg-white text-red-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition"
                            >
                                View FAQs
                            </button>
                            <button className="border border-white px-4 py-2 rounded-md font-medium hover:bg-white hover:text-red-600 transition">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FiSearch className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search support tickets..."
                        className="w-full md:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                </div>

                <div className="inline-flex rounded-md shadow-sm" role="group">
                    <button
                        type="button"
                        onClick={() => setActiveTab("all")}
                        className={`px-4 py-2 text-sm font-medium rounded-l-lg ${activeTab === "all"
                            ? "bg-red-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        All Tickets
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("open")}
                        className={`px-4 py-2 text-sm font-medium ${activeTab === "open"
                            ? "bg-red-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        Open
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("in-progress")}
                        className={`px-4 py-2 text-sm font-medium ${activeTab === "in-progress"
                            ? "bg-red-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        In Progress
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("resolved")}
                        className={`px-4 py-2 text-sm font-medium rounded-r-lg ${activeTab === "resolved"
                            ? "bg-red-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        Resolved
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTickets.map((ticket) => (
                    <div key={ticket.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:border-red-300 transition-colors">
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                        <FiMessageSquare className="mr-2 text-red-600" />
                                        {ticket.subject}
                                    </h3>
                                    <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                        {ticket.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                    </span>
                                </div>
                                <span className={`text-xs font-medium ${ticket.priority === "high"
                                    ? "text-red-600"
                                    : ticket.priority === "medium"
                                        ? "text-yellow-600"
                                        : "text-green-600"
                                    }`}>
                                    {ticket.priority.toUpperCase()}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                Last update: {ticket.lastUpdate}
                            </p>
                        </div>
                        <div className="bg-gray-50 px-5 py-3 flex justify-end">
                            <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Phần Câu Hỏi Thường Gặp (FAQs) */}
            <div ref={faqSectionRef} className="bg-white rounded-xl shadow-lg p-6"> {/* Gắn ref ở đây */}
                <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {[
                        {
                            question: "How do I reset my password?",
                            answer: "You can reset your password by clicking on 'Forgot Password' on the login page and following the instructions sent to your email."
                        },
                        {
                            question: "What payment methods do you accept?",
                            answer: "We accept all major credit cards, PayPal, and bank transfers. Some payment methods may vary by region."
                        },
                        {
                            question: "How long does shipping take?",
                            answer: "Standard shipping takes 3-5 business days. Express shipping is available for an additional fee and takes 1-2 business days."
                        },
                        {
                            question: "Can I return a product?",
                            answer: "Yes, we have a 30-day return policy. Items must be in their original condition with tags attached."
                        },
                    ].map((faq, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                            <button
                                onClick={() => handleFaqToggle(index)} // Thêm onClick để toggle accordion
                                className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
                            >
                                <span className="font-medium">{faq.question}</span>
                                {openFaqIndex === index ? (
                                    <FiChevronUp className="w-5 h-5 text-gray-500" /> // Icon lên khi mở
                                ) : (
                                    <FiChevronDown className="w-5 h-5 text-gray-500" /> // Icon xuống khi đóng
                                )}
                            </button>
                            {/* Nội dung FAQ, sử dụng conditional rendering hoặc max-height/opacity cho transition */}
                            <div
                                className={`
                                  overflow-hidden transition-all duration-300 ease-in-out
                                  ${openFaqIndex === index ? "max-h-96 opacity-100 p-4" : "max-h-0 opacity-0"}
                                `}
                            >
                                <p className="text-gray-600">{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Supports;