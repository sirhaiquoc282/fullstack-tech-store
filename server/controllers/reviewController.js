const Review = require('../models/Review');
const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');

exports.createReview = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { productId, star, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error('Product not found.');
    }

    const existingReview = await Review.findOne({ productId, userId: _id });
    if (existingReview) {
        res.status(409);
        throw new Error('You have already reviewed this product. Please update your existing review.');
    }

    const newReview = await Review.create({
        productId,
        userId: _id,
        star,
        comment,
    });

    const productReviews = await Review.find({ productId: productId });
    const totalStars = productReviews.reduce((sum, review) => sum + review.star, 0);
    product.totalRating = totalStars / productReviews.length;
    await product.save();

    res.status(201).json({ message: 'Review created successfully!', review: newReview });
});

exports.getReviewsForProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const reviews = await Review.find({ productId }).populate('userId', 'firstName lastName'); // Lấy tên người đánh giá
    res.status(200).json(reviews);
});

exports.updateReview = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { _id } = req.user;
    const { star, comment } = req.body;

    const review = await Review.findOne({ productId: id, userId: _id });

    if (!review) {
        res.status(404);
        throw new Error('Review not found or you are not authorized to update it.');
    }

    review.star = star || review.star;
    review.comment = comment || review.comment;
    await review.save();

    const productReviews = await Review.find({ productId: review.productId });
    const totalStars = productReviews.reduce((sum, r) => sum + r.star, 0);
    const product = await Product.findById(review.productId);
    product.totalRating = totalStars / productReviews.length;
    await product.save();

    res.status(200).json({ message: 'Review updated successfully!', review });
});

exports.deleteReview = asyncHandler(async (req, res) => {
    const { id } = req.params; // Review ID
    const { _id, role } = req.user;

    const review = await Review.findById(id);

    if (!review) {
        res.status(404);
        throw new Error('Review not found.');
    }

    if (review.userId.toString() !== _id.toString() && role !== 'admin') {
        res.status(403);
        throw new Error('You are not authorized to delete this review.');
    }

    await Review.findByIdAndDelete(id);

    const productReviews = await Review.find({ productId: review.productId });
    const totalStars = productReviews.reduce((sum, r) => sum + r.star, 0);
    const product = await Product.findById(review.productId);
    product.totalRating = productReviews.length > 0 ? totalStars / productReviews.length : 0;
    await product.save();

    res.status(200).json({ message: 'Review deleted successfully!' });
});