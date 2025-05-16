const xlsx = require('xlsx');
const { Sequelize, Op } = require('sequelize');
const { sequelize } = require('../config/db');
const { Refueling, Group, User } = require('../models');
exports.uploadExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "❌ No file uploaded." });
        }

        console.log("✅ File received:", req.file.originalname);

        const { groupId, sheetName } = req.body;
        if (!groupId || !sheetName) {
            return res.status(400).json({ message: "❌ Missing groupId or sheetName in request." });
        }

        // Read Excel file from buffer
        const workbook = xlsx.read(req.file.buffer, { type: "buffer" });

        // Ensure the selected sheet exists
        if (!workbook.SheetNames.includes(sheetName)) {
            return res.status(400).json({ message: `❌ Sheet '${sheetName}' not found in Excel file.` });
        }

        const worksheet = workbook.Sheets[sheetName];

        // Convert Excel data to JSON
        const jsonData = xlsx.utils.sheet_to_json(worksheet);
        if (jsonData.length === 0) {
            return res.status(400).json({ message: "❌ Excel sheet is empty." });
        }

        console.log("✅ Extracted Data:", jsonData);

        // Ensure groupId is valid
        const groupExists = await Group.findByPk(groupId);
        if (!groupExists) {
            return res.status(400).json({ message: "❌ Invalid groupId. Group does not exist." });
        }

        // Function to parse and validate dates
        const parseDate = (dateValue) => {
            if (!dateValue) return null;

            // If it's an Excel serial number (number), convert accordingly
            if (typeof dateValue === 'number') {
                return new Date(Math.round((dateValue - 25569) * 86400 * 1000)); // Excel epoch starts at 1900-01-01
            }

            // Try parsing if it's a string like '3-Oct-14'
            const parsedDate = new Date(dateValue);
            return isNaN(parsedDate.getTime()) ? null : parsedDate;
        };

        // Format Data for Insertion
        const records = jsonData.map(row => ({
            groupId,
            date: parseDate(row['Date']),
            pricePerLiter: row['P. Price'] || 0,
            amount: row['Amount'] || 0,
            liters: row['Liters'] || 0,
            kmStart: row['KM Start'] || 0,
            kmEnd: row['KM End'] || 0,
            totalRun: row['Total Run'] || 0,
            average: row['Average'] || 0,
            avgCostPerKm: row['Avg. Cost Per KM'] || 0,
            location: row['Where?'] || "Unknown",
            days: row['Days'] || 0,
            avgDailyExpense: row['Avg. Daily Rs.'] || 0,
            fuelUtilization: row['Fuel Utilize %'] || 0,
        }));

        console.log("✅ Parsed records ready for insertion:", records);

        // Start transaction
        const transaction = await sequelize.transaction();
        try {
            await Refueling.bulkCreate(records, { transaction });
            await transaction.commit();
            console.log(`✅ Successfully inserted ${records.length} records.`);
            return res.status(200).json({ message: "✅ Data uploaded successfully!", recordsInserted: records.length });
        } catch (error) {
            await transaction.rollback();
            console.error("❌ Database transaction failed:", error);
            return res.status(500).json({ message: "❌ Database transaction failed.", error: error.message });
        }
    } catch (error) {
        console.error("❌ Error processing file:", error);
        return res.status(500).json({ message: "❌ Error processing file.", error: error.message });
    }  
};


exports.addFuelEntry = async (req, res) => {
    try {
        console.log("📥 Received request body:", req.body); // Log the incoming request data

        const { email, vehicleId, fuelType, liters, pricePerLiter, kmStart, kmEnd, location, days, date } = req.body;

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find group where user and vehicle match
        const group = await Group.findOne({
            where: {
                userId: user.id,
                vehicleId: vehicleId
            }
        });

        if (!group) {
            return res.status(404).json({ message: 'Group not found for this user and vehicle combination' });
        }

        const groupId = group.id;
        
        // 1️⃣ Validate required fields
        if (!groupId || !fuelType || !liters || !pricePerLiter || !date) {
            return res.status(400).json({ message: "❌ Missing required fields (groupId, fuelType, liters, pricePerLiter, date)" });
        }

        // Validate date format (YYYY-MM-DD)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({ message: "❌ Invalid date format. Use YYYY-MM-DD" });
        }

        // Validate date is not in the future
        const currentDate = new Date();
        const inputDate = new Date(date);
        if (inputDate > currentDate) {
            return res.status(400).json({ message: "❌ Date cannot be in the future" });
        }

        // 2️⃣ Check if groupId exists
        console.log("🔍 Checking if group exists for groupId:", groupId);
        const groupExists = await Group.findByPk(groupId);
        if (!groupExists) {
            console.log("❌ Invalid groupId. Group does not exist.");
            return res.status(400).json({ message: "❌ Invalid groupId. Group does not exist." });
        }
        console.log("✅ Group exists:", groupExists.dataValues);

        // 3️⃣ Calculate derived values
        console.log("🧮 Calculating derived values...");
        const amount = liters * pricePerLiter;
        console.log("💰 Total amount:", amount);

        const totalRun = kmEnd && kmStart ? kmEnd - kmStart : 0;
        console.log("🚗 Total run:", totalRun);

        const average = totalRun > 0 ? (liters / totalRun) * 100 : 0;
        console.log("⛽ Average fuel consumption per 100km:", average);

        const avgCostPerKm = totalRun > 0 ? amount / totalRun : 0;
        console.log("💸 Average cost per km:", avgCostPerKm);

        const avgDailyExpense = days > 0 ? amount / days : 0;
        console.log("📅 Average daily expense:", avgDailyExpense);

        const fuelUtilization = totalRun > 0 ? (liters / totalRun) * 100 : 0;
        console.log("⚡ Fuel utilization:", fuelUtilization);

        // 4️⃣ Create fuel entry
        console.log("📝 Creating fuel entry in the database...");
        const fuelEntry = await Refueling.create({
            groupId,
            fuelType,
            liters,
            pricePerLiter,
            amount,
            kmStart: kmStart || 0,
            kmEnd: kmEnd || 0,
            totalRun,
            average,
            avgCostPerKm,
            location: location || "Unknown",
            days: days || 0,
            avgDailyExpense,
            fuelUtilization,
            date: inputDate
        });

        console.log("✅ Fuel entry recorded successfully:", fuelEntry.dataValues);
        return res.status(200).json({ message: "✅ Fuel entry added successfully!", data: fuelEntry });

    } catch (error) {
        console.error("❌ Error processing fuel entry:", error);
        return res.status(500).json({ message: "❌ Error processing fuel entry.", error: error.message });
    }
};

// Get all refueling entries
exports.getAllRefuelingEntries = async (req, res) => {
    try {
        const { groupId } = req.query;
        console.log(groupId);
        if (!groupId) {
            return res.status(400).json({ message: "❌ Missing groupId in request." });
        }

        const entries = await Refueling.findAll({
            where: { groupId },
            // order: [['date', 'DESC']]
        });

        return res.status(200).json({
            success: true,
            data: entries
        });
    } catch (error) {
        console.error("Error fetching refueling entries:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching refueling entries",
            error: error.message
        });
    }
};

// Get refueling entries by date range
exports.getRefuelingByDateRange = async (req, res) => {
    try {
        const { startDate, endDate, groupId } = req.query;
        console.log("Start Date:", startDate); // Debug log
        console.log("End Date:", endDate); // Debug log
        
        if (!startDate || !endDate) {
            return res.status(400).json({ error: "Start date and end date are required" });
        }

        // Validate date formats
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
            return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD" });
        }

        const whereClause = {
            date: {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            }
        };

        if (groupId) {
            whereClause.groupId = groupId;
        }

        const refuelings = await Refueling.findAll({
            where: whereClause,
            include: [{ model: Group }],
            order: [['date', 'ASC']]
        });

        console.log("Found refuelings:", refuelings.length); // Debug log
        res.status(200).json(refuelings);
    } catch (error) {
        console.error("Error in getRefuelingByDateRange:", error);
        res.status(500).json({ error: error.message });
    }
};

// Delete a refueling entry by ID
exports.deleteRefuelingEntry = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ 
                success: false,
                message: "❌ Missing refueling entry ID in request."
            });
        }

        console.log(`🗑️ Attempting to delete refueling entry with ID: ${id}`);
        
        // Find the entry first to confirm it exists
        const refuelingEntry = await Refueling.findByPk(id);
        
        if (!refuelingEntry) {
            // Try to find by different ID formats (in case of UUID vs numeric ID issues)
            const allRefuelings = await Refueling.findAll();
            console.log(`Searching through ${allRefuelings.length} refueling entries for ID: ${id}`);
            
            // Log the first few entries to debug
            if (allRefuelings.length > 0) {
                console.log('Sample refueling IDs:', allRefuelings.slice(0, 3).map(r => r.id));
            }
            
            return res.status(404).json({
                success: false,
                message: `❌ Refueling entry with ID ${id} not found.`
            });
        }
        
        // Delete the entry
        await refuelingEntry.destroy();
        
        console.log(`✅ Successfully deleted refueling entry with ID: ${id}`);
        
        return res.status(200).json({
            success: true,
            message: "✅ Refueling entry deleted successfully!"
        });
    } catch (error) {
        console.error("❌ Error deleting refueling entry:", error);
        return res.status(500).json({
            success: false,
            message: "❌ Error deleting refueling entry.",
            error: error.message
        });
    }
};

// Update a refueling entry by ID
exports.updateRefuelingEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        if (!id) {
            return res.status(400).json({ 
                success: false,
                message: "❌ Missing refueling entry ID in request."
            });
        }

        console.log(`📝 Attempting to update refueling entry with ID: ${id}`);
        console.log('Update data:', updateData);
        
        // Find the entry first to confirm it exists
        const refuelingEntry = await Refueling.findByPk(id);
        
        if (!refuelingEntry) {
            return res.status(404).json({
                success: false,
                message: `❌ Refueling entry with ID ${id} not found.`
            });
        }
        
        // Calculate derived values if necessary fields are provided
        if (updateData.kmStart !== undefined && updateData.kmEnd !== undefined && updateData.liters !== undefined) {
            const totalRun = updateData.kmEnd - updateData.kmStart;
            updateData.totalRun = totalRun;
            
            if (totalRun > 0) {
                updateData.average = (updateData.liters / totalRun) * 100;
            }
        }
        
        if (updateData.liters !== undefined && updateData.pricePerLiter !== undefined) {
            updateData.amount = updateData.liters * updateData.pricePerLiter;
        }
        
        if (updateData.amount !== undefined && updateData.totalRun !== undefined && updateData.totalRun > 0) {
            updateData.avgCostPerKm = updateData.amount / updateData.totalRun;
        }
        
        if (updateData.amount !== undefined && updateData.days !== undefined && updateData.days > 0) {
            updateData.avgDailyExpense = updateData.amount / updateData.days;
        }
        
        // Update the entry
        await refuelingEntry.update(updateData);
        
        console.log(`✅ Successfully updated refueling entry with ID: ${id}`);
        
        return res.status(200).json({
            success: true,
            message: "✅ Refueling entry updated successfully!",
            data: refuelingEntry
        });
    } catch (error) {
        console.error("❌ Error updating refueling entry:", error);
        return res.status(500).json({
            success: false,
            message: "❌ Error updating refueling entry.",
            error: error.message
        });
    }
};
