const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Assuming you have Mongoose models for Admin, User, Company
const Admin = require('../../models/admin');
const User = require('../../models/user');
const Company = require('../../models/company');
const Customer = require('../../models/Customer')
const Subscription = require('../../models/subscription')
const Supplier = require('../../models/Supplier')
const PurchaseEntry = require('../../models/PurchaseEntry')
const SalesEntry = require('../../models/salesEntry')

// In your Express router file (e.g., dashboardRoutes.js)
router.get('/', async (req, res) => {
    const {tokenID, name, role, adminID, companyID} = req.user;  // adminID and companyID for users
    try {
        // Optional: Add authentication/authorization middleware here
        // e.g., requireAuth, requireAdmin

        const customerCount = await Customer.countDocuments({companyID: companyID});
        const supplierCount = await Supplier.countDocuments({companyID: companyID});
        const purchaseEntryCount = await PurchaseEntry.countDocuments({companyID: companyID});
        const salesEntryCount = await SalesEntry.countDocuments({companyID: companyID});
        // Add more counts as needed

        res.status(200).json({
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