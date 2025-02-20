const { sequelize, connectDB } = require('./config/db'); // Import database
require('./models/User'); // Ensure models are imported before syncing
require('./models/group');
require('./models/invitation');

async function syncDB() {
    try {
        await connectDB(); // Establish a connection first
        console.log("🔄 Syncing database...");
        await sequelize.sync({ alter: true }); // Use alter instead of force: true to avoid data loss
        console.log("✅ Database synchronized successfully!");
    } catch (error) {
        console.error("❌ Error syncing database:", error);
    }
}

syncDB();
