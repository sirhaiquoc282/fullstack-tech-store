const Product = require('../models/Product');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const slugify = require('slugify');
const mongoose = require('mongoose');
const { cloudinaryUploadImg, cloudinaryDeleteImg } = require('../config/cloudinary');
const fs = require('fs');
const validateMongoDbId = require('../utils/validateMongodbId')

const formatProductForResponse = (productDoc) => {
    if (!productDoc) return null;

    const obj = productDoc.toObject({ getters: true, virtuals: true });

    let formattedCategory = obj.category;
    if (obj.category && typeof obj.category === 'object' && obj.category._id) {
        formattedCategory = {
            id: obj.category._id.toString(),
            title: obj.category.title
        };
    }

    const formattedProduct = {
        id: obj._id.toString(),
        title: obj.title,
        description: obj.description,
        category: formattedCategory,
        price: obj.price,
        discountPercentage: obj.discountPercentage,
        rating: obj.rating,
        stock: obj.stock,
        tags: obj.tags || [],
        brand: obj.brand,
        sku: obj.sku,
        weight: obj.weight,
        dimensions: obj.dimensions ? {
            width: obj.dimensions.width,
            height: obj.dimensions.height,
            depth: obj.dimensions.depth,
        } : undefined,
        warrantyInformation: obj.warrantyInformation,
        shippingInformation: obj.shippingInformation,
        availabilityStatus: obj.availabilityStatus,
        reviews: obj.reviews ? obj.reviews.map(review => ({
            rating: review.rating,
            comment: review.comment,
            date: review.date ? new Date(review.date).toISOString() : undefined, // Đảm bảo date là Date object trước khi gọi toISOString
            reviewerName: review.reviewerName,
            reviewerEmail: review.reviewerEmail
        })) : [],
        returnPolicy: obj.returnPolicy,
        minimumOrderQuantity: obj.minimumOrderQuantity,
        meta: obj.meta ? {
            createdAt: obj.meta.createdAt ? new Date(obj.meta.createdAt).toISOString() : undefined,
            updatedAt: obj.meta.updatedAt ? new Date(obj.meta.updatedAt).toISOString() : undefined,
            barcode: obj.meta.barcode,
            qrCode: obj.meta.qrCode
        } : undefined,
        thumbnail: obj.thumbnail,
        images: obj.images || []
    };
    Object.keys(formattedProduct).forEach(key => formattedProduct[key] === undefined && delete formattedProduct[key]);

    return formattedProduct;
};


const getAllProducts = asyncHandler(async (req, res) => {
    try {
        let findQuery = {};
        const queryConditions = {};
        if (req.query.q) {
            const keyword = req.query.q;
            const orConditions = [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
                { brand: { $regex: keyword, $options: 'i' } },
                { tags: { $regex: keyword, $options: 'i' } }
            ];
            const matchingCategories = await Category.find({
                $or: [
                    { title: { $regex: keyword, $options: 'i' } },
                    { slug: { $regex: keyword, $options: 'i' } }
                ]
            }).select('_id');

            if (matchingCategories.length > 0) {
                const categoryIds = matchingCategories.map(cat => cat._id);
                orConditions.push({ category: { $in: categoryIds } });
            }

            queryConditions.$or = orConditions;
        }

        if (req.query.category) {
            const categoryId = req.query.category;
            if (!mongoose.Types.ObjectId.isValid(categoryId)) {
                res.status(400);
                throw new Error("Invalid Category ID format provided in 'category' query parameter.");
            }

            const specificCategory = await Category.findById(categoryId).select('_id');

            if (specificCategory) {
                if (queryConditions.$or) {
                    queryConditions.$and = queryConditions.$and || [];
                    queryConditions.$and.push({ category: specificCategory._id });
                } else {
                    queryConditions.category = specificCategory._id;
                }
            } else {
                res.json({
                    products: [],
                    total: 0,
                    page: page,
                    limit: limit
                });
                return;
            }
        }

        if (req.query.brand) {
            queryConditions.brand = { $regex: req.query.brand, $options: 'i' };
        }

        if (req.query.minPrice || req.query.maxPrice) {
            const priceFilter = {};
            if (req.query.minPrice) priceFilter.$gte = parseFloat(req.query.minPrice);
            if (req.query.maxPrice) priceFilter.$lte = parseFloat(req.query.maxPrice);
            queryConditions.price = priceFilter;
        }

        findQuery = queryConditions;

        let query = Product.find(findQuery);

        query = query.populate('category', 'title slug');
        if (req.query.sortBy) {
            let sortOrder = req.query.order === 'desc' ? '-' : '';
            const sortByField = req.query.sortBy;
            query = query.sort(`${sortOrder}${sortByField}`);
        } else {
            query = query.sort('-createdAt');
        }

        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 30;
        const skip = (page - 1) * limit;

        const totalDocuments = await Product.countDocuments(findQuery);

        if (skip >= totalDocuments && page > 1) {
            res.status(404);
            throw new Error("This page does not exist or has no products.");
        }

        query = query.skip(skip).limit(limit);

        const products = await query;

        res.json({
            products: products.map(formatProductForResponse),
            total: totalDocuments,
            page: page,
            limit: limit
        });

    } catch (error) {
        console.error("Error getting all products:", error);
        if (error.name === 'CastError' && error.path === '_id') {
            res.status(400);
            throw new Error("Invalid ID format encountered.");
        }
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw new Error("Failed to fetch products: " + error.message);
    }
});


