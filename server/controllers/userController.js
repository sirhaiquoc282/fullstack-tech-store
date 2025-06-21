const User = require('../models/User');
const Order = require('../models/Order');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');

const getUserProfile = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const user = await User.findById(_id).select('-password -refreshToken');
        if (!user) {
            res.status(404);
            throw new Error("User not found.");
        }
        res.json({ user });
    } catch (error) {
        res.status(500);
        throw new Error("Failed to fetch user profile: " + error.message);
    }
});

const getUserPaymentMethods = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    try {
        const user = await User.findById(userId).select('savedCards');
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json(user.savedCards); // Trả về mảng savedCards
    } catch (error) {
        console.error("Error fetching user payment methods:", error);
        res.status(500).json({ message: "Failed to fetch payment methods." });
    }
});

// @desc Add a new payment method or Update an existing one
// @route POST /api/users/payment-methods (for add)
// @route PUT /api/users/payment-methods/:cardId (for update)
// @access Private
const saveUserPaymentMethod = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const cardId = req.params.cardId; // Có thể có cho update
    const newCardData = req.body; // Dữ liệu thẻ mới/cập nhật

    try {
        const user = await User.findById(userId); // Chỉ fetch user MỘT LẦN
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (newCardData.isDefault) {
            // Logic: Nếu thẻ này được đặt làm mặc định, set tất cả thẻ khác về non-default
            user.savedCards.forEach(card => card.isDefault = false);
        }

        let updatedOrAddedCard; // Thẻ được cập nhật hoặc thêm mới

        if (cardId) { // Logic cho UPDATING một thẻ hiện có
            const cardIndex = user.savedCards.findIndex(card => card._id && card._id.toString() === cardId);

            if (cardIndex === -1) {
                return res.status(404).json({ message: "Payment method not found." });
            }

            // Cập nhật thẻ cụ thể với dữ liệu mới
            user.savedCards[cardIndex] = { ...user.savedCards[cardIndex]._doc, ...newCardData };
            updatedOrAddedCard = user.savedCards[cardIndex];

        } else { // Logic cho ADDING một thẻ mới
            // Thêm thẻ mới vào mảng
            user.savedCards.push(newCardData);
            updatedOrAddedCard = user.savedCards[user.savedCards.length - 1]; // Lấy thẻ vừa thêm
        }

        await user.save(); // LƯU THAY ĐỔI CỦA TOÀN BỘ NGƯỜI DÙNG CHỈ MỘT LẦN

        // Trả về toàn bộ danh sách thẻ đã được cập nhật, để frontend đồng bộ
        res.status(cardId ? 200 : 201).json({
            message: cardId ? "Payment method updated successfully." : "Payment method added successfully.",
            savedCards: user.savedCards // Trả về toàn bộ mảng đã cập nhật
        });

    } catch (error) {
        console.error("Error saving user payment method:", error);
        res.status(500).json({ message: "Failed to save payment method." });
    }
});

// @desc Delete a payment method for a user
// @route DELETE /api/users/payment-methods/:cardId
// @access Private
const deleteUserPaymentMethod = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { cardId } = req.params;

    try {
        const user = await User.findById(userId).select('savedCards'); // Chỉ select savedCards
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const initialLength = user.savedCards.length;
        // Lọc bỏ thẻ khỏi mảng. Dùng ._id.toString() để so sánh với chuỗi cardId
        user.savedCards = user.savedCards.filter(card => card._id.toString() !== cardId);

        if (user.savedCards.length === initialLength) {
            // Nếu độ dài không đổi, nghĩa là không tìm thấy thẻ với ID đó
            return res.status(404).json({ message: "Payment method not found in user's list." });
        }

        // Nếu thẻ bị xóa là thẻ mặc định, và vẫn còn thẻ khác
        // Cần đảm bảo có ít nhất một thẻ là mặc định (tùy logic bạn muốn)
        if (initialLength > 1 && user.savedCards.length > 0 && !user.savedCards.some(card => card.isDefault)) {
            user.savedCards[0].isDefault = true; // Đặt thẻ đầu tiên làm mặc định mới
        }

        await user.save(); // LƯU THAY ĐỔI VÀO DB sau khi lọc
        res.status(200).json({ message: "Payment method deleted successfully." });

    } catch (error) {
        console.error("Error deleting user payment method:", error);
        res.status(500).json({ message: "Failed to delete payment method." });
    }
});

