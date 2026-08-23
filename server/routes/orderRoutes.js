const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/', authorize('super_admin', 'sales_manager', 'sales_rep'), createOrder);
router.put('/:id/status', authorize('super_admin', 'sales_manager'), updateOrderStatus);

module.exports = router;