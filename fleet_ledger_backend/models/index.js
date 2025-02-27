const { sequelize } = require('../config/db');
const User = require('./User');
const Group = require('./group'); // Ensure correct capitalization
const Vehicle = require('./vehicle');
const Invitation = require('./invitation');
const Refueling = require('./refueling'); // Import Refueling model

// ✅ Define associations after all models are imported

// 🚗 Vehicle & Group Relationship (Each Group is linked to a Vehicle)
Vehicle.hasMany(Group, { foreignKey: 'vehicleId', onDelete: 'CASCADE' });
Group.belongsTo(Vehicle, { foreignKey: 'vehicleId', onDelete: 'CASCADE' });

// 👥 User & Group Relationship (Each User belongs to a Group)
// User.belongsTo(Group, { foreignKey: 'groupId', onDelete: 'SET NULL' });
// Group.hasMany(User, { foreignKey: 'groupId', onDelete: 'CASCADE' });

// ✉️ User & Invitation Relationship (Admin sends Invitations)
User.hasMany(Invitation, { foreignKey: 'adminId', onDelete: 'CASCADE' });
Invitation.belongsTo(User, { foreignKey: 'adminId', onDelete: 'CASCADE' });

// ⛽ Vehicle & Refueling Relationship (Each refueling entry belongs to a Vehicle & Group)
// Vehicle.hasMany(Refueling, { foreignKey: 'vehicleId', onDelete: 'CASCADE' });
Group.hasMany(Refueling, { foreignKey: 'groupId', onDelete: 'CASCADE' });
// Refueling.belongsTo(Vehicle, { foreignKey: 'vehicleId', onDelete: 'CASCADE' });
Refueling.belongsTo(Group, { foreignKey: 'groupId', onDelete: 'CASCADE' });

module.exports = { sequelize, User, Group, Vehicle, Invitation, Refueling };