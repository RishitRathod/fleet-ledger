const { Accessories , Group, } = require('../models');
const { sequelize, Op } = require('sequelize');

// Create a new service record
exports.createAccessory = async (req, res) => {
    try {
        console.log("Incoming Request Body:", req.body); // Debug log

        const group = await Group.findOne({})

        const { accessory_type, amount, description, date, groupId } = req.body;

        // Validate request data
        // if (!accessory_type || !amount || !description || !groupId) {
                if (!amount || !description || !groupId || !date) {

            return res.status(400).json({ error: "All fields are required" });
        }

        const accessory = await Accessories.create({ accessory_type, amount, description, date, groupId });

        res.status(201).json(accessory);
    } catch (error) {
        console.error("Error in createService:", error); // Debug log
        res.status(500).json({ error: error.message });
    }
};


// Get all service records
exports.getAllServices = async (req, res) => {
    try {
        const services = await Accessories.findAll();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a service record by ID
exports.getServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Accessories.findByPk(id);
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
        const service = await Accessories.findByPk(id);
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
        const service = await Accessories.findByPk(id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        await service.destroy();
        res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get all services by date
exports.getAllServicesByDateRange = async (req, res) => {   
    try {
        const { startDate, endDate } = req.query;
        console.log("Start Date:", startDate); // Debug log
        console.log("End Date:", endDate); // Debug log

        if (!startDate || !endDate) {
            return res.status(400).json({ error: "Start date and end date are required" });
        }

        const services = await Accessories.findAll({
            where: {
                date: {
                    [Op.between]: [new Date(startDate), new Date(endDate)]
                }
            }
        });

        res.status(200).json(services);
    } catch (error) {
        console.error("Error in getAllServicesByDateRange:", error); // Debug log
        res.status(500).json({ error: error.message });
    }
}