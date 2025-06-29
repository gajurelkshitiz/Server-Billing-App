const express = require('express');
const router = express.Router();
const authorizeRoles = require("../middleware/authorizeRoles");

const {getCustomerSalesSummary,
       getSupplierPurchaseSummary,
    } = require('../controllers/salesSummary');

router.route('/summary').get(authorizeRoles(["admin", "user"]), getCustomerSalesSummary);
// router.route('/summary').get(authorizeRoles(["admin", "user"]), getCustomerSalesSummary);

module.exports = router;