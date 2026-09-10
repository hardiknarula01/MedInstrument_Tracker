const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // ABG Reagent Pack, Circuit, etc.
  description: String,
  icon: String
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);