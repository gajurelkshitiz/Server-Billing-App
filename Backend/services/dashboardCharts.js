// Transaction Disctribution :
const { Types } = require('mongoose');
const computerizedSalesEntry = require('../models/computerizedSalesEntry');
const salesEntry = require('../models/salesEntry');
const computerizedPurchaseEntry = require('../models/computerizedPurchaseEntry');
const purchaseEntry = require('../models/PurchaseEntry');
const Customer = require('../models/Customer');
const CustomerPayment = require('../models/CustomerPayment');
// import BikramSambat, {ADToBS, BSToAD}  from "bikram-sambat-js"
const BikramSambat = require('bikram-sambat-js');

const transactionDistributionData = async (mode, companyID) => {
    // console.log('current mode is: ', mode);
    let salesCount;
    let purchaseCount;
    // console.log(companyID);
    if (mode === 'computerized') {
        const salesEntryData = await computerizedSalesEntry.find({ companyID });
        const purchaseEntryData = await computerizedPurchaseEntry.find({ companyID });
        // console.log('mathi wala code chalyo::: computerized mode raxa!');
        // console.log(salesEntryData.length);
        // console.log(purchaseEntryData.length);
        salesCount = salesEntryData.length;
        purchaseCount = purchaseEntryData.length;
    }
    else{
        const salesEntryData = await salesEntry.find({ companyID });
        const purchaseEntryData = await purchaseEntry.find({ companyID });
        // console.log('tala wala code chalyo::: manual mode raxa!');
        // console.log(salesEntryData.length); // count sahi aairako chha.
        // console.log(purchaseEntryData.length);
        salesCount = salesEntryData.length;
        purchaseCount = purchaseEntryData.length;
    }
    return [
        { name: 'sales', value: salesCount, color: '#0088FE' },
        { name: 'purchases', value: purchaseCount, color: '#00C49F' },
    ]
}


const netRevenueData = async (mode, companyID) => {
    let salesEntryData;
    
    if (mode === 'computerized') {
        salesEntryData = await computerizedSalesEntry.aggregate([
            { $match: { companyID: new Types.ObjectId(companyID) } },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" }
                    },
                    revenue: { $sum: "$grandTotal" }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ]);
    } else {
        salesEntryData = await salesEntry.aggregate([
            { $match: { companyID: new Types.ObjectId(companyID) } },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" }
                    },
                    revenue: { $sum: "$netTotalAmount" }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ]);

        // console.log('manual Sales Entry Data: ', salesEntryData);
    }



    // Convert to the desired format
    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const result = salesEntryData.map(item => ({
        month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
        revenue: item.revenue
    }));

    return result;
}



