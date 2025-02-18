const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const portfinder = require('portfinder');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const invitationRoutes = require('./routes/invitationRoutes');
// const adminRoutes = require('./routes/adminRoutes');

dotenv.config();
const app = express();

// Configure portfinder
portfinder.basePort = 5000;  // start searching from port 5000

// CORS Configuration
app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

// Middleware
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
// app.use('/api/users', userRoutes);
app.use('/api/invitations', invitationRoutes);
// app.use('/api/admin', adminRoutes);

// Connect to PostgreSQL using Sequelize
const startServer = async () => {
    try {
        await connectDB();
        const port = await portfinder.getPortPromise();
        const server = app.listen(port, () => {
            console.log(`✅ Server running on port ${port}`);
        });

        server.on('error', (error) => {
            console.error('❌ Server error:', error);
            process.exit(1);
        });
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
};

startServer();

module.exports = app; // Export for testing purposes
