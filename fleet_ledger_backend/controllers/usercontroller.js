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
            where: { adminId: adminId }
        });

        if (!invitations.length) {
            console.error("No users found under this admin");
            return res.status(404).json({ error: "No users found under this admin" });
        }

        // Get user emails from invitations
        const name = invitations.map(invitation => invitation.name);

        // Find users with matching emails
        const users = await User.findAll({
            where: { name: name }
        });

        console.log("Users found under admin:", users);

        res.status(200).json({ success: true, users: users });
        

    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
};

exports.getUserByEmail = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ id: user.id, email: user.email });
    } catch (error) {
        console.error("Error fetching user by email:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

exports.getUserdata = async (req, res) => {
    try {
        const { name } = req.body;

        // Find vehicle by name
        const vehicle = await Vehicle.findOne({ where: { name } });
        if (!vehicle) {
            return res.status(404).json({ success: false, message: "Vehicle not found" });
        }

        // Find groups associated with the vehicle
        const groups = await Group.findAll({ where: { vehicleId: vehicle.id } });
        if (!groups || groups.length === 0) {
            return res.status(404).json({ success: false, message: "Group not found" });
        }

        // Extract group IDs
        const groupIds = groups.map(g => g.id);

        // Find refueling data for these groups
        const refueling = await Refueling.findAll({ where: { groupId: groupIds } });
        if (!refueling || refueling.length === 0) {
            return res.status(404).json({ success: false, message: "Refueling not found" });
        }

        res.status(200).json({ success: true, data: { vehicle, refueling } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
