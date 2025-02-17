const { sequelize } = require('../config/db');
const User = require('./User');
const Group = require('./group');
const Invitation = require('./invitation');

// ✅ Define associations after all models are imported
User.belongsTo(Group, { foreignKey: 'groupId', onDelete: 'SET NULL' });
Group.hasMany(User, { foreignKey: 'groupId', onDelete: 'CASCADE' });

User.hasMany(Invitation, { foreignKey: 'adminId', onDelete: 'CASCADE' });
Invitation.belongsTo(User, { foreignKey: 'adminId', onDelete: 'CASCADE' });

module.exports = { sequelize, User, Group, Invitation };
