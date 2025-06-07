const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, lowercase: true, unique: true },
  brand: { type: String, required: true },
  model: String,
  price: { type: Number, required: true },
  description: String,
  images: [String],
  category: { type: String, enum: ['Laptop', 'Camera'], required: true },

  // ========== Các trường chung ==========
  stock: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },
  warranty: String,

  // ========== Thông tin Laptop ==========
  cpu: String,
  ram: String,
  storage: String,           // ổ cứng
  screen: String,            // kích thước + tần số quét
  gpu: String,
  os: String,                // hệ điều hành
  battery: String,
  weight: String,
  color: String,
  ports: [String],
  keyboard: String,          // bàn phím
  webcam: String,
  connectivity: [String],    // wifi, bluetooth,...
  material: String,          // chất liệu vỏ

  // ========== Thông tin Camera ==========
  resolution: String,         // độ phân giải (MP)
  sensor: String,             // cảm biến
  lens: String,               // ống kính
  isoRange: String,
  shutterSpeed: String,
  videoResolution: String,
  screenSize: String,
  batteryLife: String,
  dimensions: String,

  // ========== Đánh giá ==========
  ratings: [
    {
      star: { type: Number, min: 1, max: 5 },
      comment: String,
      postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
