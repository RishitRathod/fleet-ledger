const express = require('express');
const router = express.Router();
const { sendInvitation, acceptInvitation, fetchNotifications, rejectInvitation } = require('../controllers/invitationcontroller.js');
// const authMiddleware = require('../middlewares/authMiddleware.js');  // Ensure admin authentication

router.post('/admin/invite', sendInvitation);
router.post('/user/accept-invite', acceptInvitation);
router.post('/user/reject-invite', rejectInvitation);
router.post('/user/notifications', fetchNotifications);

module.exports = router;
