const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/batchController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', ctrl.getBatches);
router.get('/:id', ctrl.getBatchById);
router.post('/', protect, authorize('admin'), ctrl.createBatch);
router.put('/:id', protect, authorize('admin'), ctrl.updateBatch);
router.delete('/:id', protect, authorize('admin'), ctrl.deleteBatch);

module.exports = router;