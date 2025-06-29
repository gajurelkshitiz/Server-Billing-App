const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const SupplierPayment = require('../models/SupplierPayment');
const purchaseEntry = require('../models/PurchaseEntry');


const getSupplierPurchaseSummary = async (req, res) => {
  try {
    const { supplierID, companyID } = req.query;

    // Validate ObjectIds
    if (!ObjectId.isValid(supplierID) || !ObjectId.isValid(companyID)) {
      return res.status(400).json({ message: 'Invalid supplierID or companyID' });
    }

    // Convert to ObjectId
    const supplierObjectId = new ObjectId(supplierID);
    const companyObjectId = new ObjectId(companyID);

    // Aggregate from salesentries
    const purchaseSummaryResult = await purchaseEntry
      .aggregate([
        {
          $match: {
            supplierID: supplierObjectId,
            companyID: companyObjectId,
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$amount" },
            totalDueAmount: { $sum: "$dueAmount" },
          },
        },
      ]);

    // Aggregate from customerpayments
    const paymentSummaryResult = await SupplierPayment
      .aggregate([
        {
          $match: {
            supplierID: supplierObjectId,
            companyID: companyObjectId,
          },
        },
        {
          $group: {
            _id: null,
            totalPaid: { $sum: "$amountPaid" },
          },
        },
      ]);

    // Extract first result or use fallback
    const purchaseSummary = purchaseSummaryResult[0];
    const paymentSummary = paymentSummaryResult[0];

    // Fallback to 0 if not found
    const totalAmount = purchaseSummary?.totalAmount || 0;
    const totalDueAmount = purchaseSummary?.totalDueAmount || 0;
    const totalPaid = paymentSummary?.totalPaid || 0;

    // Final due = what was due in sales - what's been paid
    const totalDueLeft = totalDueAmount - totalPaid;

    // Send result
    res.json({
      supplierID,
      companyID,
      totalAmount,
      totalPaid,
      totalDueAmount,
      totalDueLeft,
    });
  } catch (error) {
    console.error("Aggregation error:", error);
    res.status(500).json({ message: "Error getting purchase summary", error });
  }
};

module.exports = { getSupplierPurchaseSummary };
