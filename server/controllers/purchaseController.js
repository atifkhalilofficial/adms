const Purchase = require('../models/Purchase');
const Product = require('../models/Product');
const InventoryTransaction = require('../models/InventoryTransaction');

// @route  POST /api/purchases
const createPurchase = async (req, res) => {
  try {
    const { supplier, warehouse, items } = req.body;

    let totalCost = 0;
    const resolvedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      totalCost += item.unitCost * item.quantity;
      resolvedItems.push({
        product: product._id,
        quantity: item.quantity,
        unitCost: item.unitCost,
      });
    }

    const purchase = await Purchase.create({
      supplier,
      warehouse,
      items: resolvedItems,
      totalCost,
      createdBy: req.user._id,
    });

    for (const item of resolvedItems) {
      const product = await Product.findById(item.product);
      product.currentStock += item.quantity;
      await product.save();

      await InventoryTransaction.create({
        product: product._id,
        warehouse,
        type: 'in',
        quantity: item.quantity,
        reason: 'purchase',
        notes: `Purchase ${purchase._id}`,
        createdBy: req.user._id,
      });
    }

    await purchase.populate([
      { path: 'supplier', select: 'name companyName' },
      { path: 'warehouse', select: 'name city' },
      { path: 'items.product', select: 'name sku' },
    ]);

    res.status(201).json(purchase);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  GET /api/purchases
const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate('supplier', 'name companyName')
      .populate('warehouse', 'name city')
      .populate('items.product', 'name sku')
      .sort({ createdAt: -1 });
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createPurchase, getPurchases };