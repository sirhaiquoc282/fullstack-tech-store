const express = require('express');
const {
    getAllProducts,
    getProductById,
    addToWishlist,
    addProductReview,
    updateProductReview,
    deleteProductReview,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);

router.put('/wishlist', authMiddleware, addToWishlist);


router.post('/:productId/reviews', authMiddleware, addProductReview);
router.put('/:productId/reviews/:reviewId', authMiddleware, updateProductReview);
router.delete('/:productId/reviews/:reviewId', authMiddleware, deleteProductReview);

router.post('/', authMiddleware, isAdmin, createProduct);
router.put('/:id', authMiddleware, isAdmin, updateProduct);
router.delete('/:id', authMiddleware, isAdmin, deleteProduct);

module.exports = router;