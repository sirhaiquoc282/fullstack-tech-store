const express = require('express');
const {
    registerUser,
    loginUser,
    handleRefreshToken,
    logout,
    forgotPasswordToken,
    resetPassword,
} = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/refresh', handleRefreshToken);
router.post('/logout', logout);
router.post('/forgot-password-token', forgotPasswordToken);
router.put('/reset-password/:token', resetPassword);

module.exports = router;