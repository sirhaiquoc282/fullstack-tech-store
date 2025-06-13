const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: String, required: true },
    quantity: { type: Number, required: true },
    sold: { type: Number, default: 0 },
    images: [{ public_id: String, url: String }],
    color: [{ type: String }],
    tags: [{ type: String }],
    ratings: [
        {
            star: { type: Number, min: 1, max: 5 },
            comment: String,
            postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        }
    ],
    totalRating: { type: Number, default: 0 },
}, { timestamps: true });

productSchema.pre('save', function (next) {
    if (this.ratings && this.ratings.length > 0) {
        const totalStars = this.ratings.reduce((sum, rating) => sum + rating.star, 0);
        this.totalRating = totalStars / this.ratings.length;
    } else {
        this.totalRating = 0;
    }
    next();
});


module.exports = mongoose.model('Product', productSchema);