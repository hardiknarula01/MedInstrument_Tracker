const mongoose = require('mongoose');

const usageRecordSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  inventory: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  quantityUsed: { type: Number, required: true },
  usedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  usageDate: { type: Date, default: Date.now },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('UsageRecord', usageRecordSchema);