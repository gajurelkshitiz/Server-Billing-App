// const Due = require('../models/DueList');
const PurchaseEntry = require('../models/PurchaseEntry');
const SalesEntry = require('../models/salesEntry');
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


module.exports = {
    getPurchaseDuesList,
    getPurchaseDuesSummary,
    getSalesDuesList,
    getSalesDuesSummary
};
