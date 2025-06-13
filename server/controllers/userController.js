const User = require('../models/User');
const asyncHandler = require('express-async-handler');

exports.getProfile = asyncHandler(async (req, res) => {
    const { _id } = req.user;

    const user = await User.findById(_id).select('-password');
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    res.status(200).json(user);
});

exports.updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { firstName, lastName, email, mobile, address } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
            firstName,
            lastName,
            email,
            mobile,
            address,
        },
        { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
        res.status(404);
        throw new Error('User not found');
    }
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
});

exports.getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password');
    res.status(200).json(users);
});

exports.getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    res.status(200).json(user);
});

exports.deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
        res.status(404);
        throw new Error('User not found');
    }
    res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
});

exports.blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    res.status(200).json({ message: 'User blocked', user });
});

exports.unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    res.status(200).json({ message: 'User unblocked', user });
});

exports.getUserWishlist = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const user = await User.findById(id).populate('wishlist');
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    res.status(200).json(user.wishlist);
});
exports.saveAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { address } = req.body;

    if (!Array.isArray(address) || address.some(addr => !addr.street || !addr.city || !addr.zipCode)) {
        res.status(400);
        throw new Error('Invalid address format. Each address must have street, city, and zipCode.');
    }

    const updatedUser = await User.findByIdAndUpdate(
        _id,
        { address: address },
        { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
        res.status(404);
        throw new Error('User not found');
    }
    res.status(200).json({ message: 'Address updated successfully', user: updatedUser });
});