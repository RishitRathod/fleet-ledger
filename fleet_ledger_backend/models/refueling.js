const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Vehicle = require('./vehicle');
const Group = require('./group');

const Refueling = sequelize.define('Refueling', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    pricePerLiter: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    liters: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    kmStart: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    kmEnd: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    totalRun: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    average: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    avgCostPerKm: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    days: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    avgDailyExpense: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    fuelUtilization: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    groupId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Groups',
            key: 'id',
        },
    },
}, {
    timestamps: true,
});

module.exports = Refueling;
