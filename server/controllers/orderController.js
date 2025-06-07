const Order = require('../models/order');
const asyncHandler = require('express-async-handler');

// [POST] Tạo đơn hàng mới
const createOrder = asyncHandler(async (req, res) => {
    const { products, amount, address } = req.body;
    const userId = req.user._id;

    if (!products || !amount || !address) {
        return res.status(400).json({ success: false, message: 'Thiếu thông tin đơn hàng' });
    }

    const order = await Order.create({
        userId,
        products,
        amount,
        address
    });

    res.status(201).json({ success: true, order });
});

// [GET] Lấy tất cả đơn hàng của người dùng hiện tại
const getUserOrders = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const orders = await Order.find({ userId }).populate('products.productId');
    res.status(200).json({ success: true, orders });
});

// [GET] Lấy tất cả đơn hàng (Admin)
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find().populate('userId', 'firstName lastName email').populate('products.productId');
    res.status(200).json({ success: true, orders });
});

// [PUT] Cập nhật trạng thái đơn hàng (Admin)
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true }
    );

    if (!updatedOrder) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }

    res.status(200).json({ success: true, order: updatedOrder });
});

module.exports = {
    createOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus
};
