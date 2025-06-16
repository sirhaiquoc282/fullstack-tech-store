const User = require('../models/User');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token && req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token provided');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token decoded:", decoded);
        const user = await User.findById(decoded.id).select('-password'); // Exclude password
        console.log("🔎 User from DB:", user);
        if (!user) {
            res.status(401);
            throw new Error('Not authorized, user not found');
        }
        if (user.isBlocked) {
            res.status(403);
            throw new Error('User is blocked. Please contact support.');
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401);
        throw new Error('Not authorized, token expired or invalid');
    }
});

const isAdmin = asyncHandler(async (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Access denied. Admin role required.');
    } else {
        next();
    }
});

module.exports = { authMiddleware, isAdmin };