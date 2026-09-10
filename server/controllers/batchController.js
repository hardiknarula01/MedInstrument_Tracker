const Batch = require('../models/Batch');
const Inventory = require('../models/Inventory');

// GET /api/batches?product=
const getBatches = async (req, res) => {
  try {
    const filter = req.query.product ? { product: req.query.product } : {};
    const batches = await Batch.find(filter).populate('product', 'name sku');
    res.json(batches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getBatchById = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id).populate('product', 'name sku');
    if (!batch) return res.status(404).json({ message: 'Batch not found' });
    res.json(batch);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/batches  — creates batch AND its inventory record together
const createBatch = async (req, res) => {
  try {
    const { product, batchNumber, manufactureDate, expiryDate, quantityReceived, hospital, reorderLevel } = req.body;

    const batch = await Batch.create({ product, batchNumber, manufactureDate, expiryDate, quantityReceived });

    const inventory = await Inventory.create({
      product,
      batch: batch._id,
      hospital,
      quantityInStock: quantityReceived,
      reorderLevel: reorderLevel || 10
    });

    res.status(201).json({ batch, inventory });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateBatch = async (req, res) => {
  try {
    const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!batch) return res.status(404).json({ message: 'Batch not found' });
    res.json(batch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteBatch = async (req, res) => {
  try {
    const batch = await Batch.findByIdAndDelete(req.params.id);
    if (!batch) return res.status(404).json({ message: 'Batch not found' });
    await Inventory.deleteMany({ batch: batch._id });
    res.json({ message: 'Batch and related inventory deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getBatches, getBatchById, createBatch, updateBatch, deleteBatch };