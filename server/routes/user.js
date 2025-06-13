const router = require('express').Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const { USER_ROLE, ADMIN_ROLE } = require('../middlewares/roles');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/refresh-token', authController.handleRefreshToken);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPasswordToken);
router.put('/reset-password/:token', authController.resetPassword);

router.use(verifyToken);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateUser);
router.put('/change-password', authController.changePassword);
router.get('/wishlist', userController.getUserWishlist);
router.put('/save-address', userController.saveAddress);

router.use(isAdmin);

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.delete('/:id', userController.deleteUser);
router.put('/block/:id', userController.blockUser);
router.put('/unblock/:id', userController.unblockUser);

module.exports = router;