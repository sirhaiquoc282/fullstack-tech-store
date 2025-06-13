const router = require('express').Router();
const orderController = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.use(verifyToken);
router.post('/', orderController.createOrder);
router.get('/', orderController.getOrders);
router.put('/cancel/:id', orderController.cancelOrder);
router.use(isAdmin);
router.get('/all', orderController.getAllOrders);
router.put('/status/:id', orderController.updateOrderStatus);

module.exports = router;