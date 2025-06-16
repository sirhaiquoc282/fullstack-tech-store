const express = require('express');
const {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getAllCategories,
    getCategoryList,
} = require('../controllers/categoryController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, isAdmin, createCategory);
router.put('/:id', authMiddleware, isAdmin, updateCategory);
router.delete('/:id', authMiddleware, isAdmin, deleteCategory);

router.get('/', getAllCategories);
router.get('/list', getCategoryList);
router.get('/:id', getCategory);

module.exports = router;