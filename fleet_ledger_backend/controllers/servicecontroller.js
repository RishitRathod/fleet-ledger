const { Service } = require('../models');
const { sequelize } = require('../config/db');

// Create a new service record
exports.createService = async (req, res) => {
    try {
        console.log("Incoming Request Body:", req.body); // Debug log

        const { service_type, amount, description, groupId } = req.body;

        // Validate request data
        if (!service_type || !amount || !description || !groupId) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const service = await Service.create({ service_type, amount, description, groupId });

        res.status(201).json(service);
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
