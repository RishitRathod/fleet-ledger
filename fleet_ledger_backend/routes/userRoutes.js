const express = require('express');
const { getUsersUnderAdmin } = require('../controllers/usercontroller.js');
// const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/admin/users', getUsersUnderAdmin);

module.exports = router;
