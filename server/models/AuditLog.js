const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  entityType: { type: String, required: true },
  entityId: mongoose.Schema.Types.ObjectId,
  changes: mongoose.Schema.Types.Mixed,
  ipAddress: String
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);