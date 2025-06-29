const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    party: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'partyType',
        required: true
    },
    partyType: {
        type: String,
        enum: ['Customer', 'Supplier'],
        required: true
    },
    linkedDue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Due',
        required: true
    },
    dueAmount: {
        type: Number,
        required: true
    },
    amountPaid: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    paymentMode: {
        type: String,
        enum: ['Cash', 'Cheque', 'Online'],
        required: true
    },
    remarks: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
