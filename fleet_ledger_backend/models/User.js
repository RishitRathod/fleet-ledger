const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); 
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
        allowNull: true,
        references: {
            model: Group,  // Use direct model reference
            key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    }
}, {
    timestamps: true,
    tableName: 'Users' // Ensure correct table name
});

module.exports = User;
