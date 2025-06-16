const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');

const addProductToCart = asyncHandler(async (req, res) => {
    const { _id: userId } = req.user;
    const { productId, quantity } = req.body;

    validateMongoDbId(productId);
    if (!quantity || quantity < 1) {
        res.status(400);
        throw new Error("Quantity must be at least 1.");
    }

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error("Product not found.");
    }
    if (product.stock < quantity) {
        res.status(400);
        throw new Error("Not enough stock for this quantity.");
    }

    let userCart = await Cart.findOne({ userId });

    if (!userCart) {
        userCart = await Cart.create({
            userId,
            products: [{ productId, quantity, price: product.price }],
            totalPrice: product.price * quantity,
        });
        await User.findByIdAndUpdate(userId, { cart: userCart._id });
    } else {
        const existingProductIndex = userCart.products.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (existingProductIndex > -1) {
            userCart.products[existingProductIndex].quantity += quantity;
            userCart.products[existingProductIndex].price = product.price;
        } else {
            userCart.products.push({ productId, quantity, price: product.price });
        }
        userCart.totalPrice = userCart.products.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        await userCart.save();
    }

    const populatedCart = await Cart.findById(userCart._id).populate('products.productId');

    res.json({ message: "Product added to cart successfully", cart: populatedCart });
});

const getUserCart = asyncHandler(async (req, res) => {
    const { _id: userId } = req.user;
    try {
        const userCart = await Cart.findOne({ userId }).populate('products.productId');
        if (!userCart) {
            return res.json({ products: [], totalPrice: 0 });
        }
        res.json(userCart);
    } catch (error) {
        res.status(500);
        throw new Error("Failed to fetch user cart: " + error.message);
    }
});

const updateProductQuantityInCart = asyncHandler(async (req, res) => {
    const { _id: userId } = req.user;
    const { productId, newQuantity } = req.body;

    validateMongoDbId(productId);
    if (newQuantity === undefined || newQuantity < 0) {
        res.status(400);
        throw new Error("New quantity must be 0 or greater.");
    }

    const userCart = await Cart.findOne({ userId });
    if (!userCart) {
        res.status(404);
        throw new Error("Cart not found for this user.");
    }

    const productIndex = userCart.products.findIndex(
        (item) => item.productId.toString() === productId
    );

    if (productIndex === -1) {
        res.status(404);
        throw new Error("Product not found in cart.");
    }

    if (newQuantity === 0) {
        userCart.products.splice(productIndex, 1);
    } else {
        const product = await Product.findById(productId);
        if (!product) {
            res.status(404);
            throw new Error("Product associated with cart item not found.");
        }
        if (product.stock < newQuantity) {
            res.status(400);
            throw new Error(`Not enough stock. Only ${product.stock} available.`);
        }
        userCart.products[productIndex].quantity = newQuantity;
        userCart.products[productIndex].price = product.price;
    }

    userCart.totalPrice = userCart.products.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    await userCart.save();

    const populatedCart = await Cart.findById(userCart._id).populate('products.productId');
    res.json({ message: "Cart updated successfully", cart: populatedCart });
});

const clearCart = asyncHandler(async (req, res) => {
    const { _id: userId } = req.user;
    try {
        const userCart = await Cart.findOneAndDelete({ userId });
        if (!userCart) {
            res.status(404);
            throw new Error("Cart not found for this user.");
        }
        await User.findByIdAndUpdate(userId, { $unset: { cart: 1 } });
        res.json({ message: "Cart cleared successfully" });
    } catch (error) {
        res.status(500);
        throw new Error("Failed to clear cart: " + error.message);
    }
});

const removeProductFromCart = asyncHandler(async (req, res) => {
    const { _id: userId } = req.user;
    const { productId } = req.params;

    validateMongoDbId(productId);

    const userCart = await Cart.findOne({ userId });
    if (!userCart) {
        res.status(404);
        throw new Error("Cart not found for this user.");
    }

    const initialProductCount = userCart.products.length;
    userCart.products = userCart.products.filter(item => item.productId.toString() !== productId);

    if (userCart.products.length === initialProductCount) {
        res.status(404);
        throw new Error("Product not found in cart.");
    }

    userCart.totalPrice = userCart.products.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    if (userCart.products.length === 0) {
        await Cart.findByIdAndDelete(userCart._id);
        await User.findByIdAndUpdate(userId, { $unset: { cart: 1 } });
        res.json({ message: "Product removed from cart. Cart is now empty." });
    } else {
        await userCart.save();
        const populatedCart = await Cart.findById(userCart._id).populate('products.productId');
        res.json({ message: "Product removed from cart successfully", cart: populatedCart });
    }
});


module.exports = {
    addProductToCart,
    getUserCart,
    updateProductQuantityInCart,
    clearCart,
    removeProductFromCart,
};