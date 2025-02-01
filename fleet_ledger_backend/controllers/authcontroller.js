const User = require('../models/user.js');
const Group = require('../models/group.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Admin Signup
exports.adminSignup = async (req, res) => {
    try {
        const { name, email, password, groupName } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ success: false, message: "Email already exists" });

        // Create a new group
        const group = new Group({ name: groupName });
        await group.save();

        // Create admin user linked to the group
        user = new User({ name, email, password, role: 'admin', group: group._id });
        await user.save();

        res.status(201).json({ success: true, message: "Admin registered successfully", groupId: group._id });
    } catch (error) {
        res.status(500).json({ success: false, message: "Admin signup failed", error: error.message });
    }
};

// User Signup (by Admin)
exports.userSignup = async (req, res) => {
    try {
        const { name, email, password, groupId } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ success: false, message: "Email already exists" });

        // Create new user linked to the group
        user = new User({ name, email, password, role: 'user' });
        await user.save();

        res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "User signup failed", error: error.message });
    }
};

// User Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email }).populate('group', 'name');
        if (!user) return res.status(400).json({ success: false, message: "Invalid email or password" });

        // Validate password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Invalid email or password" });

        // Generate JWT token
        const token = generateToken(user._id);

        // Determine redirection based on role
        // const redirectUrl = user.role === 'admin' ? '/admindashboard' : '/userdashboard';

        res.status(200).json({ 
            success: true, 
            message: "Login successful", 
            jwtToken: token, 
            name: user.name, 
            role: user.role, 
            // group: user.group, 
            // redirectUrl: redirectUrl
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Login failed", error: error.message });
    }
};
