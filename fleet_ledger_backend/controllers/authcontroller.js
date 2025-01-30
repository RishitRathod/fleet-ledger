const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// User Signup
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ success: false, message: "Email already exists" });

        // Create new user
        user = new User({ name, email, password });
        await user.save();

        res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Signup failed", error: error.message });
    }
};

// User Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ success: false, message: "Invalid email or password" });

        // Validate password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Invalid email or password" });

        // Generate JWT token
        const token = generateToken(user._id);

        res.status(200).json({ success: true, message: "Login successful", jwtToken: token, name: user.name });
    } catch (error) {
        res.status(500).json({ success: false, message: "Login failed", error: error.message });
    }
};
