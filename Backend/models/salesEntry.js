const mongoose = require('mongoose');

const salesEntrySchema = new mongoose.Schema({
  customerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, "Please provide a customer ID"],
  },
  customerName: {
    type: String,
  },
  billNo:{
    type: String,
    required: [true, "Please provide Bill Number"],
  },
  date: {
    type: Date,
    // type: String,  // this is a fix for "sharwan-32.."
    required: [true, "Please provide a date"],
  },
  amount:{
    type: Number,
    required: [true, "Please provide an amount"],
  },
  vat: {
    type: Number,
    default: 0
  },
  discount:{
    type: Number,
    default: 0
  },
  discountType: {
    type: String,
    enum: ['percentage', 'amount'],
    default: 'percentage'
  },
  netTotalAmount: {
    type: Number,
  },
  itemDescription: {
    type: String,
    required: [true, "Please provide an item description"],
  },
  billAttachment: {
    type: String,
  },
  fiscalYear: {
    type: String,
    ref: 'FiscalYear'
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Admin'
  },
  adminID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  companyID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  }
}, { timestamps: true });

// module.exports = mongoose.model('SalesEntry', salesEntrySchema);
module.exports = mongoose.models.SalesEntry || mongoose.model("SalesEntry", salesEntrySchema);
