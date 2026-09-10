const Inventory = require('../models/Inventory');

// GET /api/inventory?product=&hospital=&lowStock=true
const getInventory = async (req, res) => {
  try {
    const { product, hospital, lowStock } = req.query;
    const filter = {};
    if (product) filter.product = product;
    if (hospital) filter.hospital = hospital;

    let query = Inventory.find(filter)
      .populate('product', 'name sku')
      .populate('batch', 'batchNumber expiryDate')
      .populate('hospital', 'name');

    let results = await query;

    if (lowStock === 'true') {
      results = results.filter(inv => inv.quantityInStock <= inv.reorderLevel);
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getInventoryById = async (req, res) => {
  try {
    const inv = await Inventory.findById(req.params.id)
      .populate('product', 'name sku')
      .populate('batch', 'batchNumber expiryDate')
      .populate('hospital', 'name');
    if (!inv) return res.status(404).json({ message: 'Inventory record not found' });
    res.json(inv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/inventory/:id  — manual stock adjustment (e.g. correction, damage)
const updateInventory = async (req, res) => {
  try {
    const inv = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!inv) return res.status(404).json({ message: 'Inventory record not found' });
    res.json(inv);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getInventory, getInventoryById, updateInventory };