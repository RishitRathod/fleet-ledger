const express = require('express');
const router = express.Router();
const { sendInvitation, acceptInvitation } = require('../controllers/invitationcontroller.js');
// const authMiddleware = require('../middlewares/authMiddleware.js');  // Ensure admin authentication

router.post('/admin/invite', sendInvitation);
router.post('/user/accept-invite', acceptInvitation);

module.exports = router;
