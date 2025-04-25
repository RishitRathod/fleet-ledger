const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Vehicle = require('./vehicle');
const Group = require('./group');

const Accessories = sequelize.define('Accessories', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    // date: {
    //     type: DataTypes.DATE,
    //     allowNull: true,
    // },
    accessory_type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    description : {
        type: DataTypes.STRING,
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

module.exports = Accessories;
