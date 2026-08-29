const express = require('express');
const router = express.Router();
const {
  createWarehouse,
  getWarehouses,
  getWarehouseById,
  updateWarehouse,
  deleteWarehouse,
} = require('../controllers/warehouseController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getWarehouses);
router.get('/:id', getWarehouseById);
router.post('/', authorize('super_admin', 'sales_manager'), createWarehouse);
router.put('/:id', authorize('super_admin', 'sales_manager'), updateWarehouse);
router.delete('/:id', authorize('super_admin'), deleteWarehouse);

module.exports = router;