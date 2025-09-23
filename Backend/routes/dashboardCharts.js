const express = require('express');
const router = express.Router();
const dashboardChartService = require("../services/dashboardCharts");

router.get('/data', async (req, res) => {
    try {
        const mode = req.user.mode;
        const companyID = req.user.companyID || req.query.companyID;

        // console.log('companyID', companyID);
        const [ transactionalDistribution, netRevenue, recievableSummary, monthlyRevenue, salesVsPurchase ] = await Promise.all([
            dashboardChartService.transactionDistributionData(mode, companyID),
            dashboardChartService.netRevenueData(mode, companyID),
            dashboardChartService.recievableSummary(mode, companyID),
            dashboardChartService.monthlyRevenue(companyID),
            dashboardChartService.salesVsPurchase(mode, companyID)
        ]);

        // send combined response 
        res.json({
            transactionalDistribution: transactionalDistribution,
            netRevenue: netRevenue,
            recievableSummary: recievableSummary,
            monthlyRevenue: monthlyRevenue,
            salesVsPurchase: salesVsPurchase
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

module.exports = router;