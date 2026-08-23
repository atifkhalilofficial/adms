const Order = require('../models/Order');
const Product = require('../models/Product');

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
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
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