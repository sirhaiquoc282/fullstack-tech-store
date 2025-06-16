const mongoose = require('mongoose');
const slugify = require('slugify');

const embeddedReviewSchema = new mongoose.Schema({
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
    date: { type: Date, default: Date.now },
    reviewerName: { type: String, required: true },
    reviewerEmail: { type: String, required: true },
}, { _id: true });
const metaSchema = new mongoose.Schema({
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    barcode: String,
    qrCode: String,
}, { _id: false });

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discountPercentage: {
        type: Number,
        default: 0,
    },
    rating: {
        type: Number,
        default: 0,
    },
    stock: {
        type: Number,
        required: true,
    },
    tags: [{
        type: String,
    }],
    brand: {
        type: String,
        required: true,
    },
    sku: {
        type: String,
        unique: true,
        required: true,
    },
    weight: {
        type: Number,
    },
    dimensions: {
        width: Number,
        height: Number,
        depth: Number,
    },
    warrantyInformation: {
        type: String,
    },
    shippingInformation: {
        type: String,
    },
    availabilityStatus: {
        type: String,
        enum: ['In Stock', 'Low Stock', 'Out of Stock'],
        default: 'In Stock',
    },
    reviews: [embeddedReviewSchema],
    returnPolicy: {
        type: String,
    },
    minimumOrderQuantity: {
        type: Number,
        default: 1,
    },
    meta: {
        type: metaSchema,
        default: () => ({}),
    },
    thumbnail: {
        type: String,
    },
    images: [{
        type: String,
    }],
}, {
    timestamps: true
});

productSchema.pre('save', function (next) {
    if (this.isModified('title') && this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    if (this.isNew) {
        this.meta.createdAt = new Date();
    }
    this.meta.updatedAt = new Date();
    next();
});

productSchema.methods.updateAverageRating = async function () {
    const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating = this.reviews.length > 0 ? parseFloat((totalRating / this.reviews.length).toFixed(2)) : 0;
    await this.save();
};

module.exports = mongoose.model('Product', productSchema);