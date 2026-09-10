const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

router.get('/dashboard-stats', protect, ctrl.getDashboardStats);
router.get('/usage-trends', protect, ctrl.getUsageTrends);
router.get('/low-stock', protect, ctrl.getLowStockSummary);
router.get('/category-breakdown', protect, ctrl.getCategoryBreakdown);
router.post('/generate', protect, authorize('admin', 'sales'), ctrl.generateReport);
router.get('/', protect, ctrl.getReports);
router.get('/:id', protect, ctrl.getReportById);

module.exports = router;