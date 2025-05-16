const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const portfinder = require('portfinder');
const passport = require('passport');
const session = require('express-session');
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

const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://fleet-ledger.vercel.app',
    'https://fleet-ledger-xdjt.onrender.com'
  ];
  


  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn('❌ Blocked by CORS:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));
  

// Middleware
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.JWT_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Initialize Passport and session
require('./auth/google'); // Load Google authentication strategy
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/invitations', require('./routes/invitationRoutes'));
app.use('/api/vehicles', require('./routes/vehicleroutes'));
app.use('/api/groups', require('./routes/grouproutes'));
app.use('/api/refuel', require('./routes/refuelingRoutes'));
app.use('/api/refuelings', require('./routes/refurlingRoutes'));
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