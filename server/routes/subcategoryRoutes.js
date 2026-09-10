const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/subcategoryController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', ctrl.getSubcategories);
router.get('/:id', ctrl.getSubcategoryById);
router.post('/', protect, authorize('admin'), ctrl.createSubcategory);
router.put('/:id', protect, authorize('admin'), ctrl.updateSubcategory);
router.delete('/:id', protect, authorize('admin'), ctrl.deleteSubcategory);

module.exports = router;