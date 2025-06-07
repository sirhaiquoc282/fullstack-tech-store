const Product = require('../models/product');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

// [POST] Thêm sản phẩm mới (admin)
const createProduct = asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name) throw new Error("Tên sản phẩm là bắt buộc");
    req.body.slug = slugify(name);
    const newProduct = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product: newProduct
    });
});

// [GET] Lấy danh sách sản phẩm
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products
    });
});

// [GET] Lấy chi tiết 1 sản phẩm theo id
const getProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) throw new Error("Không tìm thấy sản phẩm");
    res.status(200).json({
        success: true,
        product
    });
});

// [PUT] Cập nhật sản phẩm
const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (req.body.name) req.body.slug = slugify(req.body.name);
    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({
        success: true,
        product: updated
    });
});

// [DELETE] Xoá sản phẩm
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    res.status(200).json({
        success: true,
        message: "Đã xoá sản phẩm",
        product: deleted
    });
});

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
};
