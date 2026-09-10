const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['hospital', 'clinic', 'distributor'], default: 'hospital' },
  address: String,
  contactPerson: String,
  phone: String,
  email: String
}, { timestamps: true });

module.exports = mongoose.model('Hospital', hospitalSchema);