const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const product = await Product.findById(id).populate('category', 'title slug');
        if (!product) {
            res.status(404);
            throw new Error("Product not found.");
        }
        res.json(formatProductForResponse(product));
    } catch (error) {
        console.error("Error getting product by ID:", error);
        res.status(500);
        throw new Error("Failed to fetch product: " + error.message);
    }
});

const addToWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { productId } = req.body;

    if (!productId) {
        res.status(400);
        throw new Error("Product ID is required.");
    }
    validateMongoDbId(productId);

    const user = await User.findById(_id);
    if (!user) {
        res.status(404);
        throw new Error("User not found.");
    }

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error("Product not found.");
    }

    const alreadyAdded = user.wishlist.includes(productId);

    if (alreadyAdded) {
        user.wishlist.pull(productId);
        await user.save();
        res.json({ message: "Product removed from wishlist", wishlist: user.wishlist.map(id => id.toString()) });
    } else {
        user.wishlist.push(productId);
        await user.save();
        res.json({ message: "Product added to wishlist", wishlist: user.wishlist.map(id => id.toString()) });
    }
});

const addProductReview = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { productId } = req.params;
    const { rating, comment } = req.body;

    if (rating === undefined || rating < 1 || rating > 5) {
        res.status(400);
        throw new Error("Rating must be a number between 1 and 5.");
    }
    validateMongoDbId(productId);

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error("Product not found.");
    }

    const reviewer = await User.findById(_id).select('firstName lastName email');
    if (!reviewer) {
        res.status(404);
        throw new Error("Reviewer user not found.");
    }

    const existingReviewIndex = product.reviews.findIndex(
        (review) => review.reviewerEmail === reviewer.email
    );

    if (existingReviewIndex > -1) {
        res.status(409);
        throw new Error("You have already reviewed this product. Please use the update review endpoint.");
    }

    const newReview = {
        rating,
        comment: comment || '',
        date: new Date(),
        reviewerName: `${reviewer.firstName} ${reviewer.lastName}`,
        reviewerEmail: reviewer.email,
    };

    product.reviews.push(newReview);
    await product.updateAverageRating();

    await product.save();
    res.status(201).json({
        message: "Review added successfully",
        product: formatProductForResponse(product)
    });
});

const updateProductReview = asyncHandler(async (req, res) => {
    const { productId, reviewId } = req.params;
    const { _id: userId, role } = req.user;
    const { rating, comment } = req.body;

    validateMongoDbId(productId);
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        res.status(400);
        throw new Error("Invalid review ID format.");
    }

    if (rating !== undefined && (rating < 1 || rating > 5)) {
        res.status(400);
        throw new Error("Rating must be between 1 and 5.");
    }

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error("Product not found.");
    }

    const reviewToUpdate = product.reviews.id(reviewId);
    if (!reviewToUpdate) {
        res.status(404);
        throw new Error("Review not found for this product.");
    }

    const reviewer = await User.findById(userId);
    if (!reviewer || (reviewToUpdate.reviewerEmail !== reviewer.email && role !== 'admin')) {
        res.status(403);
        throw new Error("You are not authorized to update this review.");
    }

    if (rating !== undefined) reviewToUpdate.rating = rating;
    if (comment !== undefined) reviewToUpdate.comment = comment;
    reviewToUpdate.date = new Date();

    await product.updateAverageRating();
    await product.save();

    res.json({ message: "Review updated successfully", product: formatProductForResponse(product) });
});


