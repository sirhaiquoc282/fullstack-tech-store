const express = require('express');
const {
    getWishList,
    addProductToWishList,
    removeProductFromWishList,
    clearWishList
} = require('../controllers/wishlistController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', authMiddleware, getWishList);
router.put('/', authMiddleware, addProductToWishList);
router.delete('/:productId', authMiddleware, removeProductFromWishList);
router.delete('/', authMiddleware, clearWishList);

module.exports = router;