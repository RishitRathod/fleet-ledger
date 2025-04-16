const { User, Group, Vehicle, Invitation, Refueling, Service, Accessories, } = require('../models');
const { Op, Sequelize } = require('sequelize');

const getExpenseCategory = async (req, res) => {
    try {
        // Fetch users and their related groups and refuelings in a single query
        const users = await Vehicle.findAll({
            include: [{
                model: Group,
                include: [
                    {
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

        // Process the data to calculate totals
        const userData = users.map(user => {
            // Calculate totals for each expense type
            const refuelingTotal = user.Groups.reduce((sum, g) =>
                sum + g.Refuelings.reduce((rSum, r) => rSum + (r.amount || 0), 0), 0
            );

            const serviceTotal = user.Groups.reduce((sum, g) =>
                sum + g.Services.reduce((sSum, s) => sSum + (s.amount || 0), 0), 0
            );

            const accessoryTotal = user.Groups.reduce((sum, g) =>
                sum + g.Accessories.reduce((aSum, a) => aSum + (a.amount || 0), 0), 0
            );

            // Calculate grand total
            const totalAmount = refuelingTotal + serviceTotal + accessoryTotal;

            // Calculate percentages
            const refuelingPercentage = totalAmount > 0 ? (refuelingTotal / totalAmount) * 100 : 0;
            const servicePercentage = totalAmount > 0 ? (serviceTotal / totalAmount) * 100 : 0;
            const accessoryPercentage = totalAmount > 0 ? (accessoryTotal / totalAmount) * 100 : 0;

            // Log the percentages for each vehicle
            console.log(`\nExpense Distribution for Vehicle: ${user.name}`);
            console.log('----------------------------------------');
            console.log(`Total Expenses: ₹${totalAmount.toLocaleString()}`);
            console.log(`Refueling: ₹${refuelingTotal.toLocaleString()} (${refuelingPercentage.toFixed(2)}%)`);
            console.log(`Services: ₹${serviceTotal.toLocaleString()} (${servicePercentage.toFixed(2)}%)`);
            console.log(`Accessories: ₹${accessoryTotal.toLocaleString()} (${accessoryPercentage.toFixed(2)}%)`);
            console.log('----------------------------------------');

            return {
                name: user.name,
                totalAmount,
                expenseBreakdown: {
                    refueling: {
                        amount: refuelingTotal,
                        percentage: refuelingPercentage
                    },
                    service: {
                        amount: serviceTotal,
                        percentage: servicePercentage
                    },
                    accessories: {
                        amount: accessoryTotal,
                        percentage: accessoryPercentage
                    }
                }
            };
        });

        res.json(userData);
    } catch (error) {
        console.error('Error fetching users with total amount:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getExpenseCategory };

