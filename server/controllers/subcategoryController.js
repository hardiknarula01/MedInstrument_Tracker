const Subcategory = require('../models/Subcategory');

// GET /api/subcategories?category=<categoryId>
const getSubcategories = async (req, res) => {
  try {
    const filter = req.query.category ? { category: req.query.category } : {};
    const subcategories = await Subcategory.find(filter).populate('category', 'name');
    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSubcategoryById = async (req, res) => {
  try {
    const sub = await Subcategory.findById(req.params.id).populate('category', 'name');
    if (!sub) return res.status(404).json({ message: 'Subcategory not found' });
    res.json(sub);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createSubcategory = async (req, res) => {
  try {
    const sub = await Subcategory.create(req.body); // { category, name, description }
    res.status(201).json(sub);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateSubcategory = async (req, res) => {
  try {
    const sub = await Subcategory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!sub) return res.status(404).json({ message: 'Subcategory not found' });
    res.json(sub);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteSubcategory = async (req, res) => {
  try {
    const sub = await Subcategory.findByIdAndDelete(req.params.id);
    if (!sub) return res.status(404).json({ message: 'Subcategory not found' });
    res.json({ message: 'Subcategory deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getSubcategories, getSubcategoryById, createSubcategory, updateSubcategory, deleteSubcategory };