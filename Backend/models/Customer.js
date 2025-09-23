const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
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
    required: [true, "Please provide address"],
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
    required:[true, 'please provide a valid email number'],
    unique: true,
    // match: [
    //   /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    //   "Email Not Valid",
    // ],
  },
  creditLimitAmount: {
    type: Number,
  },
  creditTimePeriodInDays: {
    type: Number,
  },
  status: {
    type: Boolean,
    // enum: [true, false],
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
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

module.exports = mongoose.model('Customer', customerSchema);
