const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

const JWT_SECRET = process.env.JWT_SECRET;
exports.verifyToken = asyncHandler(async (req, res, next) => {
    let token;
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
        res.status(401);
        throw new Error('Not authorized: No token provided or invalid format.');
    }
    token = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded._id).select('-password');
        if (!user) {
            res.status(401);
            throw new Error('Not authorized: User associated with this token not found.');
        }
        if (user.isBlocked) {
            res.status(403);
            throw new Error('Access denied: Your account has been blocked. Please contact support.');
        }
        req.user = user;
        next();

    } catch (error) {
        res.status(401);

        if (error.name === 'TokenExpiredError') {
            throw new Error('Not authorized: Token has expired. Please log in again.');
        } else if (error.name === 'JsonWebTokenError') {
            throw new Error('Not authorized: Invalid token. Please log in again.');
        } else {
            throw new Error('Not authorized: Token validation failed. ' + error.message);
        }
    }
});

exports.isAdmin = (req, res, next) => {
    if (!req.user) {
        res.status(401);
        throw new Error('Authentication required for this action.');
    }
    if (req.user.role === 'admin') {
        next();
    } else {
        res.status(403);
        throw new Error('Access denied: You are not authorized as an administrator.');
    }
};

exports.isUser = (req, res, next) => {
    if (!req.user) {
        res.status(401);
        throw new Error('Authentication required for this action.');
    }
    if (req.user.role === 'user') {
        next();
    } else {
        res.status(403);
        throw new Error('Access denied: You are not authorized as a regular user.');
    }
};