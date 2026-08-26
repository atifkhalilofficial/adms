const Supplier = require('../models/Supplier');

const createSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.create({
      ...req.body,
      createdBy: req.user._id,
    });
    res.status(201).json(supplier);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createSupplier, getSuppliers };