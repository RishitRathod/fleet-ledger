const User = require('../models/User');
const Group = require('../models/Group');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// const bcrypt = require('bcrypt');

// Import bcrypt helper functions
const { hashPassword, comparePassword } = require('../config/bcryptHelper');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Admin Signup
exports.adminSignup = async (req, res) => {
    try {
        const { name, email, password, groupName } = req.body;

        console.log(`Admin Signup Attempt: ${email}`);

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ success: false, message: "Email already exists" });

        // Create a new group
        const group = new Group({ name: groupName });
        await group.save();

        console.log(`Group Created: ${groupName}, ID: ${group._id}`);

        // Hash password using helper function
        const hashedPassword = await hashPassword(password);

        // Create admin user linked to the group
        user = new User({ name, email, password: hashedPassword, role: 'admin', group: group._id });
        await user.save();

        console.log(`Admin User Created: ${email}, Group: ${group._id}`);

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

        console.log(`User Signup Attempt: ${email}`);

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ success: false, message: "Email already exists" });

        // Verify that the group exists
        // const group = await Group.findById(groupId);
        // if (!group) return res.status(400).json({ success: false, message: "Invalid group ID" });

        // console.log(`Group Verified: ${group.name}, ID: ${groupId}`);

        // Hash password using helper function
        
        const hashedPassword = await hashPassword(password);
        console.log("Hashed Password:", hashedPassword);
        // Create new user linked to the group
        user = new User({ name, email, password: hashedPassword, role: 'user'});
        await user.save();

        // console.log(`User Created: ${email}, Group: ${group._id}`);

        res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (error) {
        console.error('User Signup Error:', error);
        res.status(500).json({ success: false, message: "User signup failed", error: error.message });
    }
};
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("#######Email:", email);
        console.log("##########Password:", password);

        // Normalize email to lowercase
        const normalizedEmail = email.toLowerCase();
        console.log("Normalized Email:", normalizedEmail);

        // Find user in database
        const user = await User.findOne({ email: normalizedEmail });
        console.log("User Retrieved from DB:", user);

        if (!user) {
            console.warn(`Login failed: User with email ${normalizedEmail} not found.`);
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // Validate password by comparing plain password to the hashed password in the database
        const isMatch = await comparePassword(password, user.password);
        console.log("Password Match Result:", isMatch);

        if (!isMatch) {
            console.warn(`Login failed: Incorrect password for email ${normalizedEmail}`);
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = generateToken(user._id);

        console.log(`Login successful: User ${user.email} logged in.`);
        res.status(200).json({
            success: true,
            message: "Login successful",
            jwtToken: token,
            name: user.name || '',
            role: user.role || 'user',
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: "Login failed", error: error.message });
    }
};
