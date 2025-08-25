const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemCode: Number,
  description: String,
  hsCode: Number,
  quantity: Number,
  unit: String,
  price: Number,
  amount: Number,
  // Add discount fields to individual items
  discount: {
    type: Number,
    default: 0
  },
  discountType: {
    type: String,
    enum: ["percentage", "amount"],
    default: "percentage"
  },
  netAmount: {
    type: Number,
    default: 0
  }
});

const ComputerizedSalesEntrySchema = new mongoose.Schema(
  {
    customerID: {
      type: String,
      required: [true, "Please Provide the company ID"],
    },
    customerName: {
      type: String,
    },
    invoiceNo: {
      type: String,
      required: [true, "Please Provide the Invoice Number"],
    },
    date: {
      type: Date,
      require: [true, "Please fill the transaction date"],
    },
    shipperName: {
      type: String,
    },
    shipperAddress: {
      type: String,
    },
    items: [
      {
        type: itemSchema,
        required: [true, "Empty Items in Bill is Not Allowed."],
      },
    ],
    total: {
      type: Number,
      required: [true, "Total Amount Needs to be calculated"],
    },
    // Remove global discount fields
    // discount: {
    //   type: Number,
    //   default: 0,
    // },
    // discountType: {
    //   type: String,
    //   enum: ["percentage", "amount"],
    //   default: "percentage",
    // },
    taxableAmount: {
      type: Number,
      required: [true, "Please provide the taxable amount"],
    },
    vat: {
      type: Number,
      default: 0,
    },
    vatAmount: {
      type: Number,
      default: 0,
    },
    grandTotal: {
      type: Number,
      required: [true, "Please fill the grand total amount"],
    },
    amountInWords: {
      type: String,
      required: [true, "Amount in words needs to be filled."],
    },
    fiscalYear: {
      type: String,
      ref: "FiscalYear",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    adminID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    companyID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    printCount: {
      type: Number,
      // default: 0,
    },
  }, { timestamps: true });

module.exports =
  mongoose.models.ComputerizedSalesEntry ||
  mongoose.model("ComputerizedSalesEntry", ComputerizedSalesEntrySchema);
