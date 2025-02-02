const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();

// CORS Configuration
app.use(cors({
    origin: 'http://localhost:5173', // Allow your Vite frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Optional: If using cookies or authorization headers
}));

// Middleware
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/invitations', require('./routes/invitationRoutes'));

// Connect to DB & Start Server
connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
