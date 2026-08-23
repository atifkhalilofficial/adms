const Order = require('../models/Order');
const Product = require('../models/Product');
const InventoryTransaction = require('../models/InventoryTransaction');
const Dealer = require('../models/Dealer');


// @route  POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { dealer, warehouse, items } = req.body;

    let totalAmount = 0;
    const resolvedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      const lineTotal = product.price * item.quantity;
      totalAmount += lineTotal;
      resolvedItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const order = await Order.create({
      dealer,
      warehouse,
      items: resolvedItems,
      totalAmount,
      createdBy: req.user._id,
    });

        const dealerDoc = await Dealer.findById(dealer);
    if (dealerDoc) {
      dealerDoc.outstandingBalance += totalAmount;
      await dealerDoc.save();
    }

    await order.populate([
      { path: 'dealer', select: 'name businessName' },
      { path: 'warehouse', select: 'name city' },
      { path: 'items.product', select: 'name sku' },
    ]);

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  GET /api/orders
const getOrders = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.dealer) filter.dealer = req.query.dealer;

    const orders = await Order.find(filter)
      .populate('dealer', 'name businessName')
      .populate('warehouse', 'name city')
      .populate('items.product', 'name sku')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('dealer', 'name businessName')
      .populate('warehouse', 'name city')
      .populate('items.product', 'name sku');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  PUT /api/orders/:id/status
// @route  PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Moving to "shipped" for the first time: deduct stock
    if (status === 'shipped' && !order.stockDeducted) {
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (!product) continue;

        if (product.currentStock < item.quantity) {
          return res.status(400).json({
            message: `Not enough stock for ${product.name}. Current stock is ${product.currentStock}.`,
          });
        }

        product.currentStock -= item.quantity;
        await product.save();

        await InventoryTransaction.create({
          product: product._id,
          warehouse: order.warehouse,
          type: 'out',
          quantity: item.quantity,
          reason: 'sale',
          notes: `Order ${order._id}`,
          createdBy: req.user._id,
        });
      }
      order.stockDeducted = true;
    }

    // Cancelling an order that already had stock deducted: restore it
    if (status === 'cancelled' && order.stockDeducted) {
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (!product) continue;

        product.currentStock += item.quantity;
        await product.save();

        await InventoryTransaction.create({
          product: product._id,
          warehouse: order.warehouse,
          type: 'in',
          quantity: item.quantity,
          reason: 'correction',
          notes: `Order ${order._id} cancelled — stock restored`,
          createdBy: req.user._id,
        });
      }
      order.stockDeducted = false;
    }

    order.status = status;
    await order.save();

    await order.populate([
      { path: 'dealer', select: 'name businessName' },
      { path: 'warehouse', select: 'name city' },
      { path: 'items.product', select: 'name sku' },
    ]);

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus };