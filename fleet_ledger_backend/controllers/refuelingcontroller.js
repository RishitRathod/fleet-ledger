const xlsx = require('xlsx');
const { sequelize } = require('../config/db');
const Refueling = require('../models/refueling');
exports.uploadExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "❌ No file uploaded." });
        }

        console.log("✅ File received:", req.file.originalname);

        const { groupId } = req.body;
        if (!groupId) {
            return res.status(400).json({ message: "❌ Missing groupId in request." });
        }

        // Read Excel file from buffer
        const workbook = xlsx.read(req.file.buffer, { type: "buffer" });

        // Ensure "i10 Petrol" sheet exists
        const sheetName = "Rapid Diesel";
        if (!workbook.SheetNames.includes(sheetName)) {
            return res.status(400).json({ message: "❌ 'i10 Petrol' sheet not found in Excel file." });
        }

        const worksheet = workbook.Sheets[sheetName];

        // Convert Excel data to JSON
        const jsonData = xlsx.utils.sheet_to_json(worksheet);
        if (jsonData.length === 0) {
            return res.status(400).json({ message: "❌ Excel sheet is empty." });
        }

        console.log("✅ Extracted Data:", jsonData);

        // Ensure groupId is valid
        const groupExists = await sequelize.models.Group.findByPk(groupId);
        if (!groupExists) {
            return res.status(400).json({ message: "❌ Invalid groupId. Group does not exist." });
        }

        // Function to parse and validate dates
        // const parseDate = (dateValue) => {
        //     if (!dateValue) return null; // If empty, return null (assuming NULL is allowed in DB)

        //     const parsedDate = new Date(dateValue);
        //     return isNaN(parsedDate.getTime()) ? null : parsedDate; // Check for invalid date
        // };

        // Format Data for Insertion
        const records = jsonData.map(row => ({
            groupId,
            // date: parseDate(row['Date']),
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

        const { groupId, fuelType, liters, pricePerLiter, kmStart, kmEnd, location, days } = req.body;
        
        // 1️⃣ Validate required fields
        if (!groupId || !fuelType || !liters || !pricePerLiter) {
            console.log("❌ Missing required fields:", { groupId, fuelType, liters, pricePerLiter });
            return res.status(400).json({ message: "❌ Missing required fields." });
        }

        // 2️⃣ Check if groupId exists
        console.log("🔍 Checking if group exists for groupId:", groupId);
        const groupExists = await sequelize.models.Group.findByPk(groupId);
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
