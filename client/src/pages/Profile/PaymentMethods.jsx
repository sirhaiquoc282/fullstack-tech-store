import React, { useState } from "react";
import { FiPlus, FiTrash2, FiEdit, FiCheckCircle } from "react-icons/fi"; // Thêm FiCheckCircle
import { FaCcVisa, FaCcMastercard, FaCreditCard } from "react-icons/fa"; // Icons cho loại thẻ
import { toast } from "react-toastify"; // Để hiển thị thông báo

const ProfilePaymentMethods = () => {
    const [cards, setCards] = useState([
        {
            id: 1,
            type: "Visa", // Loại thẻ
            bank: "Vietcombank", // Ngân hàng
            number: "**** **** **** 4512",
            name: "NGUYEN VAN A", // Tên chủ thẻ (Viết hoa thường)
            expiry: "12/25",
            isDefault: true,
        },
        {
            id: 2,
            type: "Mastercard",
            bank: "Techcombank",
            number: "**** **** **** 7821",
            name: "TRAN THI B",
            expiry: "08/24",
            isDefault: false,
        },
        {
            id: 3,
            type: "ATM", // Thẻ nội địa
            bank: "Agribank",
            number: "**** **** **** 1001",
            name: "LE VAN C",
            expiry: "N/A", // Thẻ ATM thường không có ngày hết hạn rõ ràng trên thẻ
            isDefault: false,
        },
    ]);

    const [showAddForm, setShowAddForm] = useState(false); // State để hiển thị/ẩn form thêm mới
    const [newCardData, setNewCardData] = useState({ // State cho dữ liệu form thêm mới
        type: "",
        bank: "",
        number: "",
        name: "",
        expiry: "",
    });

    const handleSetDefault = (id) => {
        setCards((prevCards) =>
            prevCards.map((card) => ({
                ...card,
                isDefault: card.id === id,
            }))
        );
        toast.success("Đã đặt làm phương thức mặc định.");
    };

    const handleDelete = (id) => {
        setCards((prevCards) => prevCards.filter((card) => card.id !== id));
        toast.info("Phương thức thanh toán đã được xóa.");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCardData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleAddNewCard = (e) => {
        e.preventDefault();
        if (!newCardData.type || !newCardData.bank || !newCardData.number || !newCardData.name) {
            toast.error("Vui lòng điền đầy đủ thông tin thẻ.");
            return;
        }

        const newId = cards.length > 0 ? Math.max(...cards.map(c => c.id)) + 1 : 1;
        const newCard = {
            id: newId,
            ...newCardData,
            isDefault: false, // Thẻ mới thường không phải là mặc định
        };

        setCards((prevCards) => [...prevCards, newCard]);
        setNewCardData({ type: "", bank: "", number: "", name: "", expiry: "" }); // Reset form
        setShowAddForm(false); // Ẩn form
        toast.success("Đã thêm phương thức thanh toán mới.");
    };

    // Helper để lấy icon phù hợp
    const getCardIcon = (type) => {
        switch (type.toLowerCase()) {
            case "visa":
                return <FaCcVisa className="text-white text-xl" />;
            case "mastercard":
                return <FaCcMastercard className="text-white text-xl" />;
            case "atm": // Icon cho thẻ ATM/nội địa
                return <FaCreditCard className="text-white text-xl" />;
            default:
                return <FiCreditCard className="text-white" />;
        }
    };

    return (
        <div className="space-y-8 p-4 md:p-6 bg-white rounded-xl shadow-lg"> {/* Padding và shadow cho toàn bộ khối */}
            {/* Header và Nút thêm mới */}
            <div className="flex justify-between items-center border-b pb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Phương Thức Thanh Toán</h1>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="
            bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center
            hover:bg-blue-700 transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          "
                >
                    <FiPlus className="mr-2 text-lg" />
                    {showAddForm ? "Hủy Thêm Mới" : "Thêm Mới"}
                </button>
            </div>

            {/* Form thêm phương thức mới (hiển thị theo chiều dọc) */}
            {showAddForm && (
                <div className="bg-gray-50 p-6 rounded-lg shadow-inner border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Thêm Phương Thức Thanh Toán Mới</h2>
                    <form onSubmit={handleAddNewCard} className="space-y-4">
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Loại Thẻ</label>
                            <select
                                id="type"
                                name="type"
                                value={newCardData.type}
                                onChange={handleInputChange}
                                className="
                  block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                "
                                required
                            >
                                <option value="">Chọn loại thẻ</option>
                                <option value="Visa">Visa</option>
                                <option value="Mastercard">Mastercard</option>
                                <option value="ATM">Thẻ ATM nội địa</option>
                                <option value="JCB">JCB</option> {/* Thêm loại thẻ phổ biến khác */}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="bank" className="block text-sm font-medium text-gray-700 mb-1">Ngân Hàng</label>
                            <input
                                type="text"
                                id="bank"
                                name="bank"
                                value={newCardData.bank}
                                onChange={handleInputChange}
                                className="
                  block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                "
                                placeholder="Ví dụ: Vietcombank, Techcombank..."
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">Số Thẻ (4 số cuối)</label>
                            <input
                                type="text"
                                id="number"
                                name="number"
                                value={newCardData.number}
                                onChange={handleInputChange}
                                className="
                  block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                "
                                placeholder="VD: **** **** **** 1234"
                                maxLength={19} // Số thẻ thường là 16-19 chữ số
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Tên Chủ Thẻ</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={newCardData.name}
                                onChange={handleInputChange}
                                className="
                  block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                "
                                placeholder="Tên trên thẻ (VIẾT HOA KHÔNG DẤU)"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">Ngày Hết Hạn (MM/YY)</label>
                            <input
                                type="text"
                                id="expiry"
                                name="expiry"
                                value={newCardData.expiry}
                                onChange={handleInputChange}
                                className="
                  block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                "
                                placeholder="VD: 12/25 (Nếu là thẻ ATM, có thể bỏ trống)"
                                maxLength={5}
                            />
                        </div>
                        <button
                            type="submit"
                            className="
                w-full bg-green-600 text-white px-4 py-2.5 rounded-md flex items-center justify-center
                hover:bg-green-700 transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
              "
                        >
                            <FiPlus className="mr-2" /> Thêm Thẻ
                        </button>
                    </form>
                </div>
            )}

            {/* Danh sách các phương thức thanh toán hiện có */}
            <div className="space-y-4"> {/* Dùng space-y để tạo khoảng cách giữa các card */}
                {cards.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">Bạn chưa có phương thức thanh toán nào.</p>
                ) : (
                    cards.map((card) => (
                        <div
                            key={card.id}
                            className="
                bg-white rounded-xl shadow-md border border-gray-200 p-6
                flex flex-col sm:flex-row justify-between items-start sm:items-center
              "
                        >
                            {/* Thông tin thẻ */}
                            <div className="flex items-center mb-4 sm:mb-0">
                                <div className={`
                  w-12 h-8 rounded-md flex items-center justify-center mr-4 text-white text-lg
                  ${card.type === "Visa" ? "bg-blue-800" :
                                        card.type === "Mastercard" ? "bg-red-700" :
                                            card.type === "ATM" ? "bg-green-700" : "bg-gray-700"
                                    }
                `}>
                                    {getCardIcon(card.type)}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-800">{card.bank} ({card.type})</h3>
                                    <p className="text-sm text-gray-600">{card.number}</p>
                                </div>
                            </div>

                            {/* Chi tiết và hành động */}
                            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                                <div className="text-right sm:text-left mr-0 sm:mr-6">
                                    <p className="text-sm text-gray-500">Chủ thẻ</p>
                                    <p className="font-medium text-gray-700">{card.name}</p>
                                </div>
                                {card.expiry !== "N/A" && (
                                    <div className="text-right sm:text-left mr-0 sm:mr-6">
                                        <p className="text-sm text-gray-500">Hết hạn</p>
                                        <p className="font-medium text-gray-700">{card.expiry}</p>
                                    </div>
                                )}

                                {/* Nút đặt làm mặc định */}
                                <button
                                    onClick={() => handleSetDefault(card.id)}
                                    className={`
                    py-2 px-4 rounded-full text-sm font-medium
                    ${card.isDefault
                                            ? "bg-green-100 text-green-800 cursor-default"
                                            : "bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors duration-200"
                                        }
                  `}
                                    disabled={card.isDefault}
                                >
                                    {card.isDefault ? (
                                        <span className="flex items-center"><FiCheckCircle className="mr-1" /> Mặc định</span>
                                    ) : (
                                        "Đặt làm mặc định"
                                    )}
                                </button>

                                {/* Nút hành động (Edit, Delete) */}
                                <div className="flex space-x-2">
                                    <button
                                        className="
                      p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-gray-100
                      transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500
                    "
                                        title="Chỉnh sửa"
                                    >
                                        <FiEdit className="text-lg" />
                                    </button>
                                    <button
                                        className="
                      p-2 rounded-full text-gray-500 hover:text-red-600 hover:bg-gray-100
                      transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500
                    "
                                        title="Xóa"
                                        onClick={() => handleDelete(card.id)}
                                    >
                                        <FiTrash2 className="text-lg" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Phần bảo mật thanh toán */}
            <div className="bg-gray-50 rounded-xl shadow-inner p-6 border border-gray-200 mt-8"> {/* shadow-inner, border */}
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Bảo Mật Thanh Toán</h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                    Thông tin thanh toán của bạn được lưu trữ và mã hóa an toàn. Chúng tôi cam kết không chia sẻ chi tiết tài chính của bạn với bên thứ ba.
                </p>
                <div className="flex items-center text-green-600 font-medium">
                    <FiCheckCircle className="h-5 w-5 mr-2" /> {/* Sử dụng FiCheckCircle từ react-icons */}
                    <span>Xử lý thanh toán an toàn và bảo mật</span>
                </div>
            </div>
        </div>
    );
};

export default ProfilePaymentMethods;