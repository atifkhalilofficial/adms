const express = require('express');
const router = express.Router();
const {
  createDealer,
  getDealers,
  getDealerById,
  updateDealer,
  deleteDealer,
} = require('../controllers/dealerController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getDealers);
router.get('/:id', getDealerById);
router.post('/', authorize('super_admin', 'sales_manager'), createDealer);
router.put('/:id', authorize('super_admin', 'sales_manager'), updateDealer);
router.delete('/:id', authorize('super_admin'), deleteDealer);

module.exports = router;