const recievableSummary = async (mode, companyID) => {
    // Step 1: Get total payments
    const customerPaymentData = await CustomerPayment.aggregate([
        { $match: { companyID: new Types.ObjectId(companyID) } },
        { $group: {
            _id: null,
            totalPayment: { $sum: "$amountPaid" }
        }}
    ]);

    const totalPayment = customerPaymentData[0]?.totalPayment || 0;
    console.log("Total Payment:", totalPayment);

    // Step 2: Get sales entries sorted by date (ascending)
    let salesEntryData;
    
    if (mode === 'computerized') {
        salesEntryData = await computerizedSalesEntry.aggregate([
            { $match: { companyID: new Types.ObjectId(companyID) } },
            { $sort: { date: 1 } }, // Sort by date ascending
            {
                $project: {
                    date: 1,
                    amount: "$grandTotal"
                }
            }
        ]);
    } else {
        salesEntryData = await salesEntry.aggregate([
            { $match: { companyID: new Types.ObjectId(companyID) } },
            { $sort: { date: 1 } }, // Sort by date ascending
            {
                $project: {
                    date: 1,
                    amount: "$netTotalAmount"
                }
            }
        ]);
    }

    // Step 3: Find breakeven point
    let cumulativeSales = 0;
    let breakevenDate = null;
    let totalDue = 0;
    let breakevenIndex = -1;
    let remainingDueAtBreakdown = 0;

    for (let i = 0; i < salesEntryData.length; i++) {
        const entry = salesEntryData[i];
        cumulativeSales += entry.amount;
        totalDue += entry.amount;

        // Check if cumulative sales just exceeded total payment
        if (cumulativeSales > totalPayment && breakevenDate === null) {
            breakevenDate = entry.date;
            breakevenIndex = i;
            remainingDueAtBreakdown = cumulativeSales - totalPayment;
            // console.log(`Breakeven achieved on: ${entry.date} with cumulative sales: ${cumulativeSales}`);
        }
    }

    // Step 4: Get sales after breakeven date and calculate current amount (last 30 days)
    let salesAfterBreakeven = [];
    let currentAmount = 0;


    // declearing the variables:
    let thirtyToSixty = 0;
    let sixtyToOneEighty = 0;
    let oneEightyToThreeSixty = 0;
    let moreThanThreeSixty = 0;

    // first entry chai, breakeven point to date and remainingAmount hunuparchaa.
    // Add the first entry at breakeven point with remainingDueAtBreakdown

    console.log('Breakeven Date is: ', breakevenDate);
    if (breakevenDate !== null) {
        salesAfterBreakeven = [{
            date: breakevenDate,
            amount: remainingDueAtBreakdown
        }];

        // console.log('after adding first entry: ', salesAfterBreakeven);
    }


    if (breakevenIndex !== -1) {
        // Get all sales entries after breakeven
        salesAfterBreakeven = salesAfterBreakeven.concat(salesEntryData.slice(breakevenIndex + 1));
        
        // Get today's date in Nepali calendar
        const today = new Date();
        const todayNepali = BikramSambat.ADToBS(today); // This returns string like "2082-06-05"
        
        // Convert string to comparable format (you can use Date parsing or create a helper function)
        const todayNepaliDate = new Date(todayNepali.replace(/-/g, '/'));
        
        // Calculate Nepali dates for different periods
        const thirtyDaysAgoAD = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
        const thirtyDaysAgoNepali = new Date(BikramSambat.ADToBS(thirtyDaysAgoAD).replace(/-/g, '/'));
        
        const sixtyDaysAgoAD = new Date(today.getTime() - (60 * 24 * 60 * 60 * 1000));
        const sixtyDaysAgoNepali = new Date(BikramSambat.ADToBS(sixtyDaysAgoAD).replace(/-/g, '/'));
        
        const oneEightyDaysAgoAD = new Date(today.getTime() - (180 * 24 * 60 * 60 * 1000));
        const oneEightyDaysAgoNepali = new Date(BikramSambat.ADToBS(oneEightyDaysAgoAD).replace(/-/g, '/'));
        
        const threeSixtyDaysAgoAD = new Date(today.getTime() - (360 * 24 * 60 * 60 * 1000));
        const threeSixtyDaysAgoNepali = new Date(BikramSambat.ADToBS(threeSixtyDaysAgoAD).replace(/-/g, '/'));

        // console.log('Today Nepali:', todayNepali);
        // console.log('30 days ago Nepali:', BikramSambat.ADToBS(thirtyDaysAgoAD));

        // Sum amounts from different periods
        salesAfterBreakeven.forEach(entry => {
            const entryDate = new Date(entry.date); // Your entry dates are already in the right format
            
            if (entryDate >= thirtyDaysAgoNepali && entryDate <= todayNepaliDate) {
                currentAmount += entry.amount;
            }
            else if (entryDate >= sixtyDaysAgoNepali && entryDate < thirtyDaysAgoNepali) {
                thirtyToSixty += entry.amount;
            }
            else if (entryDate >= oneEightyDaysAgoNepali && entryDate < sixtyDaysAgoNepali) {
                sixtyToOneEighty += entry.amount;
            }
            else if (entryDate >= threeSixtyDaysAgoNepali && entryDate < oneEightyDaysAgoNepali) {
                oneEightyToThreeSixty += entry.amount;
            }
            else if (entryDate < threeSixtyDaysAgoNepali) {
                moreThanThreeSixty += entry.amount;
            }
        });
    }

    const totalReceivable = totalDue - totalPayment;
    const overDueAmount = totalReceivable - currentAmount;

    const receivableData = [
        { name: 'Current', value: currentAmount, color: '#0088FE' },
        { name: '30-60', value: thirtyToSixty, color: '#00C49F' },
        { name: '60-180', value: sixtyToOneEighty, color: '#FFBB28' },
        { name: '180-360', value: oneEightyToThreeSixty, color: '#FF8042' },
        { name: '>360', value: moreThanThreeSixty, color: '#A28EFF' },
    ];



    // console.log("Receivable Summary:", { 
    //     totalPayment, 
    //     totalDue, 
    //     totalReceivable, 
    //     breakevenDate,
    //     salesAfterBreakevenCount: salesAfterBreakeven.length,
    //     currentAmount,
    //     overDueAmount,
    //     receivableData
    // });

    return {
        totalReceivable,
        currentAmount,
        overDueAmount,
        receivableData
    };
}


