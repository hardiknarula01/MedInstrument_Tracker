const Product = require('../models/Product');

// GET /api/products?category=&subcategory=&search=
const getProducts = async (req, res) => {
  try {
    const { category, subcategory, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const products = await Product.find(filter)
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .sort('name');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate('subcategory', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };