const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/usageController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, ctrl.getUsageRecords);
router.post('/', protect, authorize('admin', 'sales', 'hospital_staff'), ctrl.createUsageRecord);

module.exports = router;