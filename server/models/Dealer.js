const mongoose = require('mongoose');

const dealerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
    },
    province: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    ntn: {
      type: String,
    },
    cnic: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['retailer', 'wholesaler', 'distributor'],
      default: 'retailer',
    },
    creditLimit: {
      type: Number,
      default: 0,
    },
    outstandingBalance: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Dealer', dealerSchema);