const deleteProductReview = asyncHandler(async (req, res) => {
    const { productId, reviewId } = req.params;
    const { _id: userId, role } = req.user;

    validateMongoDbId(productId);
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        res.status(400);
        throw new Error("Invalid review ID format.");
    }

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error("Product not found.");
    }

    const reviewToDelete = product.reviews.id(reviewId);
    if (!reviewToDelete) {
        res.status(404);
        throw new Error("Review not found for this product.");
    }

    const reviewer = await User.findById(userId);
    if (!reviewer || (reviewToDelete.reviewerEmail !== reviewer.email && role !== 'admin')) {
        res.status(403);
        throw new Error("You are not authorized to delete this review.");
    }

    product.reviews.pull(reviewId);
    await product.updateAverageRating();
    await product.save();

    res.json({ message: "Review deleted successfully", product: formatProductForResponse(product) });
});


const createProduct = asyncHandler(async (req, res) => {
    try {
        const requiredFields = ['title', 'price', 'category', 'brand', 'stock', 'sku', 'description'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                res.status(400);
                throw new Error(`Missing required product field: ${field}`);
            }
        }

        req.body.slug = slugify(req.body.title, { lower: true, strict: true });

        req.body.meta = req.body.meta || {};
        req.body.meta.createdAt = new Date();
        req.body.meta.updatedAt = new Date();

        if (req.body.category) {
            const category = await Category.findOne({ title: req.body.category });
            if (!category) {
                res.status(400);
                throw new Error("Invalid category title provided.");
            }
            req.body.category = category._id;
        }

        const newProduct = await Product.create(req.body);
        res.status(201).json({ message: "Product created successfully", product: formatProductForResponse(newProduct) });
    } catch (error) {
        console.error("Error creating product:", error);
        if (error.code === 11000) {
            res.status(409);
            throw new Error("Product with this title, SKU, or slug already exists.");
        }
        res.status(500);
        throw new Error("Failed to create product: " + error.message);
    }
});


const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title, { lower: true, strict: true });
        }
        req.body.meta = req.body.meta || {};
        req.body.meta.updatedAt = new Date();


        if (req.body.category) {
            const category = await Category.findOne({ title: req.body.category });
            if (!category) {
                res.status(400);
                throw new Error("Invalid category title provided.");
            }
            req.body.category = category._id;
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedProduct) {
            res.status(404);
            throw new Error("Product not found.");
        }
        res.json({ message: "Product updated successfully", product: formatProductForResponse(updatedProduct) });
    } catch (error) {
        console.error("Error updating product:", error);
        if (error.code === 11000) {
            res.status(409);
            throw new Error("Another product with this title, SKU, or slug already exists.");
        }
        res.status(500);
        throw new Error("Failed to update product: " + error.message);
    }
});


const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            res.status(404);
            throw new Error("Product not found.");
        }
        if (deletedProduct.thumbnail) {
            const publicId = deletedProduct.thumbnail.split('/').pop().split('.')[0];
            await cloudinaryDeleteImg(publicId);
        }
        if (deletedProduct.images && deletedProduct.images.length > 0) {
            for (const imgUrl of deletedProduct.images) {
                const publicId = imgUrl.split('/').pop().split('.')[0];
                await cloudinaryDeleteImg(publicId);
            }
        }

        res.json({ message: "Product deleted successfully", deletedProduct: { id: deletedProduct._id.toString(), title: deletedProduct.title } });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500);
        throw new Error("Failed to delete product: " + error.message);
    }
});

const uploadImages = asyncHandler(async (req, res) => {
    try {
        const uploader = async (path) => await cloudinaryUploadImg(path, 'products');
        const urls = [];
        const files = req.files;

        if (!files || files.length === 0) {
            res.status(400);
            throw new Error("No images provided for upload.");
        }

        for (const file of files) {
            const { path } = file;
            const newpath = await uploader(path);
            urls.push(newpath);
            fs.unlinkSync(path);
        }
        res.json(urls);
    } catch (error) {
        console.error("Error uploading images:", error);
        res.status(500);
        throw new Error("Failed to upload images: " + error.message);
    }
});


module.exports = {
    getAllProducts,
    getProductById,
    addToWishlist,
    addProductReview,
    updateProductReview,
    deleteProductReview,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImages
};