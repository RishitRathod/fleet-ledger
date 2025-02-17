const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String, required: true },
    status: { type: String, enum: ['pending', 'accepted'], default: 'pending' }
}, { timestamps: true });

const Invitation = mongoose.model('Invitation', invitationSchema);
module.exports = Invitation;
