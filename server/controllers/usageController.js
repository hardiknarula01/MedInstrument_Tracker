const mongoose = require('mongoose');
const UsageRecord = require('../models/UsageRecord');
const Inventory = require('../models/Inventory');

// GET /api/usage?product=&hospital=&from=&to=
const getUsageRecords = async (req, res) => {
  try {
    const { product, hospital, from, to } = req.query;
    const filter = {};
    if (product) filter.product = product;
    if (hospital) filter.hospital = hospital;
    if (from || to) {
      filter.usageDate = {};
      if (from) filter.usageDate.$gte = new Date(from);
      if (to) filter.usageDate.$lte = new Date(to);
    }

    const records = await UsageRecord.find(filter)
      .populate('product', 'name sku')
      .populate('batch', 'batchNumber')
      .populate('hospital', 'name')
      .populate('usedBy', 'name')
      .sort('-usageDate');
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/usage — records usage AND deducts stock atomically
const createUsageRecord = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { product, batch, inventory, hospital, quantityUsed, notes } = req.body;

    const inv = await Inventory.findById(inventory).session(session);
    if (!inv) throw new Error('Inventory record not found');
    if (inv.quantityInStock < quantityUsed) {
      throw new Error(`Insufficient stock: only ${inv.quantityInStock} available`);
    }

    inv.quantityInStock -= quantityUsed;
    await inv.save({ session });

    const record = await UsageRecord.create([{
      product, batch, inventory, hospital, quantityUsed, notes,
      usedBy: req.user._id
    }], { session });

    await session.commitTransaction();
    session.endSession();
    res.status(201).json(record[0]);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getUsageRecords, createUsageRecord };