const router = require('express').Router();
const reviewController = require('../controllers/reviewController');
const { verifyToken } = require('../middlewares/authMiddleware');
router.use(verifyToken);
router.post('/', reviewController.createReview);
router.get('/:productId', reviewController.getReviewsForProduct);
router.put('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;