const { User, Vehicle, Group, Accessories, Service, Tax, Refueling } = require('../models');
const { Op } = require('sequelize'); // Add Sequelize operators

const getusercomparison = async (req, res) => {
    try {
        const { userList, startDate, endDate, models } = req.body;

        // Handle models
        const validModels = ['Refueling', 'Service', 'Accessories', 'Tax'];
        let selectedModels = validModels; // Default to all models
        
        if (models && models !== 'all' && Array.isArray(models)) {
            selectedModels = models.filter(model => validModels.includes(model));
            if (selectedModels.length === 0) {
                return res.status(400).json({ error: 'No valid models selected' });
            }
        }

        // Handle user list
        let whereClause = {};
        
        if (!userList || !Array.isArray(userList) || userList.length === 0) {
            // Fetch all users if userList is not provided or empty
        } else {
            // Check if any userIds are 'all', null, or undefined
            const hasAllUsers = userList.some(obj => !obj.userId || obj.userId === 'all');
            
            if (!hasAllUsers) {
                // If no 'all' users found, filter by specific userIds
                const userIds = userList.map(obj => obj.userId).filter(id => id);
                if (userIds.length > 0) {
                    whereClause.id = userIds;
                }
            }
            // If hasAllUsers is true, whereClause remains empty to fetch all users
        }

        let dateFilter = {};
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return res.status(400).json({ error: 'Invalid date format' });
            }

            if (start > end) {
                return res.status(400).json({ error: 'startDate cannot be later than endDate' });
            }

            dateFilter = {
                createdAt: {
                    [Op.between]: [start, end]
                }
            };
        }

        // Fetch users based on the where clause
        const users = await User.findAll({
            where: whereClause,
            include: [{
                model: Group,
                include: [
                    ...(selectedModels.includes('Refueling') ? [{
                        model: Refueling,
                        attributes: ['amount', 'createdAt'],
                        where: dateFilter,
                        required: false
                    }] : []),
                    ...(selectedModels.includes('Service') ? [{
                        model: Service,
                        attributes: ['amount', 'createdAt'],
                        where: dateFilter,
                        required: false
                    }] : []),
                    ...(selectedModels.includes('Accessories') ? [{
                        model: Accessories,
                        attributes: ['amount', 'createdAt'],
                        where: dateFilter,
                        required: false
                    }] : []),
                    ...(selectedModels.includes('Tax') ? [{
                        model: Tax,
                        attributes: ['amount', 'createdAt'],
                        where: dateFilter,
                        required: false
                    }] : [])
                ]
            }],
            order: [['name', 'ASC']]
        });

        // Process the data
        const userData = users.map(user => {
            const details = {};
            let totalAmount = 0;

            if (selectedModels.includes('Refueling')) {
                details.refuelingTotal = user.Groups.reduce((sum, g) => 
                    sum + g.Refuelings.reduce((rSum, r) => rSum + (r.amount || 0), 0), 0
                );
                totalAmount += details.refuelingTotal;
            }

            if (selectedModels.includes('Service')) {
                details.serviceTotal = user.Groups.reduce((sum, g) => 
                    sum + g.Services.reduce((sSum, s) => sSum + (s.amount || 0), 0), 0
                );
                totalAmount += details.serviceTotal;
            }

            if (selectedModels.includes('Accessories')) {
                details.accessoryTotal = user.Groups.reduce((sum, g) => 
                    sum + g.Accessories.reduce((aSum, a) => aSum + (a.amount || 0), 0), 0
                );
                totalAmount += details.accessoryTotal;
            }

            if (selectedModels.includes('Tax')) {
                details.taxTotal = user.Groups.reduce((sum, g) => 
                    sum + g.Taxes.reduce((tSum, t) => tSum + (t.amount || 0), 0), 0
                );
                totalAmount += details.taxTotal;
            }

            return {
                id: user.id,
                name: user.name,
                totalAmount,
                details
            };
        });

        res.json(userData);
    } catch (error) {
        console.error('Error fetching users with total amount:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const getvehiclecomparison = async (req, res) => {
    try {
        const { vehicleList, startDate, endDate, models } = req.body;

        // Handle models
        const validModels = ['Refueling', 'Service', 'Accessories', 'Tax'];
        let selectedModels = validModels; // Default to all models
        
        if (models && models !== 'all' && Array.isArray(models)) {
            selectedModels = models.filter(model => validModels.includes(model));
            if (selectedModels.length === 0) {
                return res.status(400).json({ error: 'No valid models selected' });
            }
        }

        // Handle user list
        let whereClause = {};
        
        if (!vehicleList || !Array.isArray(vehicleList) || vehicleList.length === 0) {
            // Fetch all users if userList is not provided or empty
        } else {
            // Check if any userIds are 'all', null, or undefined
            const hasAllUsers = vehicleList.some(obj => !obj.vehicleId || obj.vehicleId === 'all');
            
            if (!hasAllUsers) {
                // If no 'all' users found, filter by specific userIds
                const userIds = vehicleList.map(obj => obj.vehicleId).filter(id => id);
                if (userIds.length > 0) {
                    whereClause.id = userIds;
                }
            }
            // If hasAllUsers is true, whereClause remains empty to fetch all users
        }

        let dateFilter = {};
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return res.status(400).json({ error: 'Invalid date format' });
            }

            if (start > end) {
                return res.status(400).json({ error: 'startDate cannot be later than endDate' });
            }

            dateFilter = {
                createdAt: {
                    [Op.between]: [start, end]
                }
            };
        }

        // Fetch users based on the where clause
        const users = await Vehicle.findAll({
            where: whereClause,
            include: [{
                model: Group,
                include: [
                    ...(selectedModels.includes('Refueling') ? [{
                        model: Refueling,
                        attributes: ['amount', 'createdAt'],
                        where: dateFilter,
                        required: false
                    }] : []),
                    ...(selectedModels.includes('Service') ? [{
                        model: Service,
                        attributes: ['amount', 'createdAt'],
                        where: dateFilter,
                        required: false
                    }] : []),
                    ...(selectedModels.includes('Accessories') ? [{
                        model: Accessories,
                        attributes: ['amount', 'createdAt'],
                        where: dateFilter,
                        required: false
                    }] : []),
                    ...(selectedModels.includes('Tax') ? [{
                        model: Tax,
                        attributes: ['amount', 'createdAt'],
                        where: dateFilter,
                        required: false
                    }] : [])
                ]
            }],
            order: [['name', 'ASC']]
        });

        // Process the data
        const vehicleData = users.map(vehicle => {
            const details = {};
            let totalAmount = 0;

            if (selectedModels.includes('Refueling')) {
                details.refuelingTotal = vehicle.Groups.reduce((sum, g) => 
                    sum + g.Refuelings.reduce((rSum, r) => rSum + (r.amount || 0), 0), 0
                );
                totalAmount += details.refuelingTotal;
            }

            if (selectedModels.includes('Service')) {
                details.serviceTotal = vehicle.Groups.reduce((sum, g) => 
                    sum + g.Services.reduce((sSum, s) => sSum + (s.amount || 0), 0), 0
                );
                totalAmount += details.serviceTotal;
            }

            if (selectedModels.includes('Accessories')) {
                details.accessoryTotal = vehicle.Groups.reduce((sum, g) => 
                    sum + g.Accessories.reduce((aSum, a) => aSum + (a.amount || 0), 0), 0
                );
                totalAmount += details.accessoryTotal;
            }

            if (selectedModels.includes('Tax')) {
                details.taxTotal = vehicle.Groups.reduce((sum, g) => 
                    sum + g.Taxes.reduce((tSum, t) => tSum + (t.amount || 0), 0), 0
                );
                totalAmount += details.taxTotal;
            }

            return {
                id: vehicle.id,
                name: vehicle.name,
                totalAmount,
                details
            };
        });

        res.json(vehicleData);
    } catch (error) {
        console.error('Error fetching users with total amount:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




const getuservehiclecomparison = async (req, res) => {
    try {
        const { userId, vehicleIds, startDate, endDate, models } = req.body;

        // Validate required fields
        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        // Handle vehicle IDs
        let vehicleIdList;
        if (!vehicleIds || (Array.isArray(vehicleIds) && vehicleIds.length === 1 && vehicleIds[0] === 'all')) {
            // Fetch all vehicles for the user
            vehicleIdList = null;
        } else if (Array.isArray(vehicleIds) && vehicleIds.length > 0) {
            vehicleIdList = vehicleIds;
        } else {
            return res.status(400).json({ error: 'vehicleIds must be "all" or an array of vehicle IDs' });
        }

        // Validate date range
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Both startDate and endDate are required' });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        if (start > end) {
            return res.status(400).json({ error: 'startDate cannot be later than endDate' });
        }

        // Validate and process models
        const validModels = ['Refueling', 'Service', 'Accessories', 'Tax'];
        let selectedModels;
        
        if (!models || models === 'all') {
            selectedModels = validModels;
        } else if (Array.isArray(models)) {
            selectedModels = models.filter(model => validModels.includes(model));
            if (selectedModels.length === 0) {
                return res.status(400).json({ error: 'No valid models selected' });
            }
        } else {
            return res.status(400).json({ error: 'Models must be "all" or an array of valid model names' });
        }

        // Build where clause
        const whereClause = { userId };
        if (vehicleIdList) {
            whereClause.vehicleId = vehicleIdList;
        }

        // Fetch Groups matching userId and vehicleIds with date range
        const groups = await Group.findAll({
            where: whereClause,
            include: [
                ...(selectedModels.includes('Refueling') ? [{
                    model: Refueling,
                    attributes: ['amount', 'createdAt'],
                    where: {
                        createdAt: {
                            [Op.between]: [start, end]
                        }
                    },
                    required: false
                }] : []),
                ...(selectedModels.includes('Service') ? [{
                    model: Service,
                    attributes: ['amount', 'createdAt'],
                    where: {
                        createdAt: {
                            [Op.between]: [start, end]
                        }
                    },
                    required: false
                }] : []),
                ...(selectedModels.includes('Accessories') ? [{
                    model: Accessories,
                    attributes: ['amount', 'createdAt'],
                    where: {
                        createdAt: {
                            [Op.between]: [start, end]
                        }
                    },
                    required: false
                }] : []),
                ...(selectedModels.includes('Tax') ? [{
                    model: Tax,
                    attributes: ['amount', 'createdAt'],
                    where: {
                        createdAt: {
                            [Op.between]: [start, end]
                        }
                    },
                    required: false
                }] : []),
                {
                    model: Vehicle,
                    attributes: ['id', 'name']
                }
            ],
            order: [['vehicleId', 'ASC']]
        });

        // Process data per vehicle with selected models
        const vehicleData = {};

        groups.forEach(group => {
            const vehicleId = group.vehicleId;
            const vehicleName = group.Vehicle?.name || "Unknown Vehicle";

            if (!vehicleData[vehicleId]) {
                vehicleData[vehicleId] = {
                    vehicleId,
                    vehicleName,
                    totalAmount: 0,
                    details: {}
                };
            }

            // Sum up amounts for selected models
            if (selectedModels.includes('Refueling')) {
                const refuelingTotal = group.Refuelings.reduce((sum, r) => sum + (r.amount || 0), 0);
                vehicleData[vehicleId].details.refuelingTotal = (vehicleData[vehicleId].details.refuelingTotal || 0) + refuelingTotal;
                vehicleData[vehicleId].totalAmount += refuelingTotal;
            }

            if (selectedModels.includes('Service')) {
                const serviceTotal = group.Services.reduce((sum, s) => sum + (s.amount || 0), 0);
                vehicleData[vehicleId].details.serviceTotal = (vehicleData[vehicleId].details.serviceTotal || 0) + serviceTotal;
                vehicleData[vehicleId].totalAmount += serviceTotal;
            }

            if (selectedModels.includes('Accessories')) {
                const accessoryTotal = group.Accessories.reduce((sum, a) => sum + (a.amount || 0), 0);
                vehicleData[vehicleId].details.accessoryTotal = (vehicleData[vehicleId].details.accessoryTotal || 0) + accessoryTotal;
                vehicleData[vehicleId].totalAmount += accessoryTotal;
            }

            if (selectedModels.includes('Tax')) {
                const taxTotal = group.Taxes.reduce((sum, t) => sum + (t.amount || 0), 0);
                vehicleData[vehicleId].details.taxTotal = (vehicleData[vehicleId].details.taxTotal || 0) + taxTotal;
                vehicleData[vehicleId].totalAmount += taxTotal;
            }
        });

        // Convert object to array
        const result = Object.values(vehicleData);

        res.json(result);
    } catch (error) {
        console.error('Error fetching user vehicle comparison:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};



const getvehicleusercomparison = async (req, res) => {
    try {
        const { vehicleId, userIds, startDate, endDate, models } = req.body;

        // Validate required fields
        if (!vehicleId) {
            return res.status(400).json({ error: 'vehicleId is required' });
        }

        // Handle user IDs
        let userIdList;
        if (!userIds || (Array.isArray(userIds) && userIds.length === 1 && userIds[0] === 'all')) {
            // Fetch all users for the vehicle
            userIdList = null;
        } else if (Array.isArray(userIds) && userIds.length > 0) {
            userIdList = userIds;
        } else {
            return res.status(400).json({ error: 'userIds must be "all" or an array of user IDs' });
        }

        // Validate date range
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Both startDate and endDate are required' });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        if (start > end) {
            return res.status(400).json({ error: 'startDate cannot be later than endDate' });
        }

        // Validate and process models
        const validModels = ['Refueling', 'Service', 'Accessories', 'Tax'];
        let selectedModels;
        
        if (!models || models === 'all') {
            selectedModels = validModels;
        } else if (Array.isArray(models)) {
            selectedModels = models.filter(model => validModels.includes(model));
            if (selectedModels.length === 0) {
                return res.status(400).json({ error: 'No valid models selected' });
            }
        } else {
            return res.status(400).json({ error: 'Models must be "all" or an array of valid model names' });
        }

        // Build where clause
        const whereClause = { vehicleId };
        if (userIdList) {
            whereClause.userId = userIdList;
        }

        // Fetch Groups matching vehicleId and userIds with date range
        const groups = await Group.findAll({
            where: whereClause,
            include: [
                ...(selectedModels.includes('Refueling') ? [{
                    model: Refueling,
                    attributes: ['amount', 'createdAt'],
                    where: {
                        createdAt: {
                            [Op.between]: [start, end]
                        }
                    },
                    required: false
                }] : []),
                ...(selectedModels.includes('Service') ? [{
                    model: Service,
                    attributes: ['amount', 'createdAt'],
                    where: {
                        createdAt: {
                            [Op.between]: [start, end]
                        }
                    },
                    required: false
                }] : []),
                ...(selectedModels.includes('Accessories') ? [{
                    model: Accessories,
                    attributes: ['amount', 'createdAt'],
                    where: {
                        createdAt: {
                            [Op.between]: [start, end]
                        }
                    },
                    required: false
                }] : []),
                ...(selectedModels.includes('Tax') ? [{
                    model: Tax,
                    attributes: ['amount', 'createdAt'],
                    where: {
                        createdAt: {
                            [Op.between]: [start, end]
                        }
                    },
                    required: false
                }] : []),
                {
                    model: User,
                    attributes: ['id', 'name']
                }
            ],
            order: [['userId', 'ASC']]
        });

        // Process data per user with selected models
        const userData = {};

        groups.forEach(group => {
            const userId = group.userId;
            const userName = group.User?.name || "Unknown User";

            if (!userData[userId]) {
                userData[userId] = {
                    userId,
                    userName,
                    totalAmount: 0,
                    details: {}
                };
            }

            // Sum up amounts for selected models
            if (selectedModels.includes('Refueling')) {
                const refuelingTotal = group.Refuelings.reduce((sum, r) => sum + (r.amount || 0), 0);
                userData[userId].details.refuelingTotal = (userData[userId].details.refuelingTotal || 0) + refuelingTotal;
                userData[userId].totalAmount += refuelingTotal;
            }

            if (selectedModels.includes('Service')) {
                const serviceTotal = group.Services.reduce((sum, s) => sum + (s.amount || 0), 0);
                userData[userId].details.serviceTotal = (userData[userId].details.serviceTotal || 0) + serviceTotal;
                userData[userId].totalAmount += serviceTotal;
            }

            if (selectedModels.includes('Accessories')) {
                const accessoryTotal = group.Accessories.reduce((sum, a) => sum + (a.amount || 0), 0);
                userData[userId].details.accessoryTotal = (userData[userId].details.accessoryTotal || 0) + accessoryTotal;
                userData[userId].totalAmount += accessoryTotal;
            }

            if (selectedModels.includes('Tax')) {
                const taxTotal = group.Taxes.reduce((sum, t) => sum + (t.amount || 0), 0);
                userData[userId].details.taxTotal = (userData[userId].details.taxTotal || 0) + taxTotal;
                userData[userId].totalAmount += taxTotal;
            }
        });

        // Convert object to array
        const result = Object.values(userData);

        res.json(result);
    } catch (error) {
        console.error('Error fetching vehicle user comparison:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};


module.exports = {
    getusercomparison,
    getvehiclecomparison,
    getvehicleusercomparison,
    getuservehiclecomparison,
};