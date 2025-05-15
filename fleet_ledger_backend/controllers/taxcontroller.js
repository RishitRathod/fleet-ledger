const { Tax, Group, User } = require('../models');
const { Op } = require('sequelize');

exports.createTax = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const group = await Group.findOne({ where: { vehicleId: req.body.vehicleId, userId: user.id } });
        if (!group) {
            return res.status(404).json({ error: "Group not found for this vehicle" });
        }
        req.body.groupId = group.id;
        console.log("Group ID:", group.id);
        const { taxType, amount, date, description, groupId } = req.body;

        if (!taxType || !amount || !date || !groupId) {
            return res.status(400).json({ error: "Required fields are missing" });
        }

        const tax = await Tax.create({
            taxType,
            amount,
            date,
            description,
            groupId
        });

        res.status(201).json(tax);
    } catch (error) {
        console.error("Error in createTax:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getAllTaxes = async (req, res) => {
    try {
        const taxes = await Tax.findAll({
            include: [{ model: Group }]
        });
        res.status(200).json(taxes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTaxById = async (req, res) => {
    try {
        const { id } = req.params;
        const tax = await Tax.findByPk(id, {
            include: [{ model: Group }]
        });
        
        if (!tax) {
            return res.status(404).json({ message: 'Tax record not found' });
        }
        
        res.status(200).json(tax);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateTax = async (req, res) => {
    try {
        const { id } = req.params;
        const { taxType, amount, date, description } = req.body;

        const tax = await Tax.findByPk(id);
        if (!tax) {
            return res.status(404).json({ message: 'Tax record not found' });
        }

        await tax.update({
            taxType,
            amount,
            date,
            description
        });

        res.status(200).json(tax);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteTax = async (req, res) => {
    try {
        const { id } = req.params;
        const tax = await Tax.findByPk(id);
        
        if (!tax) {
            return res.status(404).json({ message: 'Tax record not found' });
        }

        await tax.destroy();
        res.status(200).json({ message: 'Tax record deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTaxesByDateRange = async (req, res) => {
    try {
        const { startDate, endDate, groupId } = req.query;
        
        const whereClause = {
            date: {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            }
        };

        if (groupId) {
            whereClause.groupId = groupId;
        }

        const taxes = await Tax.findAll({
            where: whereClause,
            include: [{ model: Group }]
        });

        res.status(200).json(taxes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
