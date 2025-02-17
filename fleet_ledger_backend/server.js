const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const invitationRoutes = require('./routes/invitationRoutes');
// const adminRoutes = require('./routes/adminRoutes');

dotenv.config();
const app = express();

// CORS Configuration
app.use(cors({
    origin: ['http://localhost:5173', 'https://your-production-url.com'],
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
connectDB()
    .then(() => {
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err);
        process.exit(1);
    });

module.exports = app; // Export for testing purposes
