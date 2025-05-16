const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sequelize } = require('../config/db');
const Group = require('../models/group');
require('dotenv').config();


const signup = async (req, res) => {
    const transaction = await sequelize.transaction(); // Start transaction
    try {
        const { name, email, password, role } = req.body;

        if (role && !['admin', 'user'].includes(role)) {
            return res.status(400).json({ message: "Invalid role. Choose 'admin' or 'user'." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
        });

        console.log("New User Created:", newUser); // Debugging

        await transaction.commit(); // Commit transaction
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        await transaction.rollback(); // Rollback on failure
        console.error("Signup Error:", {
            message: error.message,
            name: error.name,
            errors: error.errors,
            stack: error.stack
        });
        
        // Check for specific error types
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ 
                message: 'Signup failed', 
                error: 'Email already registered'
            });
        }
        
        if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map(err => ({
                field: err.path,
                message: err.message
            }));
            return res.status(400).json({ 
                message: 'Signup failed', 
                error: 'Validation error',
                details: validationErrors
            });
        }
        
        res.status(500).json({ 
            message: 'Signup failed', 
            error: error.message,
            type: error.name
        });
    }
};

module.exports = { signup };


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
console.log("Login attempt with email:", email);
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        // ✅ Send role along with token
        res.status(200).json({ 
            message: 'Login successful', 
            token, 
            role: user.role 
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};


const googleLogin = async (req, res) => {
    try {
        // User is already authenticated by passport
        const user = req.user;
        
        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        // Return token and user info
        res.status(200).json({
            message: 'Google login successful',
            token,
            role: user.role,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Google login failed', error: error.message });
    }
};

// Verify Google token sent from frontend
const verifyGoogleToken = async (req, res) => {
    try {
        console.log('Google verification request received:', req.body);
        const { credential } = req.body;
        
        if (!credential) {
            return res.status(400).json({ message: 'Google token is required' });
        }
        
        // Log environment variables (without exposing secrets)
        console.log('Google Auth Config in verifyGoogleToken:', {
            clientIDExists: !!process.env.GOOGLE_CLIENT_ID,
            jwtSecretExists: !!process.env.JWT_SECRET
        });
        
        // Verify the token with Google's OAuth2 API
        const { OAuth2Client } = require('google-auth-library');
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        
        console.log('Verifying Google token...');
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        
        const payload = ticket.getPayload();
        console.log('Google token verified successfully, payload:', {
            sub: payload.sub,
            email: payload.email,
            name: payload.name
        });
        
        // Check if user exists with Google ID
        console.log('Checking if user exists with Google ID:', payload.sub);
        let user = await User.findOne({ where: { googleId: payload.sub } });
        
        if (!user) {
            // Check if user with same email exists
            console.log('User not found with Google ID, checking by email:', payload.email);
            user = await User.findOne({ where: { email: payload.email } });
            
            if (user) {
                // Update existing user with Google info
                console.log('User found by email, updating with Google info');
                user.googleId = payload.sub;
                user.authProvider = 'google';
                user.profilePicture = payload.picture;
                await user.save();
            } else {
                // Create new user
                console.log('Creating new user with Google info');
                user = await User.create({
                    name: payload.name,
                    email: payload.email,
                    googleId: payload.sub,
                    profilePicture: payload.picture,
                    authProvider: 'google',
                    role: 'user' // Default role
                });
                console.log('New user created:', user.id);
            }
        } else {
            console.log('User found with Google ID:', user.id);
        }
        
        // Generate JWT token
        console.log('Generating JWT token...');
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        // Return token and user info
        console.log('Google login successful, returning user data');
        res.status(200).json({
            message: 'Google login successful',
            token,
            role: user.role,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        console.error('Google verification error:', error);
        // More detailed error logging
        if (error.stack) {
            console.error('Error stack:', error.stack);
        }
        res.status(500).json({ 
            message: 'Google verification failed', 
            error: error.message,
            details: error.name
        });
    }
};

module.exports = { signup, login, googleLogin, verifyGoogleToken };
