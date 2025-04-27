const express = require('express');
const { getUsersUnderAdmin, getUserByEmail } = require('../controllers/usercontroller.js');
const getUsersWithTotalAmount = require('../controllers/userwiseexpensecontroller')

// const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
router.get('/getUsersWithTotalAmount', getUsersWithTotalAmount.getUsersWithTotalAmount);
router.get('/getUsersWithTotalAmount/date-range', getUsersWithTotalAmount.getUsersWithTotalAmountByDateRange);
router.post('/admin/users', getUsersUnderAdmin);
router.post('/getUserByEmail', getUserByEmail);

module.exports = router;
