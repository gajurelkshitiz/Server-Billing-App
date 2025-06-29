const mongoose = require('mongoose');

const salesEntrySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, "Please provide a date"],
  },
  amount:{
    type: Number,
    required: [true, "Please provide an amount"],
  },
  itemDescription: {
    type: String,
    required: [true, "Please provide an item description"],
  },
  customerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    // required: [true, "Please provide a customer ID"],
  },
  billAttachment: {
    type: String,
    required: [true, "Please provide a bill attachment"],
  },
  paid:{
    type:Boolean,
    required: [true, "Please specify if the amount is paid"],
  },
  dueAmount:{
    type: Number,
    required:function() {return this.isDue}
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