const updateUserProfile = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                mobile: req.body.mobile,
                address: req.body.address
            },
            { new: true, runValidators: true }
        ).select('-password -refreshToken');

        if (!updatedUser) {
            res.status(404);
            throw new Error("User not found.");
        }
        res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500);
        throw new Error("Failed to update user profile: " + error.message);
    }
});

const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find().select('-password -refreshToken');
        res.json({ total: users.length, users });
    } catch (error) {
        res.status(500);
        throw new Error("Failed to fetch all users: " + error.message);
    }
});

const getAUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const user = await User.findById(id).select('-password -refreshToken');
        if (!user) {
            res.status(404);
            throw new Error("User not found.");
        }
        res.json({ user });
    } catch (error) {
        res.status(500);
        throw new Error("Failed to fetch user: " + error.message);
    }
});

const deleteAUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            res.status(404);
            throw new Error("User not found.");
        }
        res.json({ message: "User deleted successfully", deletedUser: { id: deletedUser._id, email: deletedUser.email } });
    } catch (error) {
        res.status(500);
        throw new Error("Failed to delete user: " + error.message);
    }
});

const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const user = await User.findByIdAndUpdate(id, { isBlocked: true }, { new: true }).select('-password -refreshToken');
        if (!user) {
            res.status(404);
            throw new Error("User not found.");
        }
        res.json({ message: "User blocked successfully", user });
    } catch (error) {
        res.status(500);
        throw new Error("Failed to block user: " + error.message);
    }
});

const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const user = await User.findByIdAndUpdate(id, { isBlocked: false }, { new: true }).select('-password -refreshToken');
        if (!user) {
            res.status(404);
            throw new Error("User not found.");
        }
        res.json({ message: "User unblocked successfully", user });
    } catch (error) {
        res.status(500);
        throw new Error("Failed to unblock user: " + error.message);
    }
})

const getUserDashboardStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    try {
        const user = await User.findById(userId)
            .populate('wishlist')
            .select('firstName lastName email wishlist savedCards lastLoginAt');

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const totalOrders = await Order.countDocuments({ userId: userId });
        const pendingOrders = await Order.countDocuments({ userId: userId, orderStatus: { $in: ['Pending', 'Processing'] } });

        const recentOrders = await Order.find({ userId: userId })
            .sort({ createdAt: -1 })
            .limit(3)
            .populate('products.productId', 'title price thumbnail')
            .select('id products totalAmount orderStatus createdAt');

        const savedCardsCount = user.savedCards ? user.savedCards.length : 0;

        const wishlistItemsCount = user.wishlist ? user.wishlist.length : 0;

        const formattedRecentOrders = recentOrders.map(order => ({
            id: order._id,
            orderIdDisplay: order._id.toString().slice(-6).toUpperCase(),
            date: order.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            itemsCount: order.products.reduce((acc, p) => acc + p.quantity, 0),
            amount: order.totalAmount,
            status: order.orderStatus,
        }));


        res.status(200).json({
            dashboardStats: {
                totalOrders,
                pendingOrders,
                savedCards: savedCardsCount,
                wishlistItems: wishlistItemsCount,
                lastLogin: user.lastLoginAt,
            },
            recentOrders: formattedRecentOrders,
            userProfile: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                avatarInitial: user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U',
            }
        });

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ message: "Failed to fetch dashboard stats." });
    }
});


const getUserAddresses = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    try {
        const user = await User.findById(userId).select('address');
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json(user.address); // Trả về mảng địa chỉ
    } catch (error) {
        console.error("Error fetching user addresses:", error);
        res.status(500).json({ message: "Failed to fetch addresses." });
    }
});

