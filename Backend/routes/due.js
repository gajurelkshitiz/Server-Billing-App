const express = require('express');
const { 
        // getPurchaseDuesSummary, 
        getSalesDuesList,
        getPurchaseDuesList, 
        // getSalesDuesSummary,
        getSingleCustomerCompleteData,
        getSingleSupplierCompleteData,
        getAllCustomersCompleteData,
        getAllSuppliersCompleteData
} = require('../controllers/dueList');

const router = express.Router();

// Routes for dues
// router.get('/getPurchaseDuesSummary', getPurchaseDuesSummary);

router.get('/getSalesDuesList', getSalesDuesList); // used
router.get('/getPurchaseDuesList', getPurchaseDuesList);

// router.get('/getSalesDuesSummary', getSalesDuesSummary);
router.get('/getSingleCustomerCompleteData', getSingleCustomerCompleteData); // used
router.get('/getSingleSupplierCompleteData', getSingleSupplierCompleteData);
router.get('/getAllCustomerCompleteData', getAllCustomersCompleteData);
router.get('/getAllSupplierCompleteData', getAllSuppliersCompleteData);

module.exports = router;