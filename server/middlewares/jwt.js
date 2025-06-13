const jwt = require('jsonwebtoken');

const generateAccessToken = (_id, email, role) => {
    return jwt.sign({ _id, email, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const generateRefreshToken = (_id) => {
    return jwt.sign({ _id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '3d' });
};

module.exports = { generateAccessToken, generateRefreshToken };