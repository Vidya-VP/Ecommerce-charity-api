const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

function uploadFile(fieldName) {
    return (req, res, next) => {
        upload.single(fieldName)(req, res, (err) => {
            if (err) {
                return res.status(400).json({ message: err.message });
            }

            if (!req.file) {
                return res.status(400).json({
                    status: "Failed",
                    message: `Missing required field: ${fieldName}`,
                    hint: `Make sure you're sending the file with field name ${fieldName}`,
                });
            }

            const imgTypes = /^image\/(jpg|jpeg|png)$/;
            if (!imgTypes.test(req.file.mimetype)) {
                return res.status(400).json({
                    status: "Failed",
                    message: "Only .png, .jpg and .jpeg formats are allowed!"
                });
            }

            if (req.file.size > 1 * 1024 * 1024) {
                return res.status(400).json({
                    status: "Failed",
                    message: "Image file should not exceed 1MB",
                });
            }

            next();
        });
    };
}

module.exports = { uploadFile };