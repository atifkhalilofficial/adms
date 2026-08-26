const express = require('express');
const router = express.Router();
const { createPurchase, getPurchases } = require('../controllers/purchaseController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getPurchases);
router.post('/', authorize('super_admin', 'warehouse_manager'), createPurchase);

module.exports = router;