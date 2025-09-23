// routes/financialDocuments.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');

const { createCustomerDocument, getDocumentsByCustomer } = require('../controllers/CustomerFinancialDocument');
const { createSupplierDocument } = require('../controllers/SupplierFinancialDocument');

// Create a new document
router.post('/customer', upload.single('file'), createCustomerDocument);
router.post('/supplier', upload.single('file'), createSupplierDocument);

// Get all documents for a particular customer
router.get('customer/:customerID', getDocumentsByCustomer);




module.exports = router;
