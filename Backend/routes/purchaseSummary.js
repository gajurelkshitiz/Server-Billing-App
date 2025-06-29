const express = require('express');
const router = express.Router();
const authorizeRoles = require("../middleware/authorizeRoles");

const {getSupplierPurchaseSummary} = require('../controllers/purchaseSummary');

router.route('/summary').get(authorizeRoles(["admin", "user"]), getSupplierPurchaseSummary);

module.exports = router;