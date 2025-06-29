// I haven't use any due list model here

const mongoose = require('mongoose');

const dueSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Sale', 'Purchase'],
        required: [true, "please provide type of due"],
    },
    totalAmount: {
        type: Number,
        required: [true, "Please provide total amount"],
        min: 0
    },
    paidAmount: {
        type: Number,
        required: [true, "Please provide paid amount"],
        min: 0
    },
    remainingAmount: {
        type: Number,
        required: [true, "Please provide remaining amount"],
    },
    status: {
        type: String,
        enum: ['Paid', 'Unpaid', 'Partially Paid'],
        required: [true, "Please provide status"],
    },
    partyName: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'type', // Dynamically reference Customer or Supplier
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Due', dueSchema);
