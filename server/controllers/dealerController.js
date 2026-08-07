const Dealer = require('../models/Dealer');

// @route  POST /api/dealers
const createDealer = async (req, res) => {
  try {
    const dealer = await Dealer.create({
      ...req.body,
      createdBy: req.user._id,
    });
    res.status(201).json(dealer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  GET /api/dealers
const getDealers = async (req, res) => {
  try {
    const dealers = await Dealer.find().sort({ createdAt: -1 });
    res.json(dealers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  GET /api/dealers/:id
const getDealerById = async (req, res) => {
  try {
    const dealer = await Dealer.findById(req.params.id);
    if (!dealer) {
      return res.status(404).json({ message: 'Dealer not found' });
    }
    res.json(dealer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  PUT /api/dealers/:id
const updateDealer = async (req, res) => {
  try {
    const dealer = await Dealer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!dealer) {
      return res.status(404).json({ message: 'Dealer not found' });
    }
    res.json(dealer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  DELETE /api/dealers/:id
const deleteDealer = async (req, res) => {
  try {
    const dealer = await Dealer.findByIdAndDelete(req.params.id);
    if (!dealer) {
      return res.status(404).json({ message: 'Dealer not found' });
    }
    res.json({ message: 'Dealer deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createDealer,
  getDealers,
  getDealerById,
  updateDealer,
  deleteDealer,
};