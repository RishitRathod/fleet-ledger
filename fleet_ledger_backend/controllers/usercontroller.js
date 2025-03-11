const Invitation = require('../models/invitation.js');
const User = require('../models/User.js');

exports.getUsersUnderAdmin = async (req, res) => {
    try {
        console.log("Received request to fetch users under admin:", req.body);

        // Validate request body
        if (!req.body.email) {
            console.error("Error: Missing email in request body");
            return res.status(400).json({ error: "Email is required" });
        }

        console.log("Searching for admin with email:", req.body.email);

        // Find admin user by email
        const admin = await User.findOne({ where: { email: req.body.email } });
        if (!admin) {
            console.error("Admin user not found for email:", req.body.email);
            return res.status(404).json({ error: "Admin user not found" });
        }

        console.log("Admin found:", admin);
        const adminId = admin.id;

        console.log("Fetching users under admin with ID:", adminId);

        // Find users under the admin where status is 'accepted'
        const invitations = await Invitation.findAll({
            where: { adminId: adminId}
        });

        if (!invitations.length) {
            console.error("No users found under this admin");
            return res.status(404).json({ error: "No users found under this admin" });
        }

        console.log("Users found under admin:", invitations);

        res.status(200).json({ success: true, users: invitations });

    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
};
