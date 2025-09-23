const mongoose = require('mongoose');

const supplierPaymentSchema = new mongoose.Schema({
    supplierID: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'Supplier',
        required: true
    },
    supplierName: {
        type: String,
    },
    date: {
        type: String,
    },
    companyID: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'Company',
    },
    adminID: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'admin',
    },
    amountPaid: {
        type: Number,
        required: true
    },
    paymentMode: {
        type: String,
        required: true
    },
    remarks: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('SupplierPayment', supplierPaymentSchema);
// module.exports = mongoose.models.SupplierPayment || mongoose.model("SupplierPayment", supplierPaymentSchema);