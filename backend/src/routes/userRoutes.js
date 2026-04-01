const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require('multer');

// Cấu hình multer để xử lý file upload (nếu cần)
const upload = multer({ storage: multer.memoryStorage() });
// Khai báo method PUT cho việc cập nhật dữ liệu
router.put('/update', upload.single('avatarFile'), userController.updateInfo);
module.exports = router;
