const express = require('express');
const  getCatrgoryWithTotalAmount  = require('../controllers/categorycontroller');

// const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
router.get('/getCatrgoryWithTotalAmount', getCatrgoryWithTotalAmount.getCatrgoryWithTotalAmount);
// router.get('/getUsersWithTotalAmount/date-range', getUsersWithTotalAmount.getUsersWithTotalAmountByDateRange);
// router.post('/admin/users', getUsersUnderAdmin);
// router.post('/getUserByEmail', getUserByEmail);

module.exports = router;
