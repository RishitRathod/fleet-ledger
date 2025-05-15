const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const portfinder = require('portfinder');
const { connectDB } = require('./config/db');

dotenv.config();
const app = express();

// Configure portfinder
portfinder.basePort = process.env.PORT || 5000;

// Database Connection
const initializeDatabase = async () => {
    try {
        await connectDB();
        console.log('✅ Database connected successfully');
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        process.exit(1);
    }
};

// CORS Configuration
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://fleet-ledger.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        return res.status(200).json({});
    }
    next();
});

// Enable CORS pre-flight for all routes
app.options('*', (req, res) => {
    res.status(200).send();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/invitations', require('./routes/invitationRoutes'));
app.use('/api/vehicles', require('./routes/vehicleroutes'));
app.use('/api/groups', require('./routes/grouproutes'));
app.use('/api/refuelings', require('./routes/refuelingRoutes')); 
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/Accessories', require('./routes/accessoryRoutes'));
app.use('/api/taxes', require('./routes/taxRoutes'));
app.use('/api/category', require('./routes/CategoryRoutes'));
app.use('/api/comparison', require('./routes/comparisonRoutes.js'));


// Start Server
const startServer = async () => {
    await initializeDatabase();
    try {
        const port = await portfinder.getPortPromise();
        app.listen(port, () => {
            console.log(`🚀 Server running on port ${port}`);
        });
    } catch (err) {
        console.error('❌ Server startup error:', err.message);
        process.exit(1);
    }
};

startServer();

module.exports = app; // Export for testing
