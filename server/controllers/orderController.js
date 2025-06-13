const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const asyncHandler = require('express-async-handler');

exports.createOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { shippingAddress, paymentIntent } = req.body;

    if (!shippingAddress || !paymentIntent) {
        res.status(400);
        throw new Error('Shipping address and payment intent are required.');
    }

    const userCart = await Cart.findOne({ userId: _id });
    if (!userCart || userCart.products.length === 0) {
        res.status(400);
        throw new Error('Your cart is empty.');
    }
    const orderProducts = userCart.products.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
    }));

    const newOrder = await Order.create({
        userId: _id,
        products: orderProducts,
        shippingAddress: shippingAddress,
        paymentIntent: paymentIntent,
        totalAmount: userCart.cartTotal,
        totalAfterDiscount: userCart.totalAfterDiscount || userCart.cartTotal,
        orderStatus: 'Pending',
    });
    for (let i = 0; i < orderProducts.length; i++) {
        const product = await Product.findById(orderProducts[i].productId);
        if (product) {
            product.quantity -= orderProducts[i].quantity;
            product.sold += orderProducts[i].quantity;
            await product.save();
        }
    }

    await Cart.findOneAndDelete({ userId: _id });

    res.status(201).json({ message: 'Order created successfully', order: newOrder });
});

exports.getOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const orders = await Order.find({ userId: _id })
        .populate('products.productId')
        .sort('-createdAt');

    res.status(200).json(orders);
});
exports.getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find()
        .populate('userId', 'firstName lastName email mobile')
        .populate('products.productId')
        .sort('-createdAt');
    res.status(200).json(orders);
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        res.status(400);
        throw new Error('Order status is required');
    }

    const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { orderStatus: status },
        { new: true, runValidators: true }
    );

    if (!updatedOrder) {
        res.status(404);
        throw new Error('Order not found');
    }
    res.status(200).json({ message: 'Order status updated', order: updatedOrder });
});

exports.cancelOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = req.user;

    const order = await Order.findById(id);

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    if (order.userId.toString() !== user._id.toString() && user.role !== 'admin') {
        res.status(403);
        throw new Error('You are not authorized to cancel this order.');
    }
    if (order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered') {
        res.status(400);
        throw new Error('Cannot cancel a shipped or delivered order.');
    }

    order.orderStatus = 'Cancelled';
    await order.save();

    for (let i = 0; i < order.products.length; i++) {
        const product = await Product.findById(order.products[i].productId);
        if (product) {
            product.quantity += order.products[i].quantity;
            product.sold -= order.products[i].quantity;
            await product.save();
        }
    }

    res.status(200).json({ message: 'Order cancelled successfully', order });
});