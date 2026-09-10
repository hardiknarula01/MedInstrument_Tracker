const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'sales', 'hospital_staff'], default: 'hospital_staff' },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);