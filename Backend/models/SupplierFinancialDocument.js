const { AttachmentSchema, ChequeSchema, GuaranteeSchema } = require('./FinancialDocumentTypes');
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Base schema (common to all types)
const baseOptions = {
  discriminatorKey: 'type',   // tells mongoose which sub-schema to use
  collection: 'supplierFinancialDocuments',
  timestamps: true            // createdAt, updatedAt auto
};

const BaseSchema = new Schema({
  supplierID: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
  companyID: { type: Schema.Types.ObjectId, ref: 'Company', required: true},
}, baseOptions);

const SupplierFinancialDocument = mongoose.model('SupplierFinancialDocument', BaseSchema);

const Attachment = SupplierFinancialDocument.discriminator('supplier_attachment', AttachmentSchema);
const Cheque = SupplierFinancialDocument.discriminator('supplier_cheque', ChequeSchema);
const Guarantee = SupplierFinancialDocument.discriminator('supplier_guarantee', GuaranteeSchema);

module.exports = { SupplierFinancialDocument, Attachment, Cheque, Guarantee };
