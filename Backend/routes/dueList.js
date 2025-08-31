const express = require('express');
const { 
        // getPurchaseDuesList, 
        // getPurchaseDuesSummary, 
        getSalesDuesList,
        // getSalesDuesSummary,
        getSingleCustomerCompleteData,
        getAllCustomersCompleteData,
} = require('../controllers/dueList');

const router = express.Router();

// Routes for dues
// router.get('/getPurchaseDuesList', getPurchaseDuesList);
// router.get('/getPurchaseDuesSummary', getPurchaseDuesSummary);
router.get('/getSalesDuesList', getSalesDuesList);
// router.get('/getSalesDuesSummary', getSalesDuesSummary);
router.get('/getSingleCustomerCompleteData', getSingleCustomerCompleteData);
router.get('/getAllCustomerCompleteData', getAllCustomersCompleteData);

module.exports = router;