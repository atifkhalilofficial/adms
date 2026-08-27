const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'in_transit', 'delivered', 'failed'],
      default: 'scheduled',
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    deliveredDate: {
      type: Date,
    },
    notes: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Delivery', deliverySchema);