const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../service/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "OpenDine",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
});

const upload = multer({ storage });

module.exports = upload;