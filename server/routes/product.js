const router = require('express').Router();
const productController = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);

router.use(verifyToken);
router.put('/wishlist', productController.addToWishlist);
router.put('/rating', productController.rating);

router.use(isAdmin);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;