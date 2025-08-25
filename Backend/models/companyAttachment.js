const mongoose = require("mongoose");

const companyAttachmentSchema = new mongoose.Schema(
    {
        filePath: {
            type: String,
        },
        category: {
            type: String,
            required: true,
            enum: ['Company Registration', 'PAN No', 'Audit Report', 'EXIM Code', 'Banijya Document', 'Other'],
        },
        fileName: {
            type: String,
            required: true,
            // unique: true,
        },
        dateOfFile: {
            type: Date,
            requied: true,
        },
        message: {
            type: String,
        },
        companyID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
        }, 
    },
    { timestamps: true }
);

module.exports = mongoose.model("CompanyAttachment", companyAttachmentSchema);