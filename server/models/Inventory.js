const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  quantityInStock: { type: Number, required: true, default: 0 },
  reorderLevel: { type: Number, default: 10 }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);