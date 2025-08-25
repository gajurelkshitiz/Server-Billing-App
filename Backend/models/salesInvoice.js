import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    itemCode: Number,
    description: String,
    hsCode: Number,
    quantity: Number,
    unit: String,
    price: Number,
    total: {
        type: Number,
        default: quantity * price
    },
});

const SalesInvoiceSchema = new mongoose.Schema({
    companyName: { 
        type: String, 
        required: [true, "Please Provide the company Name"], 
    }, 
    companyAddress: {
        type: String, 
        required: [true, "Please Provide the company Location"],
    },
    companyPAN: {
        type: Number,
        required: [true, "Please Provide company PAN No."]
    },
    invoiceNo: {
        type: String,
        required: [true, "Please Generate a Invoice Number"],
        unique: true,
    },
    dateOfInvoice: {
        type: Date,
        require: [true, "Please fill the invoice date"],
    },
    transactionDate: {
        type: Date,
        require: [true, "Please fill the transaction date"],
    },
    placeOfSupply: {
        type: String,
        default: companyAddress,
    },
    reverseCharge: {
        type: String,
        default: "",
    },
    customerName: { 
        type: String, 
        required: [true, "Please fill the Customer Name"]
    }, 
    customerAddress: {
        type: String,
        required: [true, "Please Provide Customer Address"]
    },
    customerPAN: {
        type: Number,
        required: [true, "Please fill the customer PAN No."],
    },
    shipperName: {
        type: String,
        default: customerName
    },
    shipperAddress: {
        type: String,
        default: customerAddress,
    },
    items: [{
        type:itemSchema,
        required: [true, "Empty Items in Bill is Not Allowed."]
    }], 
    total: {
        type: Number,
        required: [true, "Total Amount Needs to be calculated"]
    },
    taxableAmount: {
        type: Number,
        required: [true, "Please provide the taxable amount"],
    },
    grandTotal: {
        type: Number,
        required: [true, "Please fill the grand total amount"],
    },
    amountInWords: {
        type: String,
        required: [true, "Amount in words needs to be filled."],
    }
}, { timestamps: true });

// const Invoice = mongoose.model('Invoice', computerizedSalesEntrySchema);

// export default Invoice;

module.exports = mongoose.models.salesInvoice || mongoose.model("salesInvoice", salesInvoiceSchema);