const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); 

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
        allowNull: true, // Allow null for Google auth users
    },
    googleId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    profilePicture: {
        type: DataTypes.STRING,
        allowNull: true
    },
    role: {
        type: DataTypes.ENUM('admin', 'user'),
        allowNull: false,
        defaultValue: 'user'
    },
    authProvider: {
        type: DataTypes.ENUM('local', 'google'),
        allowNull: false,
        defaultValue: 'local'
    }
}, {
    timestamps: true,
    tableName: 'Users' // Ensure correct table name
});

module.exports = User;
