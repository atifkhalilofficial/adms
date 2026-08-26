const express = require('express');
const router = express.Router();
const { createSupplier, getSuppliers } = require('../controllers/supplierController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getSuppliers);
router.post('/', authorize('super_admin', 'warehouse_manager'), createSupplier);

module.exports = router;