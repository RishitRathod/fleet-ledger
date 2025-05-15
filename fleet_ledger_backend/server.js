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
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://fleet-ledger.vercel.app', 'https://fleet-ledger-xdjt.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

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