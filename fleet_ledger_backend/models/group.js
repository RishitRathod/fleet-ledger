const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User'); // Ensure User model is correctly defined
const Vehicle = require('./vehicle'); // Ensure Vehicle model is correctly defined

const Group = sequelize.define('Group', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users', // Ensure this matches your actual User table name
            key: 'id'
        }
    },
    vehicleId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Vehicles', // Ensure this matches your actual Vehicle table name
            key: 'id'
        }
    }
}, {
    timestamps: true,
    tableName: 'Groups', // Ensure correct table name
});

module.exports = Group;
