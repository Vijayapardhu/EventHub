const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, 'file-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('image');

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif|webp|svg/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// @route   POST api/upload
// @desc    Upload an image
// @access  Public (or Private if you want to restrict)
router.post('/', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(400).json({ msg: err });
        } else {
            if (req.file == undefined) {
                res.status(400).json({ msg: 'No file selected!' });
            } else {
                // Return the path relative to the server URL
                // Assuming server is serving 'uploads' folder statically
                const startSlash = process.env.NODE_ENV === 'production' ? '/' : '';
                // For local dev, we might need full URL if frontend is on different port, 
                // but usually relative path works if proxy is set up or we construct full URL on client.

                // Constructing a full URL is safer for cross-origin or separate deployments
                const protocol = req.protocol;
                const host = req.get('host');
                const fullUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

                res.json({
                    filePath: `/uploads/${req.file.filename}`,
                    fullUrl: fullUrl
                });
            }
        }
    });
});

module.exports = router;
