const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },  // Role added
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },     // Reference to Group
}, { timestamps: true });



const User = mongoose.model('User', userSchema);
module.exports = User;
