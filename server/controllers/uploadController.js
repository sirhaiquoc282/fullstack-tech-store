const { cloudinaryUploadImg, cloudinaryDeleteImg } = require('../config/cloudinary');
const asyncHandler = require('express-async-handler');
const fs = require('fs');

const uploadImages = asyncHandler(async (req, res) => {
    try {
        const uploader = async (path) => await cloudinaryUploadImg(path);
        const urls = [];

        if (!req.files || req.files.length === 0) {
            res.status(400);
            throw new Error("No files uploaded.");
        }

        for (const file of req.files) {
            const { path } = file;
            const newpathData = await uploader(path);
            urls.push(newpathData.url);
            fs.unlinkSync(path);
        }
        res.json(urls);
    } catch (error) {
        console.error("Error uploading images:", error);
        res.status(500);
        throw new Error("Failed to upload images: " + error.message);
    }
});

const deleteImage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const result = await cloudinaryDeleteImg(id);
        if (result.result === 'ok') {
            res.json({ message: "Image deleted successfully", public_id: id });
        } else {
            res.status(400);
            throw new Error("Image deletion failed or image not found.");
        }
    } catch (error) {
        console.error("Error deleting image:", error);
        res.status(500);
        throw new Error("Failed to delete image: " + error.message);
    }
});

module.exports = { uploadImages, deleteImage };