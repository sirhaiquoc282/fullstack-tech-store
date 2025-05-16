const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt');
const jwt = require('jsonwebtoken')

const register = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new Error('User already exists');
    }
    const newUser = await User.create(req.body);
    return res.status(200).json({
        success: newUser ? true : false,
        message: newUser ? 'User created successfully' : 'User creation failed',
    })
})



const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }
    const userExists = await User.findOne({ email });
    if (!userExists) {
        throw new Error('User does not exist');
    }
    const isPasswordMatched = await userExists.isPasswordMatched(password);
    if (!isPasswordMatched) {
        throw new Error('Invalid credentials');
    }
    const accessToken = generateAccessToken(userExists._id, userExists.role);
    const refreshToken = generateRefreshToken(userExists._id);
    await User.findByIdAndUpdate(userExists._id, { refreshToken }, { new: true });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    const { password: _, ...userData } = userExists.toObject();
    return res.status(200).json({
        success: true,
        accessToken,
        user: userData
    })
});



const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const user = await User.findById(_id).select('-password');

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    return res.status(200).json({
        success: true,
        result: user
    });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        const cookie = req.cookies;
        if (!cookie || !cookie.refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'No refresh token found'
            })
        }
        const refreshToken = cookie.refreshToken;
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const user = await User.findOne({
            _id: decoded._id,
            refreshToken
        });

        if (!user) {
            return res.status(403).json({ success: false, message: 'Refresh token invalid' });
        }
        const accessToken = generateAccessToken(user._id, user.role)
        return res.status(200).json({
            success: true,
            accessToken
        });
    } catch (err) {
        return res.status(403).json({ success: false, message: 'Token expired or invalid' });
    }
});

module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken
}