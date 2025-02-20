const Invitation = require('../models/invitation');
const User = require('../models/User');
const sendMail = require('../config/mailer');
const bcrypt = require('bcrypt');
const { where } = require('sequelize');

// Send Invitation
exports.sendInvitation = async (req, res) => {
    const { adminemail, name } = req.body;

    try {
        const admin = await User.findOne({ where: { email: adminemail } });
        if (!admin) {
            return res.status(404).json({ error: 'Admin user not found' });
        }

        const adminId = admin.id;
        let invitation = await Invitation.findOne({ where: { name } });

        if (!invitation) {
            invitation = new Invitation({ adminId, name, status: 'pending' });
            await invitation.save();
        }

        res.status(200).json({ message: 'Invitation sent successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error sending invitation' });
    }
};

// Accept Invitation
exports.acceptInvitation = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const invite = await Invitation.findOne({ where: { name: user.name, status: 'pending' } });
        if (!invite) {
            return res.status(400).json({ error: 'Invalid or expired invitation' });
        }

        invite.status = 'accepted';
        await invite.save();

        res.status(200).json({ message: 'Invitation accepted successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error accepting invitation' });
    }
};

// Fetch Notifications
exports.fetchNotifications = async (req, res) => {
  try {
      const { email } = req.body;

      // Fetch the user based on email
      const user = await User.findOne({ where: { email } });
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Fetch all invitations for the user
      const invitations = await Invitation.findAll({ 
          where: { name: user.name, status: 'pending' } 
      });

      // Extract adminIds from invitations
      const adminIds = invitations.map(inv => inv.adminId);

      // Fetch admin details for all unique adminIds
      const admins = await User.findAll({ 
          where: { id: adminIds },
          attributes: ['id', 'name']
      });

      // Create a mapping of adminId -> adminName
      const adminMap = admins.reduce((acc, admin) => {
          acc[admin.id] = admin.name;
          return acc;
      }, {});

      // Append adminName to each invitation
      const formattedInvitations = invitations.map(inv => ({
          id: inv.id,
          adminId: inv.adminId,
          adminName: adminMap[inv.adminId] || "Unknown",  // Default if admin not found
          name: inv.name,
          status: inv.status,
          createdAt: inv.createdAt,
          updatedAt: inv.updatedAt
      }));

      res.status(200).json({ invitations: formattedInvitations });
  } catch (err) {
      console.error("Error fetching notifications:", err);
      res.status(500).json({ error: 'Error fetching notifications' });
  }
};
  
// Reject Invitation
exports.rejectInvitation = async (req, res) => {
    try {
        const { id } = req.body;
        const invite = await Invitation.findOne({ where: { id, status: 'pending' } });
        if (!invite) {
            return res.status(400).json({ error: 'Invalid or expired invitation' });
        }

        invite.status = 'rejected';
        await invite.save();

        res.status(200).json({ message: 'Invitation rejected successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error rejecting invitation' });
    }
};
