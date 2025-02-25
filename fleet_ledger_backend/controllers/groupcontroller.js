const { User, Vehicle, Group } = require('../models'); // Ensure correct imports

/**
 * @desc Assign multiple users to multiple vehicles
 * @route POST /api/groups
 */

exports.assignUserToVehicle = async (req, res) => {
    try {
        const { username, vehicleName } = req.body;

        // Find user by username
        const user = await User.findOne({ where: { name: username } });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Find vehicle by name
        const vehicle = await Vehicle.findOne({ where: { name: vehicleName } });
        if (!vehicle) {
            return res.status(404).json({ success: false, message: "Vehicle not found" });
        }

        // Assign user to vehicle in Group table
        const groupEntry = await Group.create({ userId: user.id, vehicleId: vehicle.id });

        res.status(201).json({
            success: true,
            message: "User assigned to vehicle successfully",
            data: groupEntry,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


/**
 * @desc Get all assigned users with their vehicles
 * @route GET /api/groups
 */
exports.getUserVehicles = async (req, res) => {
    try {
        const { email } = req.body;

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Find all vehicle assignments for the user
        const assignedVehicles = await Group.findAll({
            where: { userId: user.id },
            include: [{ model: Vehicle, attributes: ['id', 'name'] }]
        });

        // Extract vehicle details
        const vehicles = assignedVehicles.map(entry => entry.Vehicle);

        res.status(200).json({
            success: true,
            data: {
                user: { id: user.id, name: user.name, email: user.email },
                vehicles: vehicles
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

