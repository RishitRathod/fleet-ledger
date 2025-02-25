const { User, Vehicle, Group } = require('../models'); // Ensure correct imports

/**
 * @desc Create a new vehicle
 * @route POST /api/vehicles
 */

exports.createVehicle = async (req, res) => {
    try {
        const { name, email } = req.body; // Get email from request

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Create a new vehicle
        const vehicle = await Vehicle.create({ name });

        // Assign the vehicle to the user in Group table
        await Group.create({ userId: user.id, vehicleId: vehicle.id });

        res.status(201).json({
            success: true,
            message: "Vehicle created and assigned successfully",
            data: vehicle,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


/**
 * @desc Get all vehicles
 * @route GET /api/vehicles
 */
exports.getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.findAll();
        res.status(200).json({ success: true, data: vehicles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc Get vehicle by ID
 * @route GET /api/vehicles/:id
 */
exports.getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByPk(req.params.id);
        if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found" });
        res.status(200).json({ success: true, data: vehicle });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc Update vehicle by ID
 * @route PUT /api/vehicles/:id
 */
exports.updateVehicle = async (req, res) => {
    try {
        const { name } = req.body;
        const vehicle = await Vehicle.findByPk(req.params.id);
        if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found" });

        vehicle.name = name;
        await vehicle.save();
        res.status(200).json({ success: true, data: vehicle });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc Delete vehicle by ID
 * @route DELETE /api/vehicles/:id
 */
exports.deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByPk(req.params.id);
        if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found" });

        await vehicle.destroy();
        res.status(200).json({ success: true, message: "Vehicle deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
