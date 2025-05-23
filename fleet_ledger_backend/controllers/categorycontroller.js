const { Refueling, Service, Accessories, Tax } = require('../models');
const { Sequelize } = require('sequelize');

// Helper function to safely handle nulls (replace null with 0)
const safeSum = (x) => (x === null ? 0 : x);

const getCatrgoryWithTotalAmount = async (req, res) => {
    try {
        // Fetch sum of 'amount' from each table, ensuring null is handled
        const [refuelingTotalRaw, serviceTotalRaw, accessoriesTotalRaw] = await Promise.all([
            Refueling.sum('amount', { where: { amount: { [Sequelize.Op.ne]: null } } }),
            Service.sum('amount', { where: { amount: { [Sequelize.Op.ne]: null } } }),
            Accessories.sum('amount', { where: { amount: { [Sequelize.Op.ne]: null } } })
        ]);

        // Safely handle null totals
        const refuelingAmount = safeSum(refuelingTotalRaw);
        const serviceAmount = safeSum(serviceTotalRaw);
        const accessoriesAmount = safeSum(accessoriesTotalRaw);
        
        // Calculate total amount
        const totalAmount = refuelingAmount + serviceAmount + accessoriesAmount;
        
        // Calculate percentages
        const response = {
            name: 'Vehicle Expenses',
            totalAmount: totalAmount,
            expenseBreakdown: {
                refueling: {
                    amount: refuelingAmount,
                    percentage: totalAmount > 0 ? (refuelingAmount / totalAmount) * 100 : 0
                },
                service: {
                    amount: serviceAmount,
                    percentage: totalAmount > 0 ? (serviceAmount / totalAmount) * 100 : 0
                },
                accessories: {
                    amount: accessoriesAmount,
                    percentage: totalAmount > 0 ? (accessoriesAmount / totalAmount) * 100 : 0
                }
            }
        };

        // Send the response with category data
        res.json(response);
    } catch (error) {
        console.error('Error fetching category totals:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getCatrgoryWithTotalAmountBasedOnDate = async (req, res) => {
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

        console.lo
        res.json(categoryData);
    } catch (error) {
        console.error('Error fetching category totals:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}
module.exports = { 
    getCatrgoryWithTotalAmount,
    getCatrgoryWithTotalAmountBasedOnDate
};
