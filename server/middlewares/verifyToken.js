const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const verifyAccessToken = asyncHandler(async (req, res, next) => {
    const authHeader = req?.headers?.authorization;
    if (authHeader?.startsWith('Bearer')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: 'Invalid access token'
            });
        }
    } else {
        return res.status(401).json({
            success: false,
            message: 'Require authentication'
        });
    }
});

a; ksdflkasdhf



module.exports = {
    verifyAccessToken
}