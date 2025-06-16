const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const { generateToken, generateRefreshToken } = require('../middlewares/jwt');
const validateMongoDbId = require('../utils/validateMongodbId');
const sendEmail = require('../utils/nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const registerUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });

    if (!findUser) {
        const newUser = await User.create(req.body);
        res.json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                mobile: newUser.mobile,
                role: newUser.role,
            }
        });
    } else {
        res.status(409);
        throw new Error("User already exists with this email.");
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });
    if (!findUser) {
        res.status(401);
        throw new Error("Invalid credentials");
    }

    if (await findUser.isPasswordMatched(password)) {
        // Generate tokens
        const accessToken = generateToken(findUser._id);
        const refreshToken = generateRefreshToken(findUser._id);

        findUser.refreshToken = refreshToken;
        await findUser.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === 'production',
        });

        res.json({
            message: "Login successful",
            user: {
                id: findUser._id,
                firstName: findUser.firstName,
                lastName: findUser.lastName,
                email: findUser.email,
                mobile: findUser.mobile,
                role: findUser.role,
                token: accessToken, // Access token
            }
        });
    } else {
        res.status(401);
        throw new Error("Invalid credentials");
    }
});

const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) {
        res.status(400);
        throw new Error("No Refresh Token in Cookies");
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.status(403);
        throw new Error("No user found with this refresh token or token expired");
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            res.status(403);
            throw new Error("There is something wrong with refresh token");
        }
        const accessToken = generateToken(user._id);
        res.json({ token: accessToken });
    });
});

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) {
        res.status(400);
        throw new Error("No Refresh Token in Cookies");
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (user) {
        user.refreshToken = "";
        await user.save();
    }
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
    });
    res.json({ message: "Logged out successfully" });
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error("User not found with this email");
    }
    const resetToken = await user.createPasswordResetToken();
    await user.save();

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const message = `<p>Click <a href="${resetURL}">here</a> to reset your password. This link is valid for 15 minutes.</p>`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Password Reset Request",
            html: message,
        });
        res.json({ message: "Password reset email sent successfully", token: resetToken }); // Return token for testing
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        res.status(500);
        throw new Error("Failed to send password reset email. Please try again later.");
    }
});

const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
        res.status(400);
        throw new Error("Token expired or invalid. Please try again.");
    }
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = Date.now();
    await user.save();
    res.json({ message: "Password reset successfully!" });
});


module.exports = {
    registerUser,
    loginUser,
    handleRefreshToken,
    logout,
    forgotPasswordToken,
    resetPassword,
};