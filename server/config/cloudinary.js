const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUploadImg = async (fileToUpload) => {
    try {
        const data = await cloudinary.uploader.upload(fileToUpload, {
            resource_type: "auto",
        });
        return {
            url: data.secure_url,
            asset_id: data.asset_id,
            public_id: data.public_id,
        };
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw new Error("Cloudinary upload failed.");
    }
};

const cloudinaryDeleteImg = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error("Cloudinary Delete Error:", error);
        throw new Error("Cloudinary deletion failed.");
    }
};

module.exports = { cloudinaryUploadImg, cloudinaryDeleteImg };