const mongoose = require('mongoose');

const customerPaymentSchema = new mongoose.Schema({
    customerID: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'Customer',
        required: true
    },
    customerName: {
        type: String,
    },
    companyID: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'Company',
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

module.exports = mongoose.model('CustomerPayment', customerPaymentSchema);
// module.exports = mongoose.models.CustomerPayment || mongoose.model("CustomerPayment", customerPaymentSchema);