const { sequelize, connectDB } = require('./config/db'); // Import db.js

async function syncDB() {
  try {
    await connectDB(); // First, establish a connection
    console.log("🔄 Syncing database...");
    await sequelize.sync({ force: false }); // force: true will reset tables
    console.log("✅ Database synchronized successfully!");
  } catch (error) {
    console.error("❌ Error syncing database:", error);
  }
}

syncDB();
