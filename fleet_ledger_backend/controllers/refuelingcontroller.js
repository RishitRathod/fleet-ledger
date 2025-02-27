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
        const sheetName = "i10 Petrol";
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
