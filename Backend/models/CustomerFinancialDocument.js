// models/CustomerFinancialDocument.js
const mongoose = require('mongoose');
const { Schema } = mongoose;
const { AttachmentSchema, ChequeSchema, GuaranteeSchema } = require('./FinancialDocumentTypes');

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

const Attachment = CustomerFinancialDocument.discriminator('customer_attachment', AttachmentSchema);
const Cheque = CustomerFinancialDocument.discriminator('customer_cheque', ChequeSchema);
const Guarantee = CustomerFinancialDocument.discriminator('customer_guarantee', GuaranteeSchema);

module.exports = { CustomerFinancialDocument, Attachment, Cheque, Guarantee };
