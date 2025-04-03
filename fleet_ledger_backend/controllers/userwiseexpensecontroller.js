/* The commented code block you provided is a JavaScript function named `getUsersWithTotalAmount`. This
function is designed to fetch users along with their associated groups and refuelings from a
database, calculate the total amount of refuelings for each user, and then return a JSON response
containing the processed user data. */
const { User, Refueling, Group, Service, Accessories } = require('../models');
const { Op, Sequelize } = require('sequelize');

// const getUsersWithTotalAmount = async (req, res) => {
//     try {
//         // First, let's get all users with their groups and refuelings
//         const users = await User.findAll({
//             include: [{
//                 model: Group,
//                 include: [{
//                     model: Refueling,
//                     attributes: ['amount']
//                 }]
//             }],
//             order: [['name', 'ASC']]
//         });

//         // Transform the data to calculate totals
//         const userData = users.map(user => {
//             const totalAmount = user.Groups.reduce((sum, group) => {
//                 const groupTotal = group.Refuelings.reduce((groupSum, refueling) => {
//                     return groupSum + (refueling.amount || 0);
//                 }, 0);
//                 return sum + groupTotal;
//             }, 0);

//             return {
//                 id: user.id,
//                 name: user.name,
//                 email: user.email,
//                 role: user.role,
//                 totalAmount: totalAmount || 0,
//                 // Debug info
//                 groupCount: user.Groups.length,
//                 groups: user.Groups.map(g => ({
//                     id: g.id,
//                     refuelingCount: g.Refuelings.length,
//                     refuelingTotal: g.Refuelings.reduce((sum, r) => sum + (r.amount || 0), 0)
//                 }))
//             };
//         });

//         res.json(userData);
//     } catch (error) {
//         console.error('Error fetching users with total amount:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };


const getUsersWithTotalAmount = async (req, res) => {
    try {
        // Fetch users and their related groups and refuelings in a single query

        const users = await User.findAll({
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


            return {
                // id: user.id,
                name: user.name,

                // totalAmount,
                totalAmount,
                // serviceTotal,
                // accessoryTotal,
                // // Debug info
                // groupCount: user.Groups.length,
                // groups: user.Groups.map(g => ({
                //     id: g.id,
                //     refuelingCount: g.Refuelings.length,
                //     refuelingTotal: g.Refuelings.reduce((sum, r) => sum + (r.amount || 0), 0),
                //     serviceCount: g.Services.length,
                //     serviceTotal: g.Services.reduce((sum, s) => sum + (s.amount || 0), 0),
                //     accessoryCount: g.Accessories.length,
                    // accessoryTotal: g.Accessories.reduce((sum, a) => sum + (a.amount || 0), 0)
                // }))
            };
        });

        res.json(userData);
    } catch (error) {
        console.error('Error fetching users with total amount:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = { getUsersWithTotalAmount };


// fetch all uniqe vehicles from vehicel table
// find all grouid from group table and group them vehicle wise
// find all the enteries from refueling table and group them vehicle wise where groupid is present
// calculate the total amount of refueling for each vehicle
// return the data in a json format







