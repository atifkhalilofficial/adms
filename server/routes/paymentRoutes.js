const express = require('express');
const router = express.Router();
const { createPayment, getPayments } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getPayments);
router.post('/', authorize('super_admin', 'sales_manager'), createPayment);

module.exports = router;