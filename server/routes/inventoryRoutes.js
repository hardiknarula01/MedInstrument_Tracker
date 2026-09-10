const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, ctrl.getInventory);
router.get('/:id', protect, ctrl.getInventoryById);
router.put('/:id', protect, authorize('admin'), ctrl.updateInventory);

module.exports = router;