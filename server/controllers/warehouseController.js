const Warehouse = require('../models/Warehouse');

// @route  POST /api/warehouses
const createWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.create({
      ...req.body,
      createdBy: req.user._id,
    });
    await warehouse.populate('manager', 'name email');
    res.status(201).json(warehouse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  GET /api/warehouses
const getWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find()
      .populate('manager', 'name email')
      .sort({ createdAt: -1 });
    res.json(warehouses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  GET /api/warehouses/:id
const getWarehouseById = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id).populate('manager', 'name email');
    if (!warehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }
    res.json(warehouse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  PUT /api/warehouses/:id
const updateWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('manager', 'name email');
    if (!warehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }
    res.json(warehouse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  DELETE /api/warehouses/:id
const deleteWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findByIdAndDelete(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }
    res.json({ message: 'Warehouse deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createWarehouse,
  getWarehouses,
  getWarehouseById,
  updateWarehouse,
  deleteWarehouse,
};