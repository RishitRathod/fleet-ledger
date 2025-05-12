const { User, Vehicle, Group, Accessories, Service, Tax, Refueling } = require('../models'); // Ensure correct imports

const getusercomparison = async (req, res) => {
    try {
        const { userIds } = req.body; // expecting array of user IDs from frontend

        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({ error: 'User IDs are required and should be an array' });
        }

        // Fetch only users whose IDs are in the userIds array
        const users = await User.findAll({
            where: {
                id: userIds
            },
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

        // Process the data
        const userData = users.map(user => {
            const refuelingTotal = user.Groups.reduce((sum, g) => 
                sum + g.Refuelings.reduce((rSum, r) => rSum + (r.amount || 0), 0), 0
            );

            const serviceTotal = user.Groups.reduce((sum, g) => 
                sum + g.Services.reduce((sSum, s) => sSum + (s.amount || 0), 0), 0
            );

            const accessoryTotal = user.Groups.reduce((sum, g) => 
                sum + g.Accessories.reduce((aSum, a) => aSum + (a.amount || 0), 0), 0
            );

            const totalAmount = refuelingTotal + serviceTotal + accessoryTotal;

            return {
                id: user.id,
                name: user.name,
                totalAmount,
            };
        });

        res.json(userData);
    } catch (error) {
        console.error('Error fetching users with total amount:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// exports.getvehiclecomparison = async (req, res) => {
//     try {
//         const { vehicleIds } = req.body; // expecting array of vehicle IDs

//         if (!vehicleIds || !Array.isArray(vehicleIds) || vehicleIds.length === 0) {
//             return res.status(400).json({ success: false, message: 'Vehicle IDs are required and should be an array' });
//         }

//         // Fetch vehicles, their groups, and group's expenses
//         const vehicles = await Vehicle.findAll({
//             where: {
//                 id: vehicleIds
//             },
//             include: [{
//                 model: Group,
//                 include: [
//                     {
//                         model: Refueling,
//                         attributes: ['amount']
//                     },
//                     {
//                         model: Service,
//                         attributes: ['amount']
//                     },
//                     {
//                         model: Accessories,
//                         attributes: ['amount']
//                     }
//                 ]
//             }],
//             order: [['name', 'ASC']]
//         });

//         // Process data
//         const vehicleData = vehicles.map(vehicle => {
//             const refuelingTotal = vehicle.Groups.reduce((sum, group) => 
//                 sum + group.Refuelings.reduce((rSum, r) => rSum + (r.amount || 0), 0), 0
//             );

//             const serviceTotal = vehicle.Groups.reduce((sum, group) => 
//                 sum + group.Services.reduce((sSum, s) => sSum + (s.amount || 0), 0), 0
//             );

//             const accessoryTotal = vehicle.Groups.reduce((sum, group) => 
//                 sum + group.Accessories.reduce((aSum, a) => aSum + (a.amount || 0), 0), 0
//             );

//             const totalAmount = refuelingTotal + serviceTotal + accessoryTotal;

//             return {
//                 id: vehicle.id,
//                 name: vehicle.name,
//                 totalAmount,
//             };
//         });

//         res.json(vehicleData);
//     } catch (error) {
//         console.error('Error fetching vehicles with total amount:', error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };





// exports.getuservehiclecomparison = async (req, res) => {
//     try {
//         const { userId, vehicleIds } = req.body; // expecting userId and array of vehicleIds

//         if (!userId || !vehicleIds || !Array.isArray(vehicleIds) || vehicleIds.length === 0) {
//             return res.status(400).json({ success: false, message: 'userId and vehicleIds are required' });
//         }

//         // Fetch Groups matching userId and vehicleIds
//         const groups = await Group.findAll({
//             where: {
//                 userId: userId,
//                 vehicleId: vehicleIds // Sequelize will automatically handle array with IN operator
//             },
//             include: [
//                 {
//                     model: Refueling,
//                     attributes: ['amount']
//                 },
//                 {
//                     model: Service,
//                     attributes: ['amount']
//                 },
//                 {
//                     model: Accessories,
//                     attributes: ['amount']
//                 },
//                 {
//                     model: Vehicle, // Also include Vehicle to get name
//                     attributes: ['id', 'name']
//                 }
//             ],
//             order: [['vehicleId', 'ASC']]
//         });

//         // Now process per vehicle
//         const vehicleData = {};

//         groups.forEach(group => {
//             const vehicleId = group.vehicleId;
//             const vehicleName = group.Vehicle?.name || "Unknown Vehicle";

//             if (!vehicleData[vehicleId]) {
//                 vehicleData[vehicleId] = {
//                     vehicleId,
//                     vehicleName,
//                     refuelingTotal: 0,
//                     serviceTotal: 0,
//                     accessoryTotal: 0,
//                     totalAmount: 0
//                 };
//             }

//             // Sum up amounts
//             vehicleData[vehicleId].refuelingTotal += group.Refuelings.reduce((sum, r) => sum + (r.amount || 0), 0);
//             vehicleData[vehicleId].serviceTotal += group.Services.reduce((sum, s) => sum + (s.amount || 0), 0);
//             vehicleData[vehicleId].accessoryTotal += group.Accessories.reduce((sum, a) => sum + (a.amount || 0), 0);

//             // Update totalAmount
//             vehicleData[vehicleId].totalAmount = vehicleData[vehicleId].refuelingTotal +
//                                                   vehicleData[vehicleId].serviceTotal +
//                                                   vehicleData[vehicleId].accessoryTotal;
//         });

//         // Convert object to array
//         const result = Object.values(vehicleData);

//         res.json(result);
//     } catch (error) {
//         console.error('Error fetching user vehicle comparison:', error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };



// exports.getvehicleusercomparison = async (req, res) => {
//     try {
//         const { vehicleId, userIds } = req.body; // expecting vehicleId and array of userIds

//         if (!vehicleId || !userIds || !Array.isArray(userIds) || userIds.length === 0) {
//             return res.status(400).json({ success: false, message: 'vehicleId and userIds are required' });
//         }

//         // Fetch Groups matching vehicleId and userIds
//         const groups = await Group.findAll({
//             where: {
//                 vehicleId: vehicleId,
//                 userId: userIds
//             },
//             include: [
//                 {
//                     model: Refueling,
//                     attributes: ['amount']
//                 },
//                 {
//                     model: Service,
//                     attributes: ['amount']
//                 },
//                 {
//                     model: Accessories,
//                     attributes: ['amount']
//                 },
//                 {
//                     model: User, // Include User to get name
//                     attributes: ['id', 'name']
//                 }
//             ],
//             order: [['userId', 'ASC']]
//         });

//         // Now process per user
//         const userData = {};

//         groups.forEach(group => {
//             const userId = group.userId;
//             const userName = group.User?.name || "Unknown User";

//             if (!userData[userId]) {
//                 userData[userId] = {
//                     userId,
//                     userName,
//                     refuelingTotal: 0,
//                     serviceTotal: 0,
//                     accessoryTotal: 0,
//                     totalAmount: 0
//                 };
//             }

//             // Sum up amounts
//             userData[userId].refuelingTotal += group.Refuelings.reduce((sum, r) => sum + (r.amount || 0), 0);
//             userData[userId].serviceTotal += group.Services.reduce((sum, s) => sum + (s.amount || 0), 0);
//             userData[userId].accessoryTotal += group.Accessories.reduce((sum, a) => sum + (a.amount || 0), 0);

//             // Update totalAmount
//             userData[userId].totalAmount = userData[userId].refuelingTotal +
//                                            userData[userId].serviceTotal +
//                                            userData[userId].accessoryTotal;
//         });

//         // Convert object to array
//         const result = Object.values(userData);

//         res.json(result);
//     } catch (error) {
//         console.error('Error fetching vehicle user comparison:', error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };


module.exports = {
    getusercomparison
    // getvehiclecomparison,
    // getuservehiclecomparison,
    // getvehicleusercomparison
};