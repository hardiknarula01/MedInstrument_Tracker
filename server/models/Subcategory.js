const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  name: { type: String, required: true }, // 150 Pack, Pediatric, ECG Cable, etc.
  description: String
}, { timestamps: true });

module.exports = mongoose.model('Subcategory', subcategorySchema);