const User = require('../models/User');
const Group = require('../models/Group');
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

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin user linked to the group
        user = new User({ name, email, password: hashedPassword, role: 'admin', group: group._id });
        await user.save();

        res.status(201).json({ success: true, message: "Admin registered successfully", groupId: group._id });
    } catch (error) {
        console.error('Admin Signup Error:', error);
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

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user linked to the group
        user = new User({ name, email, password: hashedPassword, role: 'user'});
        await user.save();

        res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (error) {
        console.error('User Signup Error:', error);
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
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Invalid email or password" });

        // Generate JWT token
        const token = generateToken(user._id);

        res.status(200).json({ 
            success: true, 
            message: "Login successful", 
            jwtToken: token, 
            name: user.name, 
            role: user.role,
            // group: user.group
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: "Login failed", error: error.message });
    }
};
