const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

var userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    address: [
        {
            addressName: String,   // Tên địa chỉ (Home, Work)
            fullName: String,      // Tên người nhận
            phoneNumber: String,   // Số điện thoại người nhận
            street: String,        // Số nhà, tên đường
            ward: {                 // Phường/Xã
                code: String,
                name: String
            },
            district: {             // Quận/Huyện
                code: String,
                name: String
            },
            province: {             // Tỉnh/Thành phố
                code: String,
                name: String
            },
            country: { type: String, default: "Vietnam" }, // Mặc định Vietnam
            isDefault: { type: Boolean, default: false }
        }
    ],
    wishlist: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
    ],
    savedCards: [
        {
            cardType: String,
            bankName: String,
            last4Digits: String,
            cardholderName: String,
            expiryDate: String,
            paymentToken: String,
            isDefault: { type: Boolean, default: false }
        }
    ],
    isBlocked: { type: Boolean, default: false },
    refreshToken: { type: String },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    lastLoginAt: { type: Date, default: Date.now },
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createPasswordResetToken = async function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
    return resetToken;
};

module.exports = mongoose.model('User', userSchema);