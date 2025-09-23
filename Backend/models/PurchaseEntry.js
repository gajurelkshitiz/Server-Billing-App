const mongoose = require('mongoose');

const purchaseEntrySchema = new mongoose.Schema({
  supplierID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: [true, "Please provide the supplier ID"],
  },
  supplierName: {
    type: String,
  },
  billNo: {
    type: String,
    required: [true, "Please provide Bill Number"],
  },
  date: {
    type: Date,
    required: [true, "Please provide a date"],
  },
  dueAmount:{
    type: Number,
    required: [true, "Please provide an amount"],
  },
  vat: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'amount'],
    default: 'percentage'
  },
  netDueAmount: {
    type: Number,
  },
  itemDescription: {
    type: String,
    required: [true, "Please provide an item description"],
  },
  billAttachment: {
    type: String,
    // required: [true, "Please provide a bill attachment"],
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

// module.exports = mongoose.model('PurchaseEntry', purchaseEntrySchema);
module.exports = mongoose.models.PurchaseEntry || mongoose.model("PurchaseEntry", purchaseEntrySchema);

