// const Due = require('../models/DueList');
const PurchaseEntry = require('../models/PurchaseEntry');

const Customer = require('../models/Customer');
const CustomerPayment = require('../models/CustomerPayment');
const SalesEntry = require('../models/salesEntry');

const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

// list all the purchase entry for a supplier:
const getPurchaseDuesList = async (req, res) => {
    console.log(req.query);
    try {
        const { supplierID, companyID } = req.query;
        const entries = await PurchaseEntry.find({
            $and: [
            { supplierID: new ObjectId(supplierID) },
            { companyID: new ObjectId(companyID) }
            ]
        });
        res.json(entries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Purchase dues List', error });
    }
};

// get summary for a supplier:
const getPurchaseDuesSummary = async (req, res) => {
  try {
    const { customerID, companyID } = req.query;

    // Validate ObjectIds
    if (!ObjectId.isValid(customerID) || !ObjectId.isValid(companyID)) {
      return res.status(400).json({ message: 'Invalid customerID or companyID' });
    }

    const result = await SalesEntry.aggregate([
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
          totalAmount: { $sum: "$amount" },
          totalDueAmount: { $sum: "$dueAmount" }
        }
      }
    ]);

    // Return summary or fallback empty
    res.json(result[0] || {
      _id: customerID,
      totalAmount: 0,
      totalDueAmount: 0
    });
  } catch (error) {
    console.error("Aggregation Error:", error);
    res.status(500).json({ message: 'Error getting sales dues summary', error });
  }
};



// list all the sales entry for a customer:
const getSalesDuesList = async (req, res) => {
    console.log(req.query);
    try {
        const { customerID, companyID } = req.query;
        const entries = await SalesEntry.find({
            $and: [
            { customerID: new ObjectId(customerID) },
            { companyID: new ObjectId(companyID) }
            ]
        });
        res.json(entries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Sales dues List', error });
    }
};

// get summary for a customer:
const getSalesDuesSummary = async (req, res) => {
  try {
    const { customerID, companyID } = req.query;

    // Validate ObjectIds
    if (!ObjectId.isValid(customerID) || !ObjectId.isValid(companyID)) {
      return res.status(400).json({ message: 'Invalid customerID or companyID' });
    }

    const result = await SalesEntry.aggregate([
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
          totalAmount: { $sum: "$amount" },
          totalDueAmount: { $sum: "$dueAmount" }
        }
      }
    ]);

    // Return summary or fallback empty
    res.json(result[0] || {
      _id: customerID,
      totalAmount: 0,
      totalDueAmount: 0
    });
  } catch (error) {
    console.error("Aggregation Error:", error);
    res.status(500).json({ message: 'Error getting purchase dues summary', error });
  }
};



const getSingleCustomerCompleteData = async (req, res) => {
  try {
    const { customerID, companyID } = req.query;

    // Validate ObjectIds
    if (!ObjectId.isValid(customerID) || !ObjectId.isValid(companyID)) {
      return res.status(400).json({ message: 'Invalid customerID or companyID' });
    }

    const result = await Customer.aggregate([
      // Match the specific customer
      {
        $match: {
          _id: new mongoose.Types.ObjectId(customerID),
          companyID: new mongoose.Types.ObjectId(companyID)
        }
      },
      
      // Lookup sales entries
      {
        $lookup: {
          from: 'salesentries',
          localField: '_id',
          foreignField: 'customerID',
          as: 'salesEntries'
        }
      },
      
      // Lookup payments
      {
        $lookup: {
          from: 'customerpayments',
          localField: '_id',
          foreignField: 'customerID',
          as: 'payments'
        }
      },
      
      // Add calculated fields
      {
        $addFields: {
          totalSalesAmount: { $sum: '$salesEntries.netTotalAmount' },
          totalPayments: { $sum: '$payments.amountPaid' },
          thisYearDue: {
            $subtract: [
              { $sum: '$salesEntries.netTotalAmount' },
              { $sum: '$payments.amountPaid' }
            ]
          },
          netTotalDue: {
            $subtract: [
              { $add: ['$prevClosingBalance', { $sum: '$salesEntries.netTotalAmount' }] },
              { $sum: '$payments.amountPaid' }
            ]
          },
          lastSaleDate: { $max: '$salesEntries.date' },
          lastPaymentDate: { $max: '$payments.createdAt' }
        }
      },
      
      // Project only the fields you want to send to frontend
      {
        $project: {
          name: 1,
          email: 1,
          phoneNo: 1,
          address: 1,
          prevClosingBalance: 1,
          totalSalesAmount: 1,
          totalPayments: 1,
          netTotalDue: 1,
          thisYearDue: 1,
          lastSaleDate: 1,
          lastPaymentDate: 1,
          // Add any other customer fields you need
        }
      }
    ]);

    if (!result || result.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Customer not found' 
      });
    }

    const customer = result[0];
    
    // Remap the output for frontend (similar to getAllCustomersCompleteData)
    const customerData = {
      customerID: customer._id,
      name: customer.name,
      email: customer.email,
      phone: customer.phoneNo,
      address: customer.address,
      prevClosingBalance: customer.prevClosingBalance || 0,
      totalSales: customer.totalSalesAmount || 0,
      totalPayments: customer.totalPayments || 0,
      totalDue: customer.netTotalDue || 0,
      currentDue: customer.thisYearDue || 0,
      lastSaleDate: customer.lastSaleDate,
      lastPaymentDate: customer.lastPaymentDate,
      status: customer.netTotalDue > 0 ? 'due' : 'paid'
    };

    res.json({
      success: true,
      customer: customerData
    });

  } catch (error) {
    console.error('Error fetching customer data:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching customer data', 
      error: error.message 
    });
  }
};


