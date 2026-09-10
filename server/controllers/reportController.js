const mongoose = require('mongoose');
const UsageRecord = require('../models/UsageRecord');
const Inventory = require('../models/Inventory');
const Product = require('../models/Product');
const Report = require('../models/Report');

// GET /api/reports/dashboard-stats
// Quick overview numbers for the main dashboard
const getDashboardStats = async (req, res) => {
  try {
    const [totalProducts, lowStockCount, usageThisMonth, totalInventoryValue] = await Promise.all([
      Product.countDocuments({ isActive: true }),

      Inventory.aggregate([
        { $match: { $expr: { $lte: ['$quantityInStock', '$reorderLevel'] } } },
        { $count: 'count' }
      ]),

      UsageRecord.aggregate([
        { $match: { usageDate: { $gte: new Date(new Date().setDate(1)) } } },
        { $group: { _id: null, totalUsed: { $sum: '$quantityUsed' }, records: { $sum: 1 } } }
      ]),

      Inventory.aggregate([
        { $group: { _id: null, totalUnits: { $sum: '$quantityInStock' } } }
      ])
    ]);

    res.json({
      totalProducts,
      lowStockCount: lowStockCount[0]?.count || 0,
      usageThisMonth: usageThisMonth[0]?.totalUsed || 0,
      usageRecordsThisMonth: usageThisMonth[0]?.records || 0,
      totalInventoryUnits: totalInventoryValue[0]?.totalUnits || 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/reports/usage-trends?from=&to=&groupBy=day|month&category=
const getUsageTrends = async (req, res) => {
  try {
    const { from, to, groupBy = 'day', category } = req.query;

    const match = {};
    if (from || to) {
      match.usageDate = {};
      if (from) match.usageDate.$gte = new Date(from);
      if (to) match.usageDate.$lte = new Date(to);
    }

    const dateFormat = groupBy === 'month' ? '%Y-%m' : '%Y-%m-%d';

    const pipeline = [
      { $match: match },
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: '$productInfo' },
      ...(category ? [{ $match: { 'productInfo.category': new mongoose.Types.ObjectId(category) } }] : []),
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: '$usageDate' } },
          totalUsed: { $sum: '$quantityUsed' },
          recordCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ];

    const trends = await UsageRecord.aggregate(pipeline);
    res.json(trends);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/reports/low-stock
const getLowStockSummary = async (req, res) => {
  try {
    const lowStock = await Inventory.aggregate([
      { $match: { $expr: { $lte: ['$quantityInStock', '$reorderLevel'] } } },
      {
        $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'product' }
      },
      { $unwind: '$product' },
      {
        $lookup: { from: 'hospitals', localField: 'hospital', foreignField: '_id', as: 'hospital' }
      },
      { $unwind: { path: '$hospital', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          productName: '$product.name',
          sku: '$product.sku',
          hospitalName: '$hospital.name',
          quantityInStock: 1,
          reorderLevel: 1,
          shortfall: { $subtract: ['$reorderLevel', '$quantityInStock'] }
        }
      },
      { $sort: { shortfall: -1 } }
    ]);
    res.json(lowStock);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/reports/category-breakdown?from=&to=
const getCategoryBreakdown = async (req, res) => {
  try {
    const { from, to } = req.query;
    const match = {};
    if (from || to) {
      match.usageDate = {};
      if (from) match.usageDate.$gte = new Date(from);
      if (to) match.usageDate.$lte = new Date(to);
    }

    const breakdown = await UsageRecord.aggregate([
      { $match: match },
      {
        $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'product' }
      },
      { $unwind: '$product' },
      {
        $lookup: { from: 'categories', localField: 'product.category', foreignField: '_id', as: 'category' }
      },
      { $unwind: '$category' },
      {
        $group: {
          _id: '$category._id',
          categoryName: { $first: '$category.name' },
          totalUsed: { $sum: '$quantityUsed' },
          recordCount: { $sum: 1 }
        }
      },
      { $sort: { totalUsed: -1 } }
    ]);
    res.json(breakdown);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/reports/generate — snapshots a report into the DB
const generateReport = async (req, res) => {
  try {
    const { title, type, dateRange } = req.body;

    let data;
    switch (type) {
      case 'usage':
        data = await UsageRecord.find(
          dateRange ? { usageDate: { $gte: dateRange.from, $lte: dateRange.to } } : {}
        ).populate('product', 'name sku');
        break;
      case 'inventory':
        data = await Inventory.find().populate('product', 'name sku');
        break;
      default:
        data = req.body.data || {};
    }

    const report = await Report.create({
      title, type, dateRange, data, generatedBy: req.user._id
    });

    res.status(201).json(report);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/reports
const getReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('generatedBy', 'name').sort('-createdAt');
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/reports/:id
const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate('generatedBy', 'name');
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getDashboardStats, getUsageTrends, getLowStockSummary,
  getCategoryBreakdown, generateReport, getReports, getReportById
};