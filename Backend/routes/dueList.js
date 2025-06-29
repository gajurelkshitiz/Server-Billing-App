const express = require('express');
const { getPurchaseDuesList, 
        getPurchaseDuesSummary, 
        getSalesDuesList,
        getSalesDuesSummary } = require('../controllers/dueList');

const router = express.Router();

// Routes for dues
router.get('/getPurchaseDuesList', getPurchaseDuesList);
router.get('/getPurchaseDuesSummary', getPurchaseDuesSummary);
router.get('/getSalesDuesList', getSalesDuesList);
router.get('/getSalesDuesSummary', getSalesDuesSummary);

module.exports = router;
