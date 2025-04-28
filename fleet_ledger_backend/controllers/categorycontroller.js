const { Refueling, Service, Accessories, Tax } = require('../models');
const { Sequelize } = require('sequelize');

const getCatrgoryWithTotalAmount = async (req, res) => {
    try {
        // Fetch sum of 'amount' from each table
        const [refuelingTotal, serviceTotal, accessoriesTotal, taxTotal] = await Promise.all([
            Refueling.sum('amount'),
            Service.sum('amount'),
            Accessories.sum('amount'),
            Tax.sum('amount')
        ]);

        // Prepare the response exactly matching frontend structure
        const categoryData = [
            { name: 'Refueling', totalAmount: refuelingTotal || 0 },
            { name: 'Service', totalAmount: serviceTotal || 0 },
            { name: 'Accessories', totalAmount: accessoriesTotal || 0 },
            { name: 'Tax', totalAmount: taxTotal || 0 }
        ];

        res.json(categoryData);
    } catch (error) {
        console.error('Error fetching category totals:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { 
    getCatrgoryWithTotalAmount,
};