// @desc Add a new address or Update an existing address for a user
// @route POST /api/users/addresses (for add)
// @route PUT /api/users/addresses/:addressId (for update)
// @access Private
const saveUserAddress = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const addressId = req.params.addressId; // Có thể có cho update
    // Bóc tách các trường địa chỉ từ req.body, khớp với frontend
    const { addressName, fullName, phoneNumber, street, ward, district, province, country, isDefault } = req.body;

    try {
        const user = await User.findById(userId); // Chỉ fetch user MỘT LẦN
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // --- Logic: Đảm bảo chỉ có 1 địa chỉ mặc định ---
        if (isDefault) { // Nếu địa chỉ này được đặt làm mặc định
            user.address.forEach(addr => addr.isDefault = false); // Set tất cả địa chỉ khác về non-default
        }
        // --- Kết thúc Logic isDefault ---

        // Xây dựng đối tượng địa chỉ để lưu
        const addressDataToSave = {
            addressName,
            fullName,
            phoneNumber,
            street,
            ward: ward || {},     // Đảm bảo là object rỗng nếu null/undefined
            district: district || {}, // Đảm bảo là object rỗng
            province: province || {}, // Đảm bảo là object rỗng
            country: country || "Vietnam",
            isDefault
        };

        if (addressId) { // Logic cho UPDATING một địa chỉ hiện có
            const cardIndex = user.address.findIndex(addr => addr._id && addr._id.toString() === addressId); // Đổi tên biến từ cardIndex sang addressIndex

            if (cardIndex === -1) {
                return res.status(404).json({ message: "Address not found." });
            }

            // Cập nhật địa chỉ cụ thể với dữ liệu mới
            // Sử dụng ._doc để đảm bảo copy các thuộc tính Mongoose
            user.address[cardIndex] = { ...user.address[cardIndex]._doc, ...addressDataToSave, _id: user.address[cardIndex]._id }; // Giữ lại _id
        } else { // Logic cho ADDING một địa chỉ mới
            user.address.push(addressDataToSave);
        }

        await user.save(); // LƯU THAY ĐỔI CỦA TOÀN BỘ NGƯỜI DÙNG CHỈ MỘT LẦN

        // Trả về toàn bộ danh sách địa chỉ đã được cập nhật, để frontend đồng bộ
        res.status(addressId ? 200 : 201).json({
            message: addressId ? "Address updated successfully." : "Address added successfully.",
            addresses: user.address // Trả về toàn bộ mảng địa chỉ đã cập nhật
        });

    } catch (error) {
        console.error("Error saving user address:", error);
        res.status(500).json({ message: "Failed to save address." });
    }
});

// @desc Delete an address for a user
// @route DELETE /api/users/addresses/:addressId
// @access Private
const deleteUserAddress = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { addressId } = req.params;

    try {
        const user = await User.findById(userId).select('address'); // Chỉ select 'address'
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const initialLength = user.address.length;
        // Lọc bỏ địa chỉ khỏi mảng. Dùng ._id.toString() để so sánh với chuỗi addressId
        user.address = user.address.filter(addr => addr._id.toString() !== addressId);

        if (user.address.length === initialLength) {
            return res.status(404).json({ message: "Address not found in user's list." });
        }

        // Nếu địa chỉ bị xóa là mặc định, và vẫn còn địa chỉ khác
        // Cần đảm bảo có ít nhất một địa chỉ là mặc định (tùy logic bạn muốn)
        if (user.address.length > 0 && !user.address.some(addr => addr.isDefault)) {
            user.address[0].isDefault = true; // Đặt địa chỉ đầu tiên làm mặc định mới
        }

        await user.save(); // LƯU THAY ĐỔI VÀO DB sau khi lọc
        res.status(200).json({ message: "Address deleted successfully." });

    } catch (error) {
        console.error("Error deleting user address:", error);
        res.status(500).json({ message: "Failed to delete address." });
    }
});

module.exports = {
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    getAUser,
    deleteAUser,
    blockUser,
    unblockUser,
    getUserDashboardStats,
    getUserPaymentMethods,
    saveUserPaymentMethod,
    deleteUserPaymentMethod,
    getUserAddresses,
    saveUserAddress,
    deleteUserAddress
};