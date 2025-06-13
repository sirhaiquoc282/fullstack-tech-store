const Product = require('../models/Product');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

exports.createProduct = asyncHandler(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

exports.getProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate('category').populate('ratings.postedBy', 'firstName lastName'); // Lấy thông tin category và người đánh giá
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }
    res.status(200).json(product);
});

exports.getAllProducts = asyncHandler(async (req, res) => {
    try {
        const queryObj = { ...req.query };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach(el => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        let query = Product.find(JSON.parse(queryStr));
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);

        const products = await query.populate('category');
        const totalProducts = await Product.countDocuments(JSON.parse(queryStr));

        res.status(200).json({
            total: totalProducts,
            page: page,
            limit: limit,
            products
        });
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

exports.updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedProduct) {
            res.status(404);
            throw new Error('Product not found');
        }
        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

exports.deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
        res.status(404);
        throw new Error('Product not found');
    }
    res.status(200).json({ message: 'Product deleted successfully' });
});

exports.addToWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { prodId } = req.body;

    const user = await User.findById(_id);
    const alreadyAdded = user.wishlist.includes(prodId);

    if (alreadyAdded) {
        await User.findByIdAndUpdate(_id, { $pull: { wishlist: prodId } }, { new: true });
        res.status(200).json({ message: 'Product removed from wishlist' });
    } else {
        await User.findByIdAndUpdate(_id, { $push: { wishlist: prodId } }, { new: true });
        res.status(200).json({ message: 'Product added to wishlist' });
    }
});
exports.rating = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, comment, prodId } = req.body;

    const product = await Product.findById(prodId);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    let alreadyRated = product.ratings.find(
        (rating) => rating.postedBy.toString() === _id.toString()
    );

    if (alreadyRated) {
        await Product.updateOne(
            { 'ratings._id': alreadyRated._id },
            {
                $set: {
                    'ratings.$.star': star,
                    'ratings.$.comment': comment,
                },
            },
            { new: true }
        );
    } else {
        await Product.findByIdAndUpdate(
            prodId,
            {
                $push: {
                    ratings: {
                        star,
                        comment,
                        postedBy: _id,
                    },
                },
            },
            { new: true }
        );
    }

    const updatedProduct = await Product.findById(prodId);
    await updatedProduct.save();

    res.status(200).json({ message: 'Product rated successfully!', product: updatedProduct });
});