// const Payment = require('../models/PaymentList');
const NepaliDate = require("nepali-datetime");
const CustomerPayment = require('../models/CustomerPayment');
const SupplierPayment = require('../models/SupplierPayment');
const { BadRequestError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


// Customer Payment Entry
const createCustomerPayment = async (req, res) => {
    const {customerID, customerName, companyID, amountPaid, paymentMode} = req.body;
    if (!customerID || !customerName || !companyID || !amountPaid || !paymentMode){
        throw new BadRequestError("Please provide all values");
    }

    console.log('This is a check who is creating customer:')
    console.log('admin is entering payment: ', req.user.tokenID)
    console.log('user is entering payment: ', req.user.adminID)
    // also add adminID into the payment:
    let adminID;
    if(req.user.adminID) {
        adminID = req.user.adminID;
    }
    adminID = req.user.tokenID;

    // get current date:
    const date = new NepaliDate();
    console.log('inside customer payment date is: ', date);
    

    
    const customerPaymentList = await CustomerPayment.create({
        ...req.body,
        date,
        adminID
    })
    console.log(customerPaymentList);
    res.status(StatusCodes.CREATED).json({customerPaymentList});
}


// Supplier Payment Entry
const createSupplierPayment = async (req, res) => {
    console.log(req.body);
    const {supplierID, supplierName, companyID, totalDueLeft, amountPaid, paymentMode, remarks} = req.body;
    if (!supplierID || !supplierName || !companyID || !totalDueLeft || !amountPaid || !paymentMode || !remarks){
        throw new BadRequestError("Please provide all values");
    }
    const supplierPaymentList = await SupplierPayment.create({...req.body})
    console.log(supplierPaymentList);
    res.status(StatusCodes.CREATED).json({supplierPaymentList});
}


// list all the SalesPaymentList for a Customer
const getSalesPaymentList = async (req, res) => {
    console.log(req.query);
    try {
        const { customerID, companyID } = req.query;

        if (!customerID || !companyID) {
            return res.status(400).json({ message: "Missing customerID or companyID" });
        }

        if (!ObjectId.isValid(customerID) || !ObjectId.isValid(companyID)) {
            return res.status(400).json({ message: "Invalid ObjectId format" });
        }

        const entries = await CustomerPayment.find({
            customerID: new ObjectId(customerID),
            companyID: new ObjectId(companyID)
        });

        console.log('entries:', entries);
        res.json(entries);
    } catch (error) {
        res.status(500).json({ message: "Error fetching Sales Payment List", error });
    }
};


// get payment summary for sales:
const getSalesPaymentSummary = async (req, res) => {
    try {
        const { customerID, companyID } = req.query;
        // Validate ObjectIds
        if (!ObjectId.isValid(customerID) || !ObjectId.isValid(companyID)) {
            return res.status(400).json({ message: 'Invalid customerID or companyID' });
        }
    
        const result = await CustomerPayment.aggregate([
            {
            $match: {
                $and: [
                { customerID: new ObjectId(customerID) },
                { companyID: new ObjectId(companyID) }
                ]
            }
            },
            {
            $group: {
                _id: "$customerID",
                amountPaid: { $sum: "$amountPaid" },
                totalDueLeft: { $sum: "$totalDueLeft" }
            }
            }
        ]);
    
        // Return summary or fallback empty
        res.json(result[0] || {
            _id: customerID,
            totalPaid: 0,
            totalDueLeft: 0
        });
        } catch (error) {
        console.error("Aggregation Error:", error);
        res.status(500).json({ message: 'Error getting purchase dues summary', error });
        }

    
}

// list all the PurchasePaymentList for a Supplier
const getPurchasePaymentList = async (req, res) => {
    console.log(req.query);
    try {
        const { supplierID, companyID } = req.query;

        if (!supplierID || !companyID) {
            return res.status(400).json({ message: "Missing supplierID or companyID" });
        }

        if (!ObjectId.isValid(supplierID) || !ObjectId.isValid(companyID)) {
            return res.status(400).json({ message: "Invalid ObjectId format" });
        }

        const entries = await SupplierPayment.find({
            supplierID: new ObjectId(supplierID),
            companyID: new ObjectId(companyID)
        });

        console.log('entries:', entries);
        res.json(entries);
    } catch (error) {
        res.status(500).json({ message: "Error fetching Purchase Payment List", error });
    }
};


// get payment summary for sales:
const getPurchasePaymentSummary = async (req, res) => {
    try {
        const { supplierID, companyID } = req.query;
        // Validate ObjectIds
        if (!ObjectId.isValid(supplierID) || !ObjectId.isValid(companyID)) {
            return res.status(400).json({ message: 'Invalid supplierID or companyID' });
        }
    
        const result = await SupplierPayment.aggregate([
            {
            $match: {
                $and: [
                { supplierID: new ObjectId(supplierID) },
                { companyID: new ObjectId(companyID) }
                ]
            }
            },
            {
            $group: {
                _id: "$supplierID",
                amountPaid: { $sum: "$amountPaid" },
                totalDueLeft: { $sum: "$totalDueLeft" }
            }
            }
        ]);
    
        // Return summary or fallback empty
        res.json(result[0] || {
            _id: supplierID,
            totalPaid: 0,
            totalDueLeft: 0
        });
        } catch (error) {
        console.error("Aggregation Error:", error);
        res.status(500).json({ message: 'Error getting purchase payment summary', error });
        }

    
}


module.exports = {
    createCustomerPayment,
    createSupplierPayment,
    getSalesPaymentList,
    getSalesPaymentSummary,
    getPurchasePaymentList,
    getPurchasePaymentSummary
};