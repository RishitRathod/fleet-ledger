const express = require('express');
const { adminSignup, userSignup, login } = require('../controllers/authController');

const router = express.Router();

router.post('/adminSignup', adminSignup);
router.post('/userSignup', userSignup);
router.post('/login', login);

module.exports = router;
