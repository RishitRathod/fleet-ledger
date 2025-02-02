const Invitation = require('../models/Invitation');
const User = require('../models/User');
const sendMail = require('../config/mailer');
const bcrypt = require('bcryptjs');

// Send Invitation
// Send Invitation
exports.sendInvitation = async (req, res) => {
    const { email } = req.body;
    // const adminId = req.user.id;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });

        // Check if an invitation already exists for this email
        let invitation = await Invitation.findOne({ email });

        if (!invitation) {
            invitation = new Invitation({ adminId, email, status: 'pending' });
            await invitation.save();
        }

        // Generate invitation link
        const inviteLink = `http://localhost:3000/accept-invite/${invitation._id}`;

        // If the user already exists, send a reminder email instead
        if (existingUser) {
            sendMail(email, 'Invitation to Join Fleet Ledger', 
                `You are already registered. Click here to accept the invitation: ${inviteLink}`
            );
            return res.status(200).json({ message: 'User already exists. Invitation sent to accept.' });
        }

        // Send new invitation email
        // sendMail(email, 'Join Fleet Ledger', `Click here to accept: ${inviteLink}`);

        res.status(200).json({ message: 'Invitation sent successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error sending invitation' });
    }
};
// Accept Invitation
// exports.acceptInvitation = async (req, res) => {
//     try {
//         const { inviteId } = req.params;
//         const invite = await Invitation.findById(inviteId);
        
//         if (!invite || invite.status !== 'pending') {
//             return res.status(400).json({ error: 'Invalid or expired invitation' });
//         }

//         // Check if the user already exists
//         const existingUser = await User.findOne({ email: invite.email });

//         if (existingUser) {
//             // Send an email notifying the user to accept the invitation
//             sendMail(invite.email, 'Invitation to Fleet Ledger', 
//                 `You have already registered. Click here to accept: http://localhost:3000/accept-invite/${inviteId}`
//             );
//             return res.status(200).json({ message: 'Invitation sent. Check your email to accept.' });
//         }

//         // Generate a random password for the new user
//         const randomPassword = Math.random().toString(36).slice(-8); // Generates an 8-character password
//         const hashedPassword = await bcrypt.hash(randomPassword, 10);

//         // Create new user
//         const newUser = new User({
//             email: invite.email,
//             password: hashedPassword,
//             role: 'user',
//             group: invite.adminId
//         });
//         await newUser.save();

//         // Mark invitation as accepted
//         invite.status = 'accepted';
//         await invite.save();

//         // Send Confirmation Email with Login Credentials
//         sendMail(invite.email, 'Your Fleet Ledger Account', `Your password: ${randomPassword}`);

//         res.status(200).json({ message: 'User added successfully. Check email for login details.' });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Error accepting invitation' });
//     }
// };
