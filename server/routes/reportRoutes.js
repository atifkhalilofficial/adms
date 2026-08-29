const express = require('express');
const router = express.Router();
const { exportOrdersExcel, exportOrdersPDF } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/orders/excel', authorize('super_admin', 'sales_manager'), exportOrdersExcel);
router.get('/orders/pdf', authorize('super_admin', 'sales_manager'), exportOrdersPDF);

module.exports = router;