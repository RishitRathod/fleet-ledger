const { User, Vehicle, Group, Refueling } = require('../models'); // Ensure correct imports

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
exports.getVehicleunderadmin = async (req, res) => {
    try {
        // Extract email from request body
        const { email } = req.body;
        console.log(`Fetching vehicle for user with email: ${email}`);
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        console.log(`Fetching user with email: ${email}`);

        // Step 1: Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log(`User not found for email: ${email}`);
            return res.status(404).json({ error: 'User not found' });
        }

        console.log(`User found: ${user.id}`);

        // Step 2: Find group by user ID
        const group = await Group.findOne({ where: { userId: user.id } });
        if (!group) {
            console.log(`Group not found for user ID: ${user.id}`);
            return res.status(404).json({ error: 'Group not found' });
        }

        console.log(`Group found: ${group.id} with vehicle ID: ${group.vehicleId}`);

        // Step 3: Find vehicle by vehicle ID
        const vehicle = await Vehicle.findOne({ where: { id: group.vehicleId } });
        if (!vehicle) {
            console.log(`Vehicle not found for ID: ${group.vehicleId}`);
            return res.status(404).json({ error: 'Vehicle not found' });
        }

        console.log(`Vehicle found: ${vehicle.id} - ${vehicle.name}`);

        // Step 4: Respond with the vehicle data
        res.status(200).json({ success: true, data: vehicle });
    } catch (error) {
        console.error('Error fetching vehicle:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
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


exports.getVehicledata = async (req, res) => {
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




exports.getVehicledata = async (req, res) => {
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




