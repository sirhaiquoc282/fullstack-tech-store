const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

var userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, unique: true }, // Not required, but unique if provided
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }, // Reference to Cart model
    address: [
        {
            street: String,
            city: String,
            state: String,
            zip: String,
            country: String,
        }
    ],
    wishlist: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Product' } // References Product model
    ],
    isBlocked: { type: Boolean, default: false },
    refreshToken: { type: String },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
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
    this.passwordResetExpires = Date.now() + 15 * 60 * 1000; // Token valid for 15 minutes
    return resetToken;
};

module.exports = mongoose.model('User', userSchema);