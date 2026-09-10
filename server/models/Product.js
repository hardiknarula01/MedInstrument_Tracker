const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // denormalized for fast filtering
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true },
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  description: String,
  unit: { type: String, default: 'pcs' },
  price: Number,
  specifications: mongoose.Schema.Types.Mixed,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);