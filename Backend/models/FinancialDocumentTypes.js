// filepath: \\wsl.localhost\Ubuntu-22.04\home\kshitizgajurel\Billing System Merged\Backend\models\FinancialDocumentTypes.js
const { Schema } = require('mongoose');

const AttachmentSchema = new Schema({
  fileUrl: { type: String },
  fileName: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ["Contract Agreement", "Legal Documents", "Registration Documents", "Other"]
  }
});

const ChequeSchema = new Schema({
  chequeNo: { type: String, required: true },
  fileUrl: { type: String },
  amount: { type: Number, required: true },
  bankName: { type: String, required: true },
  issueDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ["pending", "cleared", "bounced"], required: true }
});

const GuaranteeSchema = new Schema({
  guaranteeNo: { type: String, required: true },
  fileUrl: { type: String },
  amount: { type: Number, required: true },
  bankName: { type: String, required: true },
  issueDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  status: { type: String, enum: ["active", "expired", "claimed"], required: true }
});

module.exports = { AttachmentSchema, ChequeSchema, GuaranteeSchema };