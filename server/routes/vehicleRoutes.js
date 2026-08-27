const express = require('express');
const router = express.Router();
const { createVehicle, getVehicles } = require('../controllers/vehicleController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getVehicles);
router.post('/', authorize('super_admin', 'warehouse_manager'), createVehicle);

module.exports = router;