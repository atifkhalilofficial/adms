const Payment = require('../models/Payment');
const Dealer = require('../models/Dealer');

// @route  POST /api/payments
const createPayment = async (req, res) => {
  try {
    const { dealer, amount, method, reference, notes } = req.body;

    const dealerDoc = await Dealer.findById(dealer);
    if (!dealerDoc) {
      return res.status(404).json({ message: 'Dealer not found' });
    }

    const payment = await Payment.create({
      dealer,
      amount,
      method,
      reference,
      notes,
      createdBy: req.user._id,
    });

    dealerDoc.outstandingBalance = Math.max(0, dealerDoc.outstandingBalance - amount);
    await dealerDoc.save();

    await payment.populate('dealer', 'name businessName outstandingBalance');

    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  GET /api/payments
const getPayments = async (req, res) => {
  try {
    const filter = {};
    if (req.query.dealer) filter.dealer = req.query.dealer;

    const payments = await Payment.find(filter)
      .populate('dealer', 'name businessName')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createPayment, getPayments };