const monthlyRevenue = async (companyID) => {
    // Get customer payment data for the company
    const customerPaymentData = await CustomerPayment.aggregate([
        { $match: { companyID: new Types.ObjectId(companyID) } },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                },
                mrr: { $sum: "$amountPaid" }
            }
        },
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1
            }
        }
    ]);

    // Get current date and calculate 8 months back
    const currentDate = new Date();
    const eightMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 7, 1);
    
    // Month names array
    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // Create array for last 8 months
    const last8Months = [];
    for (let i = 7; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // getMonth() returns 0-11, we need 1-12
        
        last8Months.push({
            year,
            month,
            monthName: monthNames[month - 1]
        });
    }

    // Map payment data to last 8 months
    const result = last8Months.map(monthInfo => {
        const paymentForMonth = customerPaymentData.find(
            payment => payment._id.year === monthInfo.year && payment._id.month === monthInfo.month
        );
        
        return {
            month: monthInfo.monthName,
            mrr: paymentForMonth ? paymentForMonth.mrr : 0
        };
    });

    console.log("Monthly Revenue Data:", result);
    return result;
};


const salesVsPurchase = async (mode, companyID) => {

    let salesEntryData;
    
    if (mode === 'computerized') {
        salesEntryData = await computerizedSalesEntry.aggregate([
            { $match: { companyID: new Types.ObjectId(companyID) } },
            {
                $group: {
                    // TODO: this is important
                    // _id: {
                    //     year: { $year: "$date" },
                    // },

                    _id: null,
                    revenue: { $sum: "$grandTotal" }
                }
            },
            // {
            //     $sort: {
            //         "_id.year": 1,
            //     }
            // }
        ]);
    } else {
        salesEntryData = await salesEntry.aggregate([
            { $match: { companyID: new Types.ObjectId(companyID) } },
            {
                $group: {
                    // TODO: this is important
                    // _id: {
                    //     year: { $year: "$date" }
                    // },
                    _id: null,
                    revenue: { $sum: "$netTotalAmount" }
                }
            },
            // {
            //     $sort: {
            //         "_id.year": 1,
            //     }
            // }
        ]);

        // console.log('manual Sales Entry Data: ', salesEntryData);
    }

    const customerPaymentData = await CustomerPayment.aggregate([
        { $match: { companyID: new Types.ObjectId(companyID) } },
        { $group: {
            _id: null,
            totalPayment: { $sum: "$amountPaid" }
        }}
    ]);


    console.log('salesEntryData revenue is: ', salesEntryData);
    console.log('customerPaymentData total Payment is: ', customerPaymentData);

    return [
    { name: 'Sales', amount: salesEntryData[0]?.revenue, fill: '#3b82f6' },
    { name: 'Payments', amount: customerPaymentData[0]?.totalPayment, fill: '#10b981' },
  ];



};



// Don't forget to export it
module.exports = {
    transactionDistributionData,
    netRevenueData,
    recievableSummary,
    monthlyRevenue,
    salesVsPurchase
};