const router = require('express').Router();
const cartController = require('../controllers/cartController');
const { verifyToken } = require('../middlewares/authMiddleware');
router.use(verifyToken);

router.post('/', cartController.addToCart);
router.get('/', cartController.getCart);
router.put('/update-quantity', cartController.updateProductQuantityInCart);
router.delete('/:productId', cartController.removeProductFromCart);
router.delete('/', cartController.clearCart);
router.post('/apply-coupon', cartController.applyCoupon);

module.exports = router;