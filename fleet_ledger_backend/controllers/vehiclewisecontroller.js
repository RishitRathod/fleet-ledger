const { Vehicle, Refueling, Group, Service, Accessories } = require('../models');
const { Op, Sequelize } = require('sequelize');

const getVehiclesWithTotalAmount = async (req, res) => {
    try {
        // Fetch users and their related groups and refuelings in a single query
        const vehicles = await Vehicle.findAll({
            include: [{
                model: Group,
                include: [{
                    model: Refueling,
                    attributes: ['amount']
                },
                {
                    model: Service,
                    attributes: ['amount']
                },
                {
                    model: Accessories,
                    attributes: ['amount']
                }
            ]
            }],
            order: [['name', 'ASC']]
        });

        // Process and calculate total amounts efficiently
        const vehicleData = vehicles.map(vehicle => {
            let totalAmount = 0;
            const groups = vehicle.Groups.map(group => {
                const refuelingTotal = group.Refuelings.reduce((sum, refueling) => sum + (refueling.amount || 0), 0);
                const serviceTotal = group.Services.reduce((sum, service) => sum + (service.amount || 0), 0);
                const accessoryTotal = group.Accessories.reduce((sum, accessory) => sum + (accessory.amount || 0), 0);
                totalAmount += refuelingTotal + serviceTotal + accessoryTotal;
              
            });

            return {
                // id: user.id,
                name: vehicle.name,
                // email: user.email,
                // role: user.role,
                totalAmount,
                // groupCount: groups.length,
                // groups
            };
        });

        res.json(vehicleData);
    } catch (error) {
        console.error('Error fetching users with total amount:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = { getVehiclesWithTotalAmount };
