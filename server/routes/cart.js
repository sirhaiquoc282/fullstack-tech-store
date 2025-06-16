const express = require('express');
const {
    addProductToCart,
    getUserCart,
    updateProductQuantityInCart,
    clearCart,
    removeProductFromCart,
} = require('../controllers/cartController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, addProductToCart);
router.get('/', authMiddleware, getUserCart);
router.put('/', authMiddleware, updateProductQuantityInCart);
router.delete('/', authMiddleware, clearCart);
router.delete('/:productId', authMiddleware, removeProductFromCart);

module.exports = router;