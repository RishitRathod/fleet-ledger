const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // ✅ Ensure correct import
const User = require('./User'); // Import User model

const Invitation = sequelize.define('Invitation', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    adminId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users', // ✅ Ensure correct table name
            key: 'id'
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
        defaultValue: 'pending',
    }
}, {
    timestamps: true,
});

module.exports = Invitation;
