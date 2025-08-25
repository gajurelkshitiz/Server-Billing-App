// routes/financialDocuments.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');

const { createDocument, getDocumentsByCustomer } = require('../controllers/CustomerFinancialDocument');

// Create a new document
router.post('/', upload.single('file'), createDocument);

// Get all documents for a particular customer
router.get('/:customerID', getDocumentsByCustomer);

module.exports = router;
