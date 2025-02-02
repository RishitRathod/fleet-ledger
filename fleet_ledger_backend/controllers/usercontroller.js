const User = require('../models/User.js');

exports.getUsersUnderAdmin = async (req, res) => {
    try {
        // const adminId = req.user?.id;
        // if (!adminId) {
        //     return res.status(401).json({ error: "Unauthorized access" });
        // }

        const users = await User.find({ group: adminId }).select('-password');
        if (!users.length) {
            return res.status(404).json({ error: "No users found under this admin" });
        }

        res.status(200).json({ success: true, users });
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
