const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  batchNumber: { type: String, required: true },
  manufactureDate: Date,
  expiryDate: Date,
  quantityReceived: { type: Number, required: true },
  status: { type: String, enum: ['active', 'expired', 'recalled'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Batch', batchSchema);