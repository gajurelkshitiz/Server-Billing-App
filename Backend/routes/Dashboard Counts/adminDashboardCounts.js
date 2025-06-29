const express = require("express");
const router = express.Router();

// Assuming you have Mongoose models for Admin, User, Company
const User = require('../../models/user');
const Company = require('../../models/company');
const Customer = require('../../models/Customer')
const Supplier = require('../../models/Supplier')
const PurchaseEntry = require('../../models/PurchaseEntry')
const SalesEntry = require('../../models/salesEntry')

// In your Express router file (e.g., dashboardRoutes.js)
router.get('/', async (req, res) => {
    const {tokenID, name, role, adminID, companyID} = req.user;  // adminID and companyID for users
    try {
        // Optional: Add authentication/authorization middleware here
        // e.g., requireAuth, requireAdmin

        // countDocuments({first from database: second from token})

        const userCount = await User.countDocuments({adminID:tokenID});
        const companyCount = await Company.countDocuments({adminID:tokenID});
        const customerCount = await Customer.countDocuments({
            $or: [
                { createdBy: tokenID, adminID: null },
                { adminID: tokenID }
            ]
        });
        const supplierCount = await Supplier.countDocuments({
            $or: [
                { createdBy: tokenID, adminID: null },
                { adminID: tokenID }
            ]
        });
        const purchaseEntryCount = await PurchaseEntry.countDocuments({
            $or: [
                { createdBy: tokenID, adminID: null },
                { adminID: tokenID }
            ]
        });
        const salesEntryCount = await SalesEntry.countDocuments({
            $or: [
                { createdBy: tokenID, adminID: null },
                { adminID: tokenID }
            ]
        });
        // Add more counts as needed

        res.status(200).json({
            users: userCount, // Renamed from 'customers' for consistency if your model is 'User'
            companies: companyCount,
            customers: customerCount,
            suppliers: supplierCount,
            purchaseEntries: purchaseEntryCount,
            salesEntries: salesEntryCount
            // Add other counts here
        });
    } catch (error) {
        console.error("Error fetching dashboard counts:", error);
        res.status(500).json({ message: "Failed to retrieve dashboard counts", error: error.message });
    }
});

module.exports = router;