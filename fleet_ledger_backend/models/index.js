const { sequelize } = require('../config/db');
const User = require('./User');
const Group = require('./group'); // Ensure correct capitalization
const Vehicle = require('./vehicle');
const Invitation = require('./invitation');
const Refueling = require('./refueling'); // Import Refueling model
const Service = require('./service'); // Import Service model
const Accessories = require('./accessories'); // Import Accessories model
const Tax = require('./tax'); // Add Tax import
// ✅ Define associations after all models are imported

// 🚗 Vehicle & Group Relationship (Each Group is linked to a Vehicle)
Vehicle.hasMany(Group, { foreignKey: 'vehicleId', onDelete: 'CASCADE' });
Group.belongsTo(Vehicle, { foreignKey: 'vehicleId', onDelete: 'CASCADE' });

// 👥 User & Group Relationship (Each User can have multiple Groups)
User.hasMany(Group, { foreignKey: 'userId', onDelete: 'CASCADE' });
Group.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

// ✉️ User & Invitation Relationship (Admin sends Invitations)
User.hasMany(Invitation, { foreignKey: 'adminId', onDelete: 'CASCADE' });
Invitation.belongsTo(User, { foreignKey: 'adminId', onDelete: 'CASCADE' });

// ⛽ Vehicle & Refueling Relationship (Each refueling entry belongs to a Vehicle & Group)
// Vehicle.hasMany(Refueling, { foreignKey: 'vehicleId', onDelete: 'CASCADE' });
Group.hasMany(Refueling, { foreignKey: 'groupId', onDelete: 'CASCADE' });
Refueling.belongsTo(Group, { foreignKey: 'groupId', onDelete: 'CASCADE' });


Group.hasMany(Service, { foreignKey: 'groupId', onDelete: 'CASCADE' });
Service.belongsTo(Group, { foreignKey: 'groupId', onDelete: 'CASCADE' });


Group.hasMany(Accessories, { foreignKey: 'groupId', onDelete: 'CASCADE' });
Accessories.belongsTo(Group, { foreignKey: 'groupId', onDelete: 'CASCADE' });

// Add Tax associations
Group.hasMany(Tax, { foreignKey: 'groupId', onDelete: 'CASCADE' });
Tax.belongsTo(Group, { foreignKey: 'groupId', onDelete: 'CASCADE' });

module.exports = {
    sequelize,
    User,
    Group,
    Vehicle,
    Invitation,
    Refueling,
    Service,
    Accessories,
    Tax // Add Tax to exports
};