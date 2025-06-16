const Category = require('../models/Category');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');
const slugify = require('slugify');

const createCategory = asyncHandler(async (req, res) => {
    try {
        if (!req.body.title) {
            res.status(400);
            throw new Error("Category title is required.");
        }
        req.body.slug = slugify(req.body.title, { lower: true, strict: true });
        const newCategory = await Category.create(req.body);
        res.status(201).json({ message: "Category created successfully", category: newCategory });
    } catch (error) {
        if (error.code === 11000) {
            res.status(409);
            throw new Error("Category with this title already exists.");
        }
        res.status(500);
        throw new Error("Failed to create category: " + error.message);
    }
});

const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title, { lower: true, strict: true });
        }
        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedCategory) {
            res.status(404);
            throw new Error("Category not found.");
        }
        res.json({ message: "Category updated successfully", category: updatedCategory });
    } catch (error) {
        if (error.code === 11000) {
            res.status(409);
            throw new Error("Another category with this title already exists.");
        }
        res.status(500);
        throw new Error("Failed to update category: " + error.message);
    }
});

const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            res.status(404);
            throw new Error("Category not found.");
        }
        res.json({ message: "Category deleted successfully", deletedCategory });
    } catch (error) {
        res.status(500);
        throw new Error("Failed to delete category: " + error.message);
    }
});

const getCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const category = await Category.findById(id);
        if (!category) {
            res.status(404);
            throw new Error("Category not found.");
        }
        res.json(category);
    } catch (error) {
        res.status(500);
        throw new Error("Failed to fetch category: " + error.message);
    }
});

const getAllCategories = asyncHandler(async (req, res) => {
    try {
        const categories = await Category.find();
        const formattedCategories = categories.map(cat => ({
            id: cat._id,
            title: cat.title,
            slug: cat.slug,
            url: `${req.protocol}://${req.get('host')}/api/products?category=${cat._id}`
        }));
        res.json(formattedCategories);
    } catch (error) {
        res.status(500);
        throw new Error("Failed to fetch categories: " + error.message);
    }
});

const getCategoryList = asyncHandler(async (req, res) => {
    try {
        const categories = await Category.find().select('slug title');
        const categorySlugs = categories.map(cat => cat.slug);
        res.json(categorySlugs);
    } catch (error) {
        res.status(500);
        throw new Error("Failed to fetch category list: " + error.message);
    }
});

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getAllCategories,
    getCategoryList,
};