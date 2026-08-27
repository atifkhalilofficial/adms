const express = require('express');
const router = express.Router();
const {
  createDelivery,
  getDeliveries,
  updateDeliveryStatus,
} = require('../controllers/deliveryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getDeliveries);
router.post('/', authorize('super_admin', 'warehouse_manager'), createDelivery);
router.put('/:id/status', authorize('super_admin', 'warehouse_manager'), updateDeliveryStatus);

module.exports = router;