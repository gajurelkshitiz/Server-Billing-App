// routes/ledgerRoutes.js
const express = require("express");

const router = express.Router();

const {
    getCustomerLedger,
    getSupplierLedger
} = require("../controllers/LedgerController.js")

router.get("/customers/:customerId", getCustomerLedger);
router.get("/suppliers/:supplierId", getSupplierLedger);

module.exports = router;
