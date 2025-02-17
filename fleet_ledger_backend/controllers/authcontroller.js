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
        let groupId = null;

        // If the user is an admin, create a group
        if (role === 'admin') {
            const newGroup = await Group.create({ name: `${name}'s Group` }, { transaction });
            console.log("New Group Created:", newGroup); // Debugging
            groupId = newGroup.id; // Assign groupId from created group
        }

        console.log("groupId before user creation:", groupId);

        // Create the user with the assigned groupId
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
            groupId: groupId || null, // Ensure null if not admin
        }, { transaction });

        console.log("New User Created:", newUser); // Debugging

        await transaction.commit(); // Commit transaction
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        await transaction.rollback(); // Rollback on failure
        console.error("Signup Error:", error); // Debugging
        res.status(500).json({ message: 'Signup failed', error: error.message });
    }
};

module.exports = { signup };



const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};

module.exports = { signup, login };
