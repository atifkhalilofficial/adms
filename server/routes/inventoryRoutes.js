const express = require('express');
const router = express.Router();
const { createTransaction, getTransactions } = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getTransactions);
router.post('/', authorize('super_admin', 'warehouse_manager'), createTransaction);

module.exports = router;