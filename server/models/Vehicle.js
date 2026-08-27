const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ['truck', 'van', 'pickup', 'other'],
      default: 'truck',
    },
    driverName: {
      type: String,
      required: true,
    },
    driverPhone: {
      type: String,
      required: true,
    },
    capacity: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);