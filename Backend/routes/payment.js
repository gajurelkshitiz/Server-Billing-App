const express = require('express');
const { createCustomerPayment, 
        createSupplierPayment,
        getSalesPaymentList,
        getSalesPaymentSummary,
        getPurchasePaymentList,
        getPurchasePaymentSummary } = require('../controllers/paymentList');

const router = express.Router();

// Routes for payments
router.post('/customer', createCustomerPayment);
router.post('/supplier', createSupplierPayment);
router.get('/getSalesPaymentList', getSalesPaymentList);  // used
router.get('/getPurchasePaymentList', getPurchasePaymentList);
router.get('/getSalesPaymentSummary', getSalesPaymentSummary);
router.get('/getPurchasePaymentSummary', getPurchasePaymentSummary);

module.exports = router;
