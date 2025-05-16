const jwt = require('jsonwebtoken');

const generateAccessToken = (_id, role) => {
    return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
        expiresIn: '5s',
    });
}

const generateRefreshToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
}
module.exports = {
    generateAccessToken,
    generateRefreshToken
}

