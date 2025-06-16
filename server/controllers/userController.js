const User = require('../models/User');
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
        const users = await User.find().select('-password -refreshToken'); // Exclude passwords and refresh tokens
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
});

module.exports = {
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    getAUser,
    deleteAUser,
    blockUser,
    unblockUser,
};