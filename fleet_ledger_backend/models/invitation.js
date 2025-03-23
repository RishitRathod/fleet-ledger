const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); 
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
            model: User, // Use direct model reference
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
        defaultValue: 'pending',
    }
}, {
    timestamps: true,
    tableName: 'Invitations' // Ensure correct table name
});

module.exports = Invitation;
