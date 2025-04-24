const { Accessories , Group, } = require('../models');
const { sequelize } = require('../config/db');

// Create a new service record
exports.createAccessory = async (req, res) => {
    try {
        console.log("Incoming Request Body:", req.body); // Debug log

        const group = await Group.findOne({})

        const { accessory_type, amount, description, groupId } = req.body;

        // Validate request data
        // if (!accessory_type || !amount || !description || !groupId) {
                if (!amount || !description || !groupId) {

            return res.status(400).json({ error: "All fields are required" });
        }

        const accessory = await Accessories.create({ accessory_type, amount, description, groupId });

        res.status(201).json(accessory);
    } catch (error) {
        console.error("Error in createService:", error); // Debug log
        res.status(500).json({ error: error.message });
    }
};


// Get all service records
exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.findAll();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a service record by ID
exports.getServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Service.findByPk(id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a service record
exports.updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, service_type, amount, description, groupId } = req.body;
        const service = await Service.findByPk(id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        await service.update({ date, service_type, amount, description, groupId });
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a service record
exports.deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Service.findByPk(id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        await service.destroy();
        res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
