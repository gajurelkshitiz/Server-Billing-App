const express = require("express");
const router = express.Router();

// Assuming you have Mongoose models for Admin, User, Company
const Admin = require('../../models/admin');
const Subscription = require('../../models/subscription')
const FiscalYear = require('../../models/FiscalYear')

// In your Express router file (e.g., dashboardRoutes.js)
router.get('/', async (req, res) => {
    try {
        // Optional: Add authentication/authorization middleware here
        // e.g., requireAuth, requireAdmin

        const adminCount = await Admin.countDocuments({});
        const subscriptionCount = await Subscription.countDocuments({});
        const fiscalYearCount = await FiscalYear.countDocuments({});
        // Add more counts as needed

        res.status(200).json({
            admins: adminCount,
            subscriptions: subscriptionCount,
            fiscalYears: fiscalYearCount,
            // Add other counts here
        });
    } catch (error) {
        console.error("Error fetching dashboard counts:", error);
        res.status(500).json({ message: "Failed to retrieve dashboard counts", error: error.message });
    }
});

module.exports = router;