const Invitation = require('../models/invitation');
const User = require('../models/User');
const sendMail = require('../config/mailer');
const bcrypt = require('bcrypt');
const { where } = require('sequelize');

// Send Invitation
exports.sendInvitation = async (req, res) => {
    const { adminemail, name } = req.body;

    try {
        // Find the admin user by matching email
        const admin = await User.findOne({ where: { email: adminemail } });
        console.log("Admin:", admin); // Debugging

        if (!admin) {
            return res.status(404).json({ error: 'Admin user not found' });
        }

        const adminId = admin.id; // Extract the admin's ID
        console.log("Admin ID:", adminId); // Debugging

        // Check if the user already exists
        const existingUser = await Invitation.findOne({ name });

        // Check if an invitation already exists for this email
        let invitation = await Invitation.findOne({where: { name: name }});

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


exports.acceptInvitation = async (req, res) => {
    try {
        const { email } = req.body;  // Extract email correctly

        // Find the user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the invitation by user's name
        const invite = await Invitation.findOne({ where: { name: user.name } });
        if (!invite || invite.status !== 'pending') {
            return res.status(400).json({ error: 'Invalid or expired invitation' });
        }

        // Mark invitation as accepted
        invite.status = 'accepted';
        await invite.save();

        res.status(200).json({ message: 'User added successfully. Check email for login details.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error accepting invitation' });
    }
};
