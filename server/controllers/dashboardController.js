const Dealer = require('../models/Dealer');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Payment = require('../models/Payment');

// @route  GET /api/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const totalDealers = await Dealer.countDocuments();
    const totalProducts = await Product.countDocuments();

    const lowStockProducts = await Product.find({
      $expr: { $lte: ['$currentStock', '$minimumStock'] },
    }).select('name currentStock minimumStock');

    const orders = await Order.find().select('totalAmount status createdAt');
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    const pendingOrders = orders.filter((o) => o.status === 'pending').length;

    const dealers = await Dealer.find().select('outstandingBalance');
    const totalOutstanding = dealers.reduce((sum, d) => sum + d.outstandingBalance, 0);

    // Revenue grouped by month for the last 6 months
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const recentOrders = orders.filter((o) => new Date(o.createdAt) >= sixMonthsAgo);

    const monthlyRevenue = {};
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      monthlyRevenue[key] = 0;
    }
    recentOrders.forEach((o) => {
      const d = new Date(o.createdAt);
      const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      if (monthlyRevenue[key] !== undefined) {
        monthlyRevenue[key] += o.totalAmount;
      }
    });

    const revenueChart = Object.entries(monthlyRevenue).map(([month, revenue]) => ({
      month,
      revenue,
    }));

    res.json({
      totalDealers,
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
      totalOutstanding,
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
      revenueChart,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDashboardStats };