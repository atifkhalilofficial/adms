const Vehicle = require('../models/Vehicle');

const createVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create({
      ...req.body,
      createdBy: req.user._id,
    });
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createVehicle, getVehicles };