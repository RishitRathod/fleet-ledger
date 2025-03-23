const express = require('express');
const router = express.Router();
const {
  sendInvitation,
  acceptInvitation,
  rejectInvitation,
  fetchNotifications,
} = require('../controllers/invitationcontroller.js');

// Route for admin to send an invitation
router.post('/admin/invite', sendInvitation);

// Route for user to accept an invitation
router.post('/accept', acceptInvitation);

// Route for user to reject an invitation
router.post('/reject', rejectInvitation);

// Route for user to fetch notifications
router.post('/user/notifications', fetchNotifications);

module.exports = router;
