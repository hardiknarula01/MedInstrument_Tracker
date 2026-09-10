const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['inventory', 'usage', 'sales', 'custom'], required: true },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dateRange: { from: Date, to: Date },
  data: mongoose.Schema.Types.Mixed
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);