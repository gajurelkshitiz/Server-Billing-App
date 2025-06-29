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
  email: {
    type: String,
    required:[true,'please provide a valid phone number'],
    unique: true,
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
  // companyName: {
  //   type: String,
  //   ref: 'Company'
  // }
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);
