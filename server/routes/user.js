const express = require('express');
const {
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    getAUser,
    deleteAUser,
    blockUser,
    unblockUser,
} = require('../controllers/userController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);

router.get('/', authMiddleware, isAdmin, getAllUsers);
router.get('/:id', authMiddleware, isAdmin, getAUser);
router.delete('/:id', authMiddleware, isAdmin, deleteAUser);
router.put('/block/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock/:id', authMiddleware, isAdmin, unblockUser);


module.exports = router;