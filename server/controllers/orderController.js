const Order = require('../models/order');
const asyncHandler = require('express-async-handler');

// [POST] /api/orders - Tạo đơn hàng mới
const createOrder = asyncHandler(async (req, res) => {
  const { userId, products, amount, address } = req.body;

  if (!userId || !products || !amount || !address) {
    return res.status(400).json({ success: false, message: 'Thiếu thông tin đơn hàng' });
  }

  const newOrder = await Order.create({ userId, products, amount, address });
  return res.status(201).json({ success: true, order: newOrder });
});

// [GET] /api/orders - Lấy danh sách tất cả đơn hàng
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('userId', 'firstName lastName email');
  return res.status(200).json({ success: true, orders });
});

// [GET] /api/orders/:id - Lấy chi tiết đơn hàng theo ID
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('userId', 'firstName lastName email');

  if (!order) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
  }

  return res.status(200).json({ success: true, order });
});

// [PUT] /api/orders/:id - Cập nhật đơn hàng
const updateOrder = asyncHandler(async (req, res) => {
  const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });

  if (!updatedOrder) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng để cập nhật' });
  }

  return res.status(200).json({ success: true, order: updatedOrder });
});

// [DELETE] /api/orders/:id - Xóa đơn hàng
const deleteOrder = asyncHandler(async (req, res) => {
  const deletedOrder = await Order.findByIdAndDelete(req.params.id);

  if (!deletedOrder) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng để xóa' });
  }

  return res.status(200).json({ success: true, message: 'Đã xóa đơn hàng thành công' });
});

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
