const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', ctrl.getCategories);
router.get('/:id', ctrl.getCategoryById);
router.post('/', protect, authorize('admin'), ctrl.createCategory);
router.put('/:id', protect, authorize('admin'), ctrl.updateCategory);
router.delete('/:id', protect, authorize('admin'), ctrl.deleteCategory);

module.exports = router;