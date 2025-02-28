const { User, Refueling, Group } = require('../models');
const { Op, Sequelize } = require('sequelize');

const getUsersWithTotalAmount = async (req, res) => {
    try {
        // First, let's get all users with their groups and refuelings
        const users = await User.findAll({
            include: [{
                model: Group,
                include: [{
                    model: Refueling,
                    attributes: ['amount']
                }]
            }],
            order: [['name', 'ASC']]
        });

        // Transform the data to calculate totals
        const userData = users.map(user => {
            const totalAmount = user.Groups.reduce((sum, group) => {
                const groupTotal = group.Refuelings.reduce((groupSum, refueling) => {
                    return groupSum + (refueling.amount || 0);
                }, 0);
                return sum + groupTotal;
            }, 0);

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                totalAmount: totalAmount || 0,
                // Debug info
                groupCount: user.Groups.length,
                groups: user.Groups.map(g => ({
                    id: g.id,
                    refuelingCount: g.Refuelings.length,
                    refuelingTotal: g.Refuelings.reduce((sum, r) => sum + (r.amount || 0), 0)
                }))
            };
        });

        res.json(userData);
    } catch (error) {
        console.error('Error fetching users with total amount:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getUsersWithTotalAmount };
