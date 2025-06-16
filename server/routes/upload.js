const express = require('express');
const { uploadImages, deleteImage } = require('../controllers/uploadController');
const { uploadProductPhotos } = require('../middlewares/uploadImages');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, isAdmin, uploadProductPhotos, uploadImages);
router.delete('/:id', authMiddleware, isAdmin, deleteImage);

module.exports = router;