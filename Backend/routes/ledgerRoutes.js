// routes/ledgerRoutes.js
const express = require("express");

const router = express.Router();

const {
    getCustomerLedger,
    getSupplierLedger
} = require("../controllers/LedgerController.js")

// These two routes are differentiated by their paths:
// "/customers/:customerId" is for customer ledgers,
// "/suppliers/:supplierId" is for supplier ledgers.
router.get("/customers/:customerId", getCustomerLedger);
router.get("/suppliers/:supplierId", getSupplierLedger);

module.exports = router;
