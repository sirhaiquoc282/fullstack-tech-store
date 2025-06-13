const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt');
const sendEmail = require('../utils/nodemailer');
const crypto = require('crypto');

exports.register = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, mobile, password } = req.body;

    if (!firstName || !lastName || !email || !mobile || !password) {
        res.status(400);
        throw new Error('Please enter all required fields.');
    }

    const findUser = await User.findOne({ email: email });
    if (findUser) {
        res.status(409);
        throw new Error('User already exists with this email.');
    }

    const newUser = await User.create({ firstName, lastName, email, mobile, password });
    res.status(201).json({
        message: 'User registered successfully!',
        user: {
            id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            mobile: newUser.mobile,
            role: newUser.role
        }
    });
});
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Email and password are required.');
    }

    const user = await User.findOne({ email: email });
    if (!user) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    if (user.isBlocked) {
        res.status(403);
        throw new Error('Your account has been blocked.');
    }

    const isMatch = await user.isPasswordMatched(password);
    if (!isMatch) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    const refreshToken = generateRefreshToken(user._id);
    await User.findByIdAndUpdate(user._id, { refreshToken: refreshToken }, { new: true });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
    });

    const accessToken = generateAccessToken(user._id, user.email, user.role);

    res.status(200).json({
        message: 'Login successful!',
        accessToken,
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        }
    });
});

exports.handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie.refreshToken) {
        res.status(401);
        throw new Error('No Refresh Token in Cookies');
    }

    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });

    if (!user) {
        res.status(403);
        throw new Error('Invalid Refresh Token or User not found');
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            res.status(403);
            throw new Error('There is something wrong with refresh token');
        }
        const accessToken = generateAccessToken(user._id, user.email, user.role);
        res.json({ accessToken });
    });
});

exports.logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie.refreshToken) {
        res.status(204);
        return;
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });

    if (!user) {
        res.clearCookie('refreshToken', { httpOnly: true });
        res.status(204);
        return;
    }

    await User.findByIdAndUpdate(user._id, { refreshToken: "" }, { new: true });
    res.clearCookie('refreshToken', { httpOnly: true });
    res.status(200).json({ message: 'Logout successful' });
});
exports.forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error('User not found with this email.');
    }

    const resetToken = await user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get('host')}/api/user/reset-password/${resetToken}`;
    const message = `Bạn nhận được email này vì bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu cho tài khoản của bạn.
        Vui lòng nhấp vào liên kết sau hoặc dán vào trình duyệt của bạn để hoàn tất quá trình:
        ${resetURL}
        Liên kết này sẽ hết hạn sau 15 phút.
        Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này và mật khẩu của bạn sẽ vẫn không thay đổi.
    `;

    const html = `
        <p>Bạn nhận được email này vì bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
        <p>Vui lòng nhấp vào liên kết sau để đặt lại mật khẩu của bạn:</p>
        <a href="${resetURL}">Đặt lại mật khẩu</a>
        <p>Liên kết này sẽ hết hạn sau 15 phút.</p>
        <p>Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này và mật khẩu của bạn sẽ vẫn không thay đổi.</p>
    `;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Đặt lại mật khẩu cho Ecommerce App',
            message: message,
            html: html,
        });
        res.json({ message: 'Password reset link sent to your email.' });
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        res.status(500);
        throw new Error('Error sending email. Please try again later.');
    }
});

exports.resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid or expired password reset token.');
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = Date.now();
    await user.save();

    res.status(200).json({ message: 'Password reset successful!' });
});


exports.changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error('User not found.');
    }

    const isPasswordCorrect = await user.isPasswordMatched(oldPassword);
    if (!isPasswordCorrect) {
        res.status(400);
        throw new Error('Old password is incorrect.');
    }

    user.password = newPassword;
    user.passwordChangedAt = Date.now();
    await user.save();

    res.status(200).json({ message: 'Password changed successfully.' });
});