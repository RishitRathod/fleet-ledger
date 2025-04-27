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


const getVehiclesWithTotalAmountByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        console.log('Query dates:', { startDate, endDate });
        
        // Validate date parameters
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Start date and end date are required' });
        }

        // Validate date format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
            return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
        }

        const startDateTime = new Date(startDate + 'T00:00:00.000Z');
        const endDateTime = new Date(endDate + 'T23:59:59.999Z');
        console.log('Date range:', { startDateTime, endDateTime });

        // Fetch vehicles with related data
        const vehicles = await Vehicle.findAll({
            include: [{
                model: Group,
                required: false,
                include: [
                    {
                        model: Refueling,
                        where: {
                            date: {
                                [Op.between]: [startDateTime, endDateTime]
                            }
                        },
                        required: false
                    },
                    {
                        model: Service,
                        where: {
                            date: {
                                [Op.between]: [startDateTime, endDateTime]
                            }
                        },
                        required: false
                    },
                    {
                        model: Accessories,
                        where: {
                            date: {
                                [Op.between]: [startDateTime, endDateTime]
                            }
                        },
                        required: false
                    }
                ]
            }],
            order: [['name', 'ASC']]
        });

        console.log('Found vehicles:', vehicles.length);

        // Process and calculate total amounts efficiently
        const vehicleData = vehicles.map(vehicle => {
            console.log('Processing vehicle:', vehicle.name);
            console.log('Groups:', vehicle.Groups?.length || 0);

            let totalAmount = 0;

            if (vehicle.Groups && vehicle.Groups.length > 0) {
                vehicle.Groups.forEach(group => {
                    console.log('Processing group:', group.id);
                    console.log('Records found:', {
                        refuelings: group.Refuelings?.length || 0,
                        services: group.Services?.length || 0,
                        accessories: group.Accessories?.length || 0
                    });

                    const refuelingTotal = group.Refuelings?.reduce((sum, ref) => {
                        console.log('Refueling:', { date: ref.date, amount: ref.amount });
                        return sum + (parseFloat(ref.amount) || 0);
                    }, 0) || 0;

                    const serviceTotal = group.Services?.reduce((sum, service) => {
                        console.log('Service:', { date: service.date, amount: service.amount });
                        return sum + (parseFloat(service.amount) || 0);
                    }, 0) || 0;

                    const accessoryTotal = group.Accessories?.reduce((sum, acc) => {
                        console.log('Accessory:', { date: acc.date, amount: acc.amount });
                        return sum + (parseFloat(acc.amount) || 0);
                    }, 0) || 0;

                    totalAmount += refuelingTotal + serviceTotal + accessoryTotal;
                    console.log('Group totals:', { refuelingTotal, serviceTotal, accessoryTotal });
                });
            }

            console.log('Vehicle total:', totalAmount);
            return {
                name: vehicle.name,
                totalAmount
            };
        });

        res.json(vehicleData);

    } catch (error) {
        console.error('Error in getVehiclesWithTotalAmountByDateRange:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getVehiclesWithTotalAmount,
    getVehiclesWithTotalAmountByDateRange
};
