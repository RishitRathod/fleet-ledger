const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const portfinder = require('portfinder');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const invitationRoutes = require('./routes/invitationRoutes');

dotenv.config();
const app = express();

// Configure portfinder
portfinder.basePort = process.env.PORT || 5000;

// CORS Configuration
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', // Use env for security
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

// Middleware
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/invitations', invitationRoutes);

// Start Server
const startServer = async () => {
    try {
        await connectDB();
        const port = await portfinder.getPortPromise();
        app.listen(port, () => {
            console.log(`✅ Server running on port ${port}`);
        });
    } catch (err) {
        console.error('❌ Server startup error:', err.message);
        process.exit(1);
    }
};

startServer();

module.exports = app; // Export for testing
