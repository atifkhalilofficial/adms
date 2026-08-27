const Delivery = require('../models/Delivery');

// @route  POST /api/deliveries
const createDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.create({
      ...req.body,
      createdBy: req.user._id,
    });
    await delivery.populate([
      { path: 'order', select: 'totalAmount status dealer', populate: { path: 'dealer', select: 'name' } },
      { path: 'vehicle', select: 'registrationNumber driverName driverPhone' },
    ]);
    res.status(201).json(delivery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  GET /api/deliveries
const getDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find()
      .populate({ path: 'order', select: 'totalAmount status dealer', populate: { path: 'dealer', select: 'name' } })
      .populate('vehicle', 'registrationNumber driverName driverPhone')
      .sort({ createdAt: -1 });
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  PUT /api/deliveries/:id/status
const updateDeliveryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    delivery.status = status;
    if (status === 'delivered') {
      delivery.deliveredDate = new Date();
    }
    await delivery.save();

    await delivery.populate([
      { path: 'order', select: 'totalAmount status dealer', populate: { path: 'dealer', select: 'name' } },
      { path: 'vehicle', select: 'registrationNumber driverName driverPhone' },
    ]);

    res.json(delivery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createDelivery, getDeliveries, updateDeliveryStatus };