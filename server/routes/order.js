const express = require('express');
const {
    createOrder,
    getUserOrders,
    getAllOrders,
    getSingleOrder,
    updateOrderStatus,
} = require('../controllers/orderController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createOrder);
router.get('/my-orders', authMiddleware, getUserOrders);
router.get('/:id', authMiddleware, getSingleOrder);

router.get('/', authMiddleware, isAdmin, getAllOrders);
router.put('/update-status/:id', authMiddleware, isAdmin, updateOrderStatus);

module.exports = router;