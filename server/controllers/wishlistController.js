const Product = require('../models/Product');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId')

const getWishList = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    if (!userId) {
        res.status(401);
        throw new Error("User ID not found in request. Authentication might be invalid.");
    }
    try {
        const userWithWishlist = await User.findById(userId)
            .populate('wishlist')
            .select('wishlist');
        if (!userWithWishlist) {
            res.status(404);
            throw new Error("User not found.");
        }
        res.status(200).json({
            success: true,
            message: "Wishlist fetched successfully.",
            products: userWithWishlist.wishlist,
            count: userWithWishlist.wishlist.length
        });

    } catch (error) {
        console.error(`Error fetching wishlist for user ${userId}:`, error.message);
        if (!res.headersSent) {
            res.status(500);
        }
        throw new Error("Failed to retrieve wishlist. Please try again later. " + error.message);
    }
});


const addProductToWishList = asyncHandler(async (req, res) => {
    const { _id: userId } = req.user;
    const { productId } = req.body;

    if (!productId) {
        res.status(400);
        throw new Error("Product ID is required.");
    }
    validateMongoDbId(productId);

    const user = await User.findById(userId);
    if (!user) {
        res.status(404);
        throw new Error("User not found.");
    }

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error("Product not found.");
    }

    const alreadyAdded = user.wishlist.includes(productId);

    if (alreadyAdded) {
        user.wishlist.pull(productId);
        await user.save();
        res.json({ message: "Product removed from wishlist", wishlist: user.wishlist.map(id => id.toString()) });
    } else {
        user.wishlist.push(productId);
        await user.save();
        res.json({ message: "Product added to wishlist", wishlist: user.wishlist.map(id => id.toString()) });
    }
});

const removeProductFromWishList = asyncHandler(async (req, res) => {
    const { _id: userId } = req.user;
    const { productId } = req.params;

    validateMongoDbId(productId);

    const user = await User.findById(userId);

    if (!user) {
        res.status(404);
        throw new Error("User not found.");
    }

    const initialProductCount = user.wishlist.length;
    user.wishlist = user.wishlist.filter(
        (item) => item.toString() !== productId
    );

    if (user.wishlist.length === initialProductCount) {
        res.status(404);
        throw new Error("Product not found in wishlist.");
    }

    await user.save();

    const populatedUser = await User.findById(userId).populate('wishlist');
    res.json({ message: "Product removed from wishlist successfully", wishlist: populatedUser.wishlist });
});

const clearWishList = asyncHandler(async (req, res) => {
    const { _id: userId } = req.user;

    try {
        const user = await User.findById(userId);

        if (!user) {
            res.status(404);
            throw new Error("User not found.");
        }

        user.wishlist = [];
        await user.save();

        res.json({ message: "Wishlist cleared successfully" });
    } catch (error) {
        res.status(500);
        throw new Error("Failed to clear wishlist: " + error.message);
    }
});

module.exports = {
    getWishList,
    addProductToWishList,
    removeProductFromWishList,
    clearWishList
};