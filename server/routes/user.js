const express = require('express');
const {
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    getAUser,
    deleteAUser,
    blockUser,
    unblockUser,
    getUserDashboardStats,
    getUserPaymentMethods,
    saveUserPaymentMethod,
    deleteUserPaymentMethod,
} = require('../controllers/userController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
router.get('/dashboard-stats', authMiddleware, getUserDashboardStats);
router.get('/payment-methods', authMiddleware, getUserPaymentMethods);
router.post('/payment-methods', authMiddleware, saveUserPaymentMethod);
router.put('/payment-methods/:cardId', authMiddleware, saveUserPaymentMethod);
router.delete('/payment-methods/:cardId', authMiddleware, deleteUserPaymentMethod);


router.get('/', authMiddleware, isAdmin, getAllUsers);
router.get('/:id', authMiddleware, isAdmin, getAUser);
router.delete('/:id', authMiddleware, isAdmin, deleteAUser);
router.put('/block/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock/:id', authMiddleware, isAdmin, unblockUser);


module.exports = router;