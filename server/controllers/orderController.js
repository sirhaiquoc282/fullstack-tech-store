const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');

const createOrder = asyncHandler(async (req, res) => {
    const { _id: userId } = req.user;
    const { shippingAddress, paymentInfo } = req.body;

    if (!shippingAddress || !paymentInfo || !paymentInfo.method || !paymentInfo.status) {
        res.status(400);
        throw new Error("Shipping address and payment information (method, status) are required.");
    }

    const userCart = await Cart.findOne({ userId }).populate('products.productId');
    if (!userCart || userCart.products.length === 0) {
        res.status(400);
        throw new Error("Cannot create order from an empty cart.");
    }

    const orderProducts = userCart.products.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.price,
    }));

    for (const item of userCart.products) {
        const product = await Product.findById(item.productId._id);
        if (!product || product.stock < item.quantity) {
            res.status(400);
            throw new Error(`Not enough stock for product: ${item.productId.title}. Available: ${product ? product.stock : 0}, Requested: ${item.quantity}`);
        }
    }

    const newOrder = await Order.create({
        userId,
        products: orderProducts,
        shippingAddress,
        totalAmount: userCart.totalPrice,
        paymentInfo,
        orderStatus: 'Pending',
    });

    for (const item of userOrder.products) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    }

    await Cart.findOneAndDelete({ userId });
    await User.findByIdAndUpdate(userId, { $unset: { cart: 1 } });

    res.status(201).json({ message: "Order created successfully", order: newOrder });
});

const getUserOrders = asyncHandler(async (req, res) => {
    const { _id: userId } = req.user; // Lấy ID người dùng từ req.user (từ authMiddleware)
    try {
        const orders = await Order.find({ userId })
            // Populate chi tiết sản phẩm (title, thumbnail) từ productId
            .populate('products.productId', 'title price thumbnail')
            .sort('-createdAt'); // Sắp xếp từ mới nhất đến cũ nhất

        // Để đơn giản hơn cho frontend, có thể format dữ liệu ngay tại đây
        const formattedOrders = orders.map(order => ({
            id: order._id,
            orderIdDisplay: `#ORD-${order._id.toString().slice(-6).toUpperCase()}`, // ID hiển thị rút gọn
            date: order.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), // Định dạng ngày
            items: order.products.map(p => ({
                name: p.productId.title,
                quantity: p.quantity,
                price: p.price, // Giá của sản phẩm tại thời điểm đặt hàng
                thumbnail: p.productId.thumbnail
            })),
            total: order.totalAmount,
            status: order.orderStatus,
        }));

        res.json({ total: formattedOrders.length, orders: formattedOrders });
    } catch (error) {
        console.error("Failed to fetch user orders:", error); // Log lỗi chi tiết
        res.status(500);
        throw new Error("Failed to fetch user orders: " + error.message);
    }
});

const getAllOrders = asyncHandler(async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'firstName lastName email mobile')
            .populate('products.productId')
            .sort('-createdAt');
        res.json({ total: orders.length, orders });
    } catch (error) {
        res.status(500);
        throw new Error("Failed to fetch all orders: " + error.message);
    }
});

const getSingleOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { _id: userId, role } = req.user;
    validateMongoDbId(id);

    try {
        const order = await Order.findById(id)
            .populate('userId', 'firstName lastName email mobile')
            .populate('products.productId');

        if (!order) {
            res.status(404);
            throw new Error("Order not found.");
        }

        if (role !== 'admin' && order.userId._id.toString() !== userId.toString()) {
            res.status(403);
            throw new Error("You are not authorized to view this order.");
        }

        res.json({ order });
    } catch (error) {
        res.status(500);
        throw new Error("Failed to fetch order: " + error.message);
    }
});


const updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    validateMongoDbId(id);

    if (!status) {
        res.status(400);
        throw new Error("Order status is required.");
    }
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
        res.status(400);
        throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { orderStatus: status, deliveredAt: status === 'Delivered' ? new Date() : undefined },
            { new: true, runValidators: true }
        ).populate('userId', 'firstName lastName email mobile')
            .populate('products.productId');

        if (!updatedOrder) {
            res.status(404);
            throw new Error("Order not found.");
        }
        res.json({ message: "Order status updated successfully", order: updatedOrder });
    } catch (error) {
        res.status(500);
        throw new Error("Failed to update order status: " + error.message);
    }
});

module.exports = {
    createOrder,
    getUserOrders,
    getAllOrders,
    getSingleOrder,
    updateOrderStatus,
};