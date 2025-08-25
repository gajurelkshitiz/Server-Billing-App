// models/CustomerFinancialDocument.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Base schema (common to all types)
const baseOptions = {
  discriminatorKey: 'type',   // tells mongoose which sub-schema to use
  collection: 'customerFinancialDocuments',
  timestamps: true            // createdAt, updatedAt auto
};

const BaseSchema = new Schema({
  customerID: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  companyID: { type: Schema.Types.ObjectId, ref: 'Company', required: true},
}, baseOptions);

const CustomerFinancialDocument = mongoose.model('CustomerFinancialDocument', BaseSchema);

// Attachment schema
const Attachment = CustomerFinancialDocument.discriminator('attachment',
  new Schema({
    fileUrl: { type: String },
    fileName: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["Contract Agreement", "Legal Documents", "Registration Documents", "Other"]
    }
  })
);

// Cheque schema
const Cheque = CustomerFinancialDocument.discriminator('cheque',
  new Schema({
    chequeNo: { type: String, required: true },
    fileUrl: { type: String },
    amount: { type: Number, required: true },
    bankName: { type: String, required: true },
    issueDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ["pending", "cleared", "bounced"], required: true }
  })
);

// Guarantee schema
const Guarantee = CustomerFinancialDocument.discriminator('guarantee',
  new Schema({
    guaranteeNo: { type: String, required: true },
    fileUrl: { type: String },
    amount: { type: Number, required: true },
    bankName: { type: String, required: true },
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    status: { type: String, enum: ["active", "expired", "claimed"], required: true }
  })
);

module.exports = { CustomerFinancialDocument, Attachment, Cheque, Guarantee };
