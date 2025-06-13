const Category = require('../models/Category');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

exports.createCategory = asyncHandler(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const newCategory = await Category.create(req.body);
        res.status(201).json({ message: 'Category created successfully', category: newCategory });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

exports.getCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }
    res.status(200).json(category);
});

exports.getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find();
    res.status(200).json(categories);
});

exports.updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedCategory) {
            res.status(404);
            throw new Error('Category not found');
        }
        res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});
exports.deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
        res.status(404);
        throw new Error('Category not found');
    }
    res.status(200).json({ message: 'Category deleted successfully' });
});