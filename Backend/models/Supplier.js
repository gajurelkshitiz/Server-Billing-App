const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true,'please provide a user name']
  },
  phoneNo:{
    type: String,
    required: [true,'please provide a valid phone number'],
  },
  address: {
    type: String,
    required: true
  },
  prevClosingBalance: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    default: 'debit'
  },
  panNo: {
    type: String,
    required: [true, "Please provide PAN No"]
  },
  email: {
    type: String,
    required:[true,'please provide a valid phone number'],
    unique: true,
  },
  creditLimitAmount: {
    type: Number,
  },
  creditTimePeriodInDays: {
    type: Number,
  },
  status: {
    type: Boolean,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  companyID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  companyName:{
    type: String,
  },
  adminID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  },
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);
