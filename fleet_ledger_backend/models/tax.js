const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Group = require('./group');

const Tax = sequelize.define('Tax', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    taxType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    groupId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Groups',
            key: 'id'
        }
    }
});

Tax.belongsTo(Group, { foreignKey: 'groupId' });
Group.hasMany(Tax, { foreignKey: 'groupId' });

module.exports = Tax;
