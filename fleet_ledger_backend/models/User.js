const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // ✅ Ensure correct import
const Group = require('./group'); // Import Group model

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('admin', 'user'),
        allowNull: false,
        defaultValue: 'user'
    },
    groupId: {
        type: DataTypes.UUID,
        references: {
            model: 'Groups', // ✅ Ensure correct table name
            key: 'id'
        },
        allowNull: true,
        defaultValue: null
    }
}, {
    timestamps: true,
});

module.exports = User;