const getAllCustomersCompleteData = async (req, res) => {
  try {
    const { companyID } = req.query;

    // Validate companyID
    if (!ObjectId.isValid(companyID)) {
      return res.status(400).json({ message: 'Invalid companyID' });
    }

    const result = await Customer.aggregate([
      // Match all customers for the specific company
      {
        $match: {
          companyID: new mongoose.Types.ObjectId(companyID)
        }
      },
      
      // Lookup sales entries
      {
        $lookup: {
          from: 'salesentries',
          localField: '_id',
          foreignField: 'customerID',
          as: 'salesEntries'
        }
      },
      
      // Lookup payments
      {
        $lookup: {
          from: 'customerpayments',
          localField: '_id',
          foreignField: 'customerID',
          as: 'payments'
        }
      },
      
      // Add calculated fields
      {
        $addFields: {
          totalSalesAmount: { $sum: '$salesEntries.netTotalAmount' },
          totalPayments: { $sum: '$payments.amountPaid' },
          thisYearDue: {
            $subtract: [
              { $sum: '$salesEntries.netTotalAmount' },
              { $sum: '$payments.amountPaid' }
            ]
          },
          netTotalDue: {
            $subtract: [
              { $add: ['$prevClosingBalance', { $sum: '$salesEntries.netTotalAmount' }] },
              { $sum: '$payments.amountPaid' }
            ]
          },
          lastSaleDate: { $max: '$salesEntries.date' },
          lastPaymentDate: { $max: '$payments.createdAt' }
        }
      },
      
      // Project only the fields you want to send to frontend
      {
        $project: {
          name: 1,
          email: 1,
          phoneNo: 1,
          address: 1,
          prevClosingBalance: 1,
          totalSalesAmount: 1,
          totalPayments: 1,
          netTotalDue: 1,
          thisYearDue: 1,
          lastSaleDate: 1,
          lastPaymentDate: 1,
          // Add any other customer fields you need
        }
      },
      
      // Sort by customer name or any other field
      {
        $sort: { customerName: 1 }
      }
    ]);

    // Remap the output for frontend
    const remappedData = result.map(customer => ({
      customerID: customer._id,
      name: customer.name,
      email: customer.email,
      phone: customer.phoneNo,
      address: customer.address,
      prevClosingBalance: customer.prevClosingBalance || 0,
      totalSales: customer.totalSalesAmount || 0,
      totalPayments: customer.totalPayments || 0,
      totalDue: customer.netTotalDue || 0,
      currentDue: customer.thisYearDue || 0,
      lastSaleDate: customer.lastSaleDate,
      lastPaymentDate: customer.lastPaymentDate,
      status: customer.netTotalDue > 0 ? 'due' : 'paid'
    }));

    res.json({
      success: true,
      count: remappedData.length,
      customers: remappedData
    });

  } catch (error) {
    console.error('Error fetching all customers data:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching customers data', 
      error: error.message 
    });
  }
};

module.exports = {
    getPurchaseDuesList,
    getPurchaseDuesSummary,
    getSalesDuesList,
    getSalesDuesSummary,
    getSingleCustomerCompleteData,
    getAllCustomersCompleteData
};
