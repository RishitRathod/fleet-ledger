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
 * @desc Get vehicles under admin
 * @route POST /api/vehicles/getVehicleunderadmin
 */
exports.getVehicleunderadmin = async (req, res) => {
    try {
        // Extract email from request body
        const { email } = req.body;
        console.log(`Fetching vehicles for user with email: ${email}`);
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

        // Step 2: Find all groups associated with the user
        const groups = await Group.findAll({ where: { userId: user.id } });
        if (!groups || groups.length === 0) {
            console.log(`No groups found for user ID: ${user.id}`);
            return res.status(404).json({ error: 'No vehicles found under this admin' });
        }

        console.log(`Found ${groups.length} groups for user`);

        // Step 3: Find all vehicles associated with these groups
        const vehicleIds = groups.map(group => group.vehicleId);
        const vehicles = await Vehicle.findAll({ where: { id: vehicleIds } });
        
        if (!vehicles || vehicles.length === 0) {
            console.log(`No vehicles found for IDs: ${vehicleIds}`);
            return res.status(404).json({ error: 'No vehicles found' });
        }

        console.log(`Found ${vehicles.length} vehicles`);

        // Return success response with vehicles array
        res.status(200).json({
            success: true,
            vehicles: vehicles.map(vehicle => ({
                id: vehicle.id,
                name: vehicle.name,
                createdAt: vehicle.createdAt,
                updatedAt: vehicle.updatedAt
            }))
        });

    } catch (error) {
        console.error('Error in getVehicleunderadmin:', error);
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

/**
 * @desc Get vehicle data by name
 * @route POST /api/vehicles/data
 */
exports.getVehicledata = async (req, res) => {
    try {
        const { name } = req.body;
        console.log("Fetching data for vehicle:", name);

        // Find vehicle by name
        const vehicle = await Vehicle.findOne({ where: { name } });
        if (!vehicle) {
            return res.status(404).json({ success: false, message: "Vehicle not found" });
        }
        console.log("Vehicle found:", vehicle.id);

        // Find groups associated with the vehicle
        const groups = await Group.findAll({ where: { vehicleId: vehicle.id } });
        if (!groups || groups.length === 0) {
            return res.status(404).json({ success: false, message: "No group found for this vehicle" });
        }
        console.log("Groups found:", groups.map(g => g.id));

        // Extract group IDs
        const groupIds = groups.map(g => g.id);

        // Find refueling data for these groups
        const refueling = await Refueling.findAll({ 
            where: { groupId: groupIds },
            order: [['createdAt', 'DESC']] // Order by creation date, newest first
        });

        // Don't return an error if no refueling data is found
        const data = {
            vehicle,
            refueling: refueling || []
        };

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Error in getVehicledata:", error);
        res.status(500).json({ success: false, message: "Error fetching vehicle data" });
    }
};
