const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', authorize('super_admin', 'warehouse_manager'), createProduct);
router.put('/:id', authorize('super_admin', 'warehouse_manager'), updateProduct);
router.delete('/:id', authorize('super_admin'), deleteProduct);

module.exports = router;