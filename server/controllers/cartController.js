const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');

exports.addToCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { productId, quantity, price } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }
    if (product.quantity < quantity) {
        res.status(400);
        throw new Error('Not enough product in stock');
    }

    let userCart = await Cart.findOne({ userId: _id });

    if (!userCart) {
        userCart = await Cart.create({
            userId: _id,
            products: [{ productId, quantity, price: product.price }],
            cartTotal: product.price * quantity
        });
    } else {
        let productExists = false;
        userCart.products.forEach(item => {
            if (item.productId.toString() === productId.toString()) {
                item.quantity += quantity;
                productExists = true;
            }
        });

        if (!productExists) {
            userCart.products.push({ productId, quantity, price: product.price });
        }

        userCart.cartTotal = userCart.products.reduce((total, item) => total + (item.quantity * item.price), 0);
        await userCart.save();
    }

    res.status(200).json({ message: 'Product added to cart', cart: userCart });
});

exports.getCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const cart = await Cart.findOne({ userId: _id }).populate('products.productId');
    if (!cart) {
        res.status(404);
        throw new Error('Cart not found for this user');
    }
    res.status(200).json(cart);
});

exports.updateProductQuantityInCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId: _id });
    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }

    let productFound = false;
    cart.products.forEach(item => {
        if (item.productId.toString() === productId.toString()) {
            item.quantity = quantity;
            productFound = true;
        }
    });

    if (!productFound) {
        res.status(404);
        throw new Error('Product not found in cart');
    }
    cart.cartTotal = cart.products.reduce((total, item) => total + (item.quantity * item.price), 0);
    await cart.save();

    res.status(200).json({ message: 'Cart updated successfully', cart });
});
exports.removeProductFromCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: _id });
    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }

    cart.products = cart.products.filter(item => item.productId.toString() !== productId.toString());
    cart.cartTotal = cart.products.reduce((total, item) => total + (item.quantity * item.price), 0);
    await cart.save();

    res.status(200).json({ message: 'Product removed from cart', cart });
});
exports.clearCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const cart = await Cart.findOneAndUpdate({ userId: _id }, { products: [], cartTotal: 0, totalAfterDiscount: 0 }, { new: true });
    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }
    res.status(200).json({ message: 'Cart cleared successfully', cart });
});
exports.applyCoupon = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { couponCode } = req.body;
    const cart = await Cart.findOne({ userId: _id });
    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }
    cart.totalAfterDiscount = cart.cartTotal * 0.9;
    await cart.save();

    res.status(200).json({ message: 'Coupon applied successfully', cart });
});