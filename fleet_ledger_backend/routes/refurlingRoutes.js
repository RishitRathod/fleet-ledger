const express = require('express');
const multer = require('multer');
const refuelingController = require('../controllers/refuelingcontroller');

const router = express.Router();

// Ensure 'uploads' directory exists
const fs = require('fs');
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer storage and settings
const storage = multer.memoryStorage(); // Store file in memory for processing
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
        file.mimetype === 'application/vnd.ms-excel') {
        cb(null, true);
    } else {
        cb(new Error('❌ Invalid file type! Only .xlsx and .xls files are allowed.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// File upload route
router.post('/upload', upload.single('file'), refuelingController.uploadExcel);

module.exports = router;
