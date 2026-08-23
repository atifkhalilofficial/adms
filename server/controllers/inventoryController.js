const InventoryTransaction = require('../models/InventoryTransaction');
const Product = require('../models/Product');

// @route  POST /api/inventory
const createTransaction = async (req, res) => {
  try {
    const { product, warehouse, type, quantity, reason, notes } = req.body;

    const productDoc = await Product.findById(product);
    if (!productDoc) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (type === 'out' && productDoc.currentStock < quantity) {
      return res.status(400).json({
        message: `Not enough stock. Current stock is ${productDoc.currentStock}.`,
      });
    }

    const transaction = await InventoryTransaction.create({
      product,
      warehouse,
      type,
      quantity,
      reason,
      notes,
      createdBy: req.user._id,
    });

    productDoc.currentStock =
      type === 'in'
        ? productDoc.currentStock + quantity
        : productDoc.currentStock - quantity;
    await productDoc.save();

    await transaction.populate([
      { path: 'product', select: 'name sku currentStock' },
      { path: 'warehouse', select: 'name city' },
    ]);

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  GET /api/inventory
const getTransactions = async (req, res) => {
  try {
    const filter = {};
    if (req.query.product) filter.product = req.query.product;
    if (req.query.warehouse) filter.warehouse = req.query.warehouse;

    const transactions = await InventoryTransaction.find(filter)
      .populate('product', 'name sku currentStock')
      .populate('warehouse', 'name city')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createTransaction, getTransactions };