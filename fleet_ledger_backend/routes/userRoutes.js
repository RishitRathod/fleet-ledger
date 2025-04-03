const express = require('express');
const { getUsersUnderAdmin } = require('../controllers/usercontroller.js');
const getUsersWithTotalAmount = require('../controllers/userwiseexpensecontroller')

// const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
router.get('/getUsersWithTotalAmount', getUsersWithTotalAmount.getUsersWithTotalAmount)
router.post('/admin/users', getUsersUnderAdmin);

module.exports = router;
