const { User, Group, Vehicle, Invitation, Tax, Refueling, Service, Accessories, } = require('../models');
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

//get expense category for the user by emailconst getExpenseCategoryByUserEmail = async (req, res) => {
    const getExpenseCategoryByUserEmail = async (req, res) => {
        try {
            const { email } = req.body;
    
            const user = await User.findOne({
                where: { email },
                include: [{
                    model: Group,
                    include: [
                        {
                            model: Refueling,
                            attributes: ['amount'],
                            required: false
                        },
                        {
                            model: Service,
                            attributes: ['amount'],
                            required: false
                        },
                        {
                            model: Accessories,
                            attributes: ['amount'],
                            required: false
                        },
                        {
                            model: Tax,
                            attributes: ['amount'],
                            required: false
                        }
                    ]
                }]
            });
    
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
    
            // Calculate totals
            let refuelingTotal = 0;
            let serviceTotal = 0;
            let accessoryTotal = 0;
            let taxTotal = 0;
    
            user.Groups.forEach(group => {
                if (group.Refuelings) {
                    refuelingTotal += group.Refuelings.reduce((sum, r) => sum + (r.amount || 0), 0);
                }
                if (group.Services) {
                    serviceTotal += group.Services.reduce((sum, s) => sum + (s.amount || 0), 0);
                }
                if (group.Accessories) {
                    accessoryTotal += group.Accessories.reduce((sum, a) => sum + (a.amount || 0), 0);
                }
                if (group.Taxes) {
                    taxTotal += group.Taxes.reduce((sum, t) => sum + (t.amount || 0), 0);
                }
            });
    
            const totalAmount = refuelingTotal + serviceTotal + accessoryTotal + taxTotal;
    
            // Calculate percentages
            const percent = (amount) => totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
    
            const response = {
                name: user.name,
                totalAmount,
                expenseBreakdown: {
                    refueling: {
                        amount: refuelingTotal,
                        percentage: percent(refuelingTotal)
                    },
                    service: {
                        amount: serviceTotal,
                        percentage: percent(serviceTotal)
                    },
                    accessories: {
                        amount: accessoryTotal,
                        percentage: percent(accessoryTotal)
                    },
                    tax: {
                        amount: taxTotal,
                        percentage: percent(taxTotal)
                    }
                }
            };
    
            res.json(response);
        } catch (error) {
            console.error('Error fetching expense data:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
    
    module.exports = { getExpenseCategory, getExpenseCategoryByUserEmail };

