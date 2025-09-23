// const Due = require('../models/DueList');
const PurchaseEntry = require('../models/PurchaseEntry');

const Customer = require('../models/Customer');
const Supplier = require('../models/Supplier');
const CustomerPayment = require('../models/CustomerPayment');
const SalesEntry = require('../models/salesEntry');
const ComputerizedSalesEntry = require('../models/computerizedSalesEntry');
const ComputerizedPurchaseEntry = require('../models/computerizedPurchaseEntry');
const User = require('../models/user')
const Admin = require('../models/admin')

const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const { BadRequestError } = require('../errors');


// list all the sales entry for a customer:
const getSalesDuesList = async (req, res) => {
    try {
        const { customerID, companyID } = req.query;
        const userRole = req.user.role;
        const userID = req.user.tokenID;

        // Get user to determine mode
        let user;
        if (userID && userRole === 'admin') {
            user = await Admin.findOne({ _id: userID });
        } else if (userID && userRole === 'user') {
            user = await User.findOne({ _id: userID });
        }

        if (!user) {
            throw new BadRequestError('User Not Found');
        }

        const userMode = user.mode;
        console.log(`Sales dues list - User mode: ${userMode}`);

        // Validate ObjectIds
        if (!ObjectId.isValid(customerID) || !ObjectId.isValid(companyID)) {
            return res.status(400).json({ message: 'Invalid customerID or companyID' });
        }

        // Use aggregation to get sales entries with proper ObjectId conversion
        const collection = userMode === 'computerized' ? ComputerizedSalesEntry : SalesEntry;
        
        let entries;
        
        if (userMode === 'computerized') {
            // For computerized entries, use aggregation with ObjectId conversion
            entries = await ComputerizedSalesEntry.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: [{ $toObjectId: '$customerID' }, new mongoose.Types.ObjectId(customerID)] },
                                { $eq: ['$companyID', new mongoose.Types.ObjectId(companyID)] }
                            ]
                        }
                    }
                },
                {
                    $addFields: {
                        // Map computerized fields to expected frontend structure
                        billNo: '$invoiceNo',
                        amount: '$total',
                        netTotalAmount: '$grandTotal',
                        vat: '$vat',
                        discount: '$discount',
                        discountType: '$discountType',
                        itemDescription: {
                            $reduce: {
                                input: '$items',
                                initialValue: '',
                                in: {
                                    $concat: [
                                        '$$value',
                                        { $cond: [{ $eq: ['$$value', ''] }, '', ', '] },
                                        '$$this.description'
                                    ]
                                }
                            }
                        },
                        billAttachment: { $ifNull: ['$attachment', null] }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        date: 1,
                        billNo: 1,
                        amount: 1,
                        netTotalAmount: 1,
                        vat: 1,
                        discount: 1,
                        discountType: 1,
                        itemDescription: 1,
                        billAttachment: 1,
                        customerID: 1,
                        companyID: 1,
                        createdAt: 1,
                        updatedAt: 1
                    }
                },
                {
                    $sort: { date: -1 }
                }
            ]);
        } else {
            // For regular entries, use direct find with ObjectId conversion
            entries = await SalesEntry.find({
                customerID: new ObjectId(customerID),
                companyID: new ObjectId(companyID)
            }).sort({ date: -1 });
        }

        console.log(`Found ${entries.length} sales entries for customer ${customerID}`);
        
        res.json(entries);
    } catch (error) {
        console.error('Error fetching Sales dues List:', error);
        res.status(500).json({ 
            message: 'Error fetching Sales dues List', 
            error: error.message 
        });
    }
};





// list all the purchase entry for a supplier:
const getPurchaseDuesList = async (req, res) => {
    try {
        const { supplierID, companyID } = req.query;
        const userRole = req.user.role;
        const userID = req.user.tokenID;

        // Get user to determine mode
        let user;
        if (userID && userRole === 'admin') {
            user = await Admin.findOne({ _id: userID });
        } else if (userID && userRole === 'user') {
            user = await User.findOne({ _id: userID });
        }

        if (!user) {
            throw new BadRequestError('User Not Found');
        }

        const userMode = user.mode;
        console.log(`Purchase dues list - User mode: ${userMode}`);

        // Validate ObjectIds
        if (!ObjectId.isValid(supplierID) || !ObjectId.isValid(companyID)) {
            return res.status(400).json({ message: 'Invalid supplierID or companyID' });
        }

        // Use aggregation to get sales entries with proper ObjectId conversion
        const collection = userMode === 'computerized' ? ComputerizedPurchaseEntry : PurchaseEntry;
        
        let entries;
        

        // TODO: yo computerized for puchase entry ko lagi kei ni gareko chhaina, paxi sochera garaula.
        if (userMode === 'computerized') {
            // For computerized entries, use aggregation with ObjectId conversion
            entries = await ComputerizedPurchaseEntry.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: [{ $toObjectId: '$supplierID' }, new mongoose.Types.ObjectId(supplierID)] },
                                { $eq: ['$companyID', new mongoose.Types.ObjectId(companyID)] }
                            ]
                        }
                    }
                },
                {
                    $addFields: {
                        // Map computerized fields to expected frontend structure
                        billNo: '$invoiceNo',
                        amount: '$total',
                        netTotalAmount: '$grandTotal',
                        vat: '$vat',
                        discount: '$discount',
                        discountType: '$discountType',
                        itemDescription: {
                            $reduce: {
                                input: '$items',
                                initialValue: '',
                                in: {
                                    $concat: [
                                        '$$value',
                                        { $cond: [{ $eq: ['$$value', ''] }, '', ', '] },
                                        '$$this.description'
                                    ]
                                }
                            }
                        },
                        billAttachment: { $ifNull: ['$attachment', null] }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        date: 1,
                        billNo: 1,
                        amount: 1,
                        netTotalAmount: 1,
                        vat: 1,
                        discount: 1,
                        discountType: 1,
                        itemDescription: 1,
                        billAttachment: 1,
                        customerID: 1,
                        companyID: 1,
                        createdAt: 1,
                        updatedAt: 1
                    }
                },
                {
                    $sort: { date: -1 }
                }
            ]);
        } else {
            // For regular entries, use direct find with ObjectId conversion
            entries = await PurchaseEntry.find({
                supplierID: new ObjectId(supplierID),
                companyID: new ObjectId(companyID)
            }).sort({ date: -1 });
        }

        console.log(`Found ${entries.length} sales entries for customer ${supplierID}`);
        
        res.json(entries);
    } catch (error) {
        console.error('Error fetching Purchase dues List:', error);
        res.status(500).json({ 
            message: 'Error fetching Purchase dues List', 
            error: error.message 
        });
    }
};





// for single customer complete data to show on customer Info page:
const getSingleCustomerCompleteData = async (req, res) => {
  try {
    const { customerID, companyID } = req.query;
    const userRole = req.user.role;
    const userID = req.user.tokenID;
    console.log(`userRole: ${userRole} and tokenId: ${userID}`);

    let user;
    if (userID && userRole === 'admin') {
      user = await Admin.findOne({ _id: userID });
    } else if (userID && userRole === 'user') {
      user = await User.findOne({ _id: userID });
    }

    if (!user) {
      throw new BadRequestError('User Not Found');
    }
    
    const userMode = user.mode;
    console.log(`for checking user Mode: ${userMode}`);

    // Validate ObjectIds
    if (!ObjectId.isValid(customerID) || !ObjectId.isValid(companyID)) {
      return res.status(400).json({ message: 'Invalid customerID or companyID' });
    }

    const result = await Customer.aggregate([
      // Match the specific customer
      {
        $match: {
          _id: new mongoose.Types.ObjectId(customerID),
          companyID: new mongoose.Types.ObjectId(companyID)
        }
      },
      
      // Fixed lookup with proper ObjectId conversion (same as getAllCustomersCompleteData)
      {
        $lookup: {
          from: userMode === 'computerized' ? 'computerizedsalesentries' : 'salesentries',
          let: { customerId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: [{ $toObjectId: '$customerID' }, '$$customerId'] },
                    { $eq: ['$companyID', new mongoose.Types.ObjectId(companyID)] }
                  ]
                }
              }
            }
          ],
          as: 'salesEntries'
        }
      },
      
      // Lookup payments
      {
        $lookup: {
          from: 'customerpayments',
          localField: '_id',
          foreignField: 'customerID',
          as: 'payments'
        }
      },
      
      // Add calculated fields (dynamic based on mode)
      {
        $addFields: {
          totalSalesAmount: { 
            $sum: userMode === 'computerized' 
              ? '$salesEntries.grandTotal' 
              : '$salesEntries.netTotalAmount' 
          },
          totalPayments: { $sum: '$payments.amountPaid' },
          thisYearDue: {
            $subtract: [
              { 
                $sum: userMode === 'computerized' 
                  ? '$salesEntries.grandTotal' 
                  : '$salesEntries.netTotalAmount' 
              },
              { $sum: '$payments.amountPaid' }
            ]
          },
          netTotalDue: {
            $subtract: [
              { 
                $add: [
                  '$prevClosingBalance', 
                  { 
                    $sum: userMode === 'computerized' 
                      ? '$salesEntries.grandTotal' 
                      : '$salesEntries.netTotalAmount' 
                  }
                ] 
              },
              { $sum: '$payments.amountPaid' }
            ]
          },
          lastSaleDate: { $max: '$salesEntries.date' },
          lastPaymentDate: { $max: '$payments.createdAt' }
        }
      },
      
      // Project only the fields you want to send to frontend
      {
        $project: {
          name: 1,
          email: 1,
          phoneNo: 1,
          address: 1,
          prevClosingBalance: 1,
          totalSalesAmount: 1,
          totalPayments: 1,
          netTotalDue: 1,
          thisYearDue: 1,
          lastSaleDate: 1,
          lastPaymentDate: 1,
          creditLimitAmount: 1,
          creditTimePeriodInDays: 1
        }
      }
    ]);


    if (!result || result.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Customer not found' 
      });
    }

    const customer = result[0];

    // just for debug purpose:
    console.log("Number of Sales Entries Found: ", customer.salesentries?.length || 0);
    
    const customerData = {
      customerID: customer._id,
      name: customer.name,
      email: customer.email,
      phone: customer.phoneNo,
      address: customer.address,
      prevClosingBalance: customer.prevClosingBalance || 0,
      totalSales: customer.totalSalesAmount || 0,
      totalPayments: customer.totalPayments || 0,
      totalDue: customer.netTotalDue || 0,
      currentDue: customer.thisYearDue || 0,
      lastSaleDate: customer.lastSaleDate,
      lastPaymentDate: customer.lastPaymentDate,
      status: customer.netTotalDue > 0 ? 'due' : 'paid',
      creditLimitAmount: customer.creditLimitAmount,
      creditTimePeriodInDays: customer.creditTimePeriodInDays
    };

    // for debug purpose:
    console.log('Customer Complete Data is: ', customerData);

    res.json({
      success: true,
      customer: customerData
    });

  } catch (error) {
    console.error('Error fetching customer data:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching customer data', 
      error: error.message 
    });
  }
};




// for single supplier complete data to show on customer Info page:
const getSingleSupplierCompleteData = async (req, res) => {
  try {
    const { supplierID, companyID } = req.query;
    const userRole = req.user.role;
    const userID = req.user.tokenID;
    console.log(`userRole: ${userRole} and tokenId: ${userID}`);

    let user;
    if (userID && userRole === 'admin') {
      user = await Admin.findOne({ _id: userID });
    } else if (userID && userRole === 'user') {
      user = await User.findOne({ _id: userID });
    }

    if (!user) {
      throw new BadRequestError('User Not Found');
    }
    
    const userMode = user.mode;
    console.log(`for checking user Mode: ${userMode}`);

    // Validate ObjectIds
    if (!ObjectId.isValid(supplierID) || !ObjectId.isValid(companyID)) {
      return res.status(400).json({ message: 'Invalid supplierID or companyID' });
    }

    const result = await Supplier.aggregate([
      // Match the specific customer
      {
        $match: {
          _id: new mongoose.Types.ObjectId(supplierID),
          companyID: new mongoose.Types.ObjectId(companyID)
        }
      },
      
      // Fixed lookup with proper ObjectId conversion (same as getAllCustomersCompleteData)
      {
        $lookup: {
          from: userMode === 'computerized' ? 'computerizedpurchaseentries' : 'purchaseentries',
          let: { supplierId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: [{ $toObjectId: '$supplierID' }, '$$supplierId'] },
                    { $eq: ['$companyID', new mongoose.Types.ObjectId(companyID)] }
                  ]
                }
              }
            }
          ],
          as: 'purchaseEntries'
        }
      },
      
      // Lookup payments
      {
        $lookup: {
          from: 'supplierpayments',
          localField: '_id',
          foreignField: 'supplierID',
          as: 'payments'
        }
      },
      
      // Add calculated fields (dynamic based on mode)
      {
        $addFields: {
          totalPurchaseAmount: { 
            $sum: userMode === 'computerized' 
              ? '$purchaseEntries.grandTotal' 
              : '$purchaseEntries.netDueAmount' 
          },
          totalPayments: { $sum: '$payments.amountPaid' },
          thisYearDue: {
            $subtract: [
              { 
                $sum: userMode === 'computerized' 
                  ? '$purchaseEntries.grandTotal' 
                  : '$purchaseEntries.netDueAmount' 
              },
              { $sum: '$payments.amountPaid' }
            ]
          },
          netTotalDue: {
            $subtract: [
              { 
                $add: [
                  '$prevClosingBalance', 
                  { 
                    $sum: userMode === 'computerized' 
                      ? '$purchaseEntries.grandTotal' 
                      : '$purchaseEntries.netDueAmount' 
                  }
                ] 
              },
              { $sum: '$payments.amountPaid' }
            ]
          },
          lastPurchaseDate: { $max: '$purchaseEntries.date' },
          lastPaymentDate: { $max: '$payments.createdAt' }
        }
      },
      
      // Project only the fields you want to send to frontend
      {
        $project: {
          name: 1,
          email: 1,
          phoneNo: 1,
          address: 1,
          prevClosingBalance: 1,
          totalPurchaseAmount: 1,
          totalPayments: 1,
          netTotalDue: 1,
          thisYearDue: 1,
          lastPurchaseDate: 1,
          lastPaymentDate: 1,
          creditLimitAmount: 1,
          creditTimePeriodInDays: 1
        }
      }
    ]);

    if (!result || result.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Supplier not found' 
      });
    }

    const supplier = result[0];
    
    const supplierData = {
      supplierID: supplier._id,
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phoneNo,
      address: supplier.address,
      prevClosingBalance: supplier.prevClosingBalance || 0,
      totalPurchase: supplier.totalPurchaseAmount || 0,
      totalPayments: supplier.totalPayments || 0,
      totalDue: supplier.netTotalDue || 0,
      currentDue: supplier.thisYearDue || 0,
      lastPurchaseDate: supplier.lastPurchaseDate,
      lastPaymentDate: supplier.lastPaymentDate,
      status: supplier.netTotalDue > 0 ? 'due' : 'paid',
      creditLimitAmount: supplier.creditLimitAmount,
      creditTimePeriodInDays: supplier.creditTimePeriodInDays
    };

    // for debug purpose:
    console.log('Supplier Complete Data is: ', supplierData);

    res.json({
      success: true,
      supplier: supplierData
    });

  } catch (error) {
    console.error('Error fetching supplier data:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching supplier data', 
      error: error.message 
    });
  }
};





const getAllCustomersCompleteData = async (req, res) => {
  try {
    const { companyID } = req.query;
    const userRole = req.user.role;
    const userID = req.user.tokenID;

    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    // Filter parameters
    const {
      customerName,
      minDue,
      maxDue,
      minSales,
      maxSales,
      lastSaleDateFrom,
      lastSaleDateTo,
      lastPaymentDateFrom,
      lastPaymentDateTo,
      status,
      quickFilter,
      dueRatio, // For percentage-based filtering
      inactiveDays // For inactive customers
    } = req.query;

    let user;
    if (userID && userRole === 'admin') {
      user = await Admin.findOne({ _id: userID });
    } else if (userID && userRole === 'user') {
      user = await User.findOne({ _id: userID });
    }

    if (!user) {
      throw new BadRequestError('User Not Found');
    }

    const userMode = user.mode;
    console.log(`User mode: ${userMode}`);

    if (!ObjectId.isValid(companyID)) {
      return res.status(400).json({ message: 'Invalid companyID' });
    }

    // Build the aggregation pipeline
    const pipeline = [
      {
        $match: {
          companyID: new mongoose.Types.ObjectId(companyID)
        }
      },
      
      // Apply customer name filter early if provided
      ...(customerName ? [{
        $match: {
          name: { $regex: customerName, $options: 'i' }
        }
      }] : []),
      
      // Fixed lookup with proper ObjectId conversion
      {
        $lookup: {
          from: userMode === 'computerized' ? 'computerizedsalesentries' : 'salesentries',
          let: { customerId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: [{ $toObjectId: '$customerID' }, '$$customerId'] },
                    { $eq: ['$companyID', new mongoose.Types.ObjectId(companyID)] }
                  ]
                }
              }
            }
          ],
          as: 'salesEntries'
        }
      },
      
      // Lookup payments
      {
        $lookup: {
          from: 'customerpayments',
          localField: '_id',
          foreignField: 'customerID',
          as: 'payments'
        }
      },
      
      // Add calculated fields
      {
        $addFields: {
          totalSalesAmount: { 
            $sum: userMode === 'computerized' 
              ? '$salesEntries.grandTotal' 
              : '$salesEntries.netTotalAmount' 
          },
          totalPayments: { $sum: '$payments.amountPaid' },
          thisYearDue: {
            $subtract: [
              { 
                $sum: userMode === 'computerized' 
                  ? '$salesEntries.grandTotal' 
                  : '$salesEntries.netTotalAmount' 
              },
              { $sum: '$payments.amountPaid' }
            ]
          },
          netTotalDue: {
            $subtract: [
              { 
                $add: [
                  '$prevClosingBalance', 
                  { 
                    $sum: userMode === 'computerized' 
                      ? '$salesEntries.grandTotal' 
                      : '$salesEntries.netTotalAmount' 
                  }
                ] 
              },
              { $sum: '$payments.amountPaid' }
            ]
          },
          lastSaleDate: { $max: '$salesEntries.date' },
          lastPaymentDate: { $max: '$payments.createdAt' },
          dueToSalesRatio: {
            $cond: {
              if: { $gt: [{ $sum: userMode === 'computerized' ? '$salesEntries.grandTotal' : '$salesEntries.netTotalAmount' }, 0] },
              then: {
                $divide: [
                  {
                    $subtract: [
                      { 
                        $add: [
                          '$prevClosingBalance', 
                          { 
                            $sum: userMode === 'computerized' 
                              ? '$salesEntries.grandTotal' 
                              : '$salesEntries.netTotalAmount' 
                          }
                        ] 
                      },
                      { $sum: '$payments.amountPaid' }
                    ]
                  },
                  { $sum: userMode === 'computerized' ? '$salesEntries.grandTotal' : '$salesEntries.netTotalAmount' }
                ]
              },
              else: 0
            }
          }
        }
      }
    ];

    // Apply amount-based filters
    const matchConditions = {};

    if (minDue || maxDue) {
      matchConditions.netTotalDue = {};
      if (minDue) matchConditions.netTotalDue.$gte = parseFloat(minDue);
      if (maxDue) matchConditions.netTotalDue.$lte = parseFloat(maxDue);
    }

    if (minSales || maxSales) {
      matchConditions.totalSalesAmount = {};
      if (minSales) matchConditions.totalSalesAmount.$gte = parseFloat(minSales);
      if (maxSales) matchConditions.totalSalesAmount.$lte = parseFloat(maxSales);
    }

    // Apply date-based filters
    if (lastSaleDateFrom || lastSaleDateTo) {
      matchConditions.lastSaleDate = {};
      if (lastSaleDateFrom) matchConditions.lastSaleDate.$gte = new Date(lastSaleDateFrom);
      if (lastSaleDateTo) matchConditions.lastSaleDate.$lte = new Date(lastSaleDateTo);
    }

    if (lastPaymentDateFrom || lastPaymentDateTo) {
      matchConditions.lastPaymentDate = {};
      if (lastPaymentDateFrom) matchConditions.lastPaymentDate.$gte = new Date(lastPaymentDateFrom);
      if (lastPaymentDateTo) matchConditions.lastPaymentDate.$lte = new Date(lastPaymentDateTo);
    }

    // Apply status filter
    if (status) {
      if (status === 'due') {
        matchConditions.netTotalDue = { $gt: 0 };
      } else if (status === 'paid') {
        matchConditions.netTotalDue = { $lte: 0 };
      }
    }

    // Apply due ratio filter (percentage)
    if (dueRatio) {
      matchConditions.dueToSalesRatio = { $gte: parseFloat(dueRatio) / 100 };
    }

    // Apply inactive days filter
    if (inactiveDays) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - parseInt(inactiveDays));
      matchConditions.lastSaleDate = { $lt: cutoffDate };
    }

    // Apply quick filters
    if (quickFilter) {
      const currentDate = new Date();
      switch (quickFilter) {
        case 'highDues':
          matchConditions.netTotalDue = { $gt: 5000 };
          break;
        case 'noSales6Months':
          const sixMonthsAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 6));
          matchConditions.lastSaleDate = { $lt: sixMonthsAgo };
          break;
        case 'noPayments3Months':
          const threeMonthsAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 3));
          matchConditions.lastPaymentDate = { $lt: threeMonthsAgo };
          break;
        case 'highRisk':
          matchConditions.$and = [
            { netTotalDue: { $gt: 5000 } },
            { lastPaymentDate: { $lt: new Date(new Date().setMonth(new Date().getMonth() - 6)) } }
          ];
          break;
        case 'topDues':
          // This will be handled separately with sorting and limiting
          break;
      }
    }

    // Add match stage if we have conditions
    if (Object.keys(matchConditions).length > 0) {
      pipeline.push({ $match: matchConditions });
    }

    // Add projection stage
    pipeline.push({
      $project: {
        name: 1,
        email: 1,
        phoneNo: 1,
        address: 1,
        prevClosingBalance: 1,
        totalSalesAmount: 1,
        totalPayments: 1,
        netTotalDue: 1,
        thisYearDue: 1,
        lastSaleDate: 1,
        lastPaymentDate: 1,
        dueToSalesRatio: 1
      }
    });

    // Handle topDues quick filter with sorting
    if (quickFilter === 'topDues') {
      pipeline.push({ $sort: { netTotalDue: -1 } });
      pipeline.push({ $limit: 10 });
    } else {
      // Regular sorting
      pipeline.push({ $sort: { name: 1 } });
    }

    // Get total count for pagination
    const countPipeline = [...pipeline];
    countPipeline.push({ $count: "total" });
    const countResult = await Customer.aggregate(countPipeline);
    const total = countResult.length > 0 ? countResult[0].total : 0;

    // Apply pagination (skip for topDues since it has its own limit)
    if (quickFilter !== 'topDues') {
      pipeline.push({ $skip: startIndex });
      pipeline.push({ $limit: limit });
    }

    // Execute the main pipeline
    const result = await Customer.aggregate(pipeline);

    console.log(`Found ${result.length} customers with filters applied`);

    const remappedData = result.map(customer => ({
      customerID: customer._id,
      name: customer.name,
      email: customer.email,
      phone: customer.phoneNo,
      address: customer.address,
      prevClosingBalance: customer.prevClosingBalance || 0,
      totalSales: customer.totalSalesAmount || 0,
      totalPayments: customer.totalPayments || 0,
      totalDue: customer.netTotalDue || 0,
      currentDue: customer.thisYearDue || 0,
      lastSaleDate: customer.lastSaleDate,
      lastPaymentDate: customer.lastPaymentDate,
      dueToSalesRatio: customer.dueToSalesRatio || 0,
      status: customer.netTotalDue > 0 ? 'due' : 'paid'
    }));

    res.json({
      success: true,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      count: remappedData.length,
      customers: remappedData
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching customers data', 
      error: error.message 
    });
  }
};




const getAllSuppliersCompleteData = async (req, res) => {
  try {
    const { companyID } = req.query;
    const userRole = req.user.role;
    const userID = req.user.tokenID;

    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    // Filter parameters
    const {
      supplierName,
      minDue,
      maxDue,
      minPurchase,
      maxPurchase,
      lastPurchaseDateFrom,
      lastPurchaseDateTo,
      lastPaymentDateFrom,
      lastPaymentDateTo,
      status,
      quickFilter,
      dueRatio, // For percentage-based filtering
      inactiveDays // For inactive customers
    } = req.query;

    let user;
    if (userID && userRole === 'admin') {
      user = await Admin.findOne({ _id: userID });
    } else if (userID && userRole === 'user') {
      user = await User.findOne({ _id: userID });
    }

    if (!user) {
      throw new BadRequestError('User Not Found');
    }

    const userMode = user.mode;
    console.log(`User mode: ${userMode}`);

    if (!ObjectId.isValid(companyID)) {
      return res.status(400).json({ message: 'Invalid companyID' });
    }

    // Build the aggregation pipeline
    const pipeline = [
      {
        $match: {
          companyID: new mongoose.Types.ObjectId(companyID)
        }
      },
      
      // Apply customer name filter early if provided
      ...(supplierName ? [{
        $match: {
          name: { $regex: supplierName, $options: 'i' }
        }
      }] : []),
      
      // Fixed lookup with proper ObjectId conversion
      {
        $lookup: {
          from: userMode === 'computerized' ? 'computerizedpurchaseentries' : 'purchaseEntries',
          let: { supplierId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: [{ $toObjectId: '$supplierID' }, '$$supplierId'] },
                    { $eq: ['$companyID', new mongoose.Types.ObjectId(companyID)] }
                  ]
                }
              }
            }
          ],
          as: 'purchaseEntries'
        }
      },
      
      // Lookup payments
      {
        $lookup: {
          from: 'supplierpayments',
          localField: '_id',
          foreignField: 'supplierID',
          as: 'payments'
        }
      },
      
      // Add calculated fields
      {
        $addFields: {
          totalSalesAmount: { 
            $sum: userMode === 'computerized' 
              ? '$purchaseEntries.grandTotal' 
              : '$purchaseEntries.netTotalAmount' 
          },
          totalPayments: { $sum: '$payments.amountPaid' },
          thisYearDue: {
            $subtract: [
              { 
                $sum: userMode === 'computerized' 
                  ? '$purchaseEntries.grandTotal' 
                  : '$purchaseEntries.netTotalAmount' 
              },
              { $sum: '$payments.amountPaid' }
            ]
          },
          netTotalDue: {
            $subtract: [
              { 
                $add: [
                  '$prevClosingBalance', 
                  { 
                    $sum: userMode === 'computerized' 
                      ? '$purchaseEntries.grandTotal' 
                      : '$purchaseEntries.netTotalAmount' 
                  }
                ] 
              },
              { $sum: '$payments.amountPaid' }
            ]
          },
          lastSaleDate: { $max: '$purchaseEntries.date' },
          lastPaymentDate: { $max: '$payments.createdAt' },
          dueToPurchaseRatio: {
            $cond: {
              if: { $gt: [{ $sum: userMode === 'computerized' ? '$purchaseEntries.grandTotal' : '$purchaseEntries.netTotalAmount' }, 0] },
              then: {
                $divide: [
                  {
                    $subtract: [
                      { 
                        $add: [
                          '$prevClosingBalance', 
                          { 
                            $sum: userMode === 'computerized' 
                              ? '$purchaseEntries.grandTotal' 
                              : '$purchaseEntries.netTotalAmount' 
                          }
                        ] 
                      },
                      { $sum: '$payments.amountPaid' }
                    ]
                  },
                  { $sum: userMode === 'computerized' ? '$purchaseEntries.grandTotal' : '$purchaseEntries.netTotalAmount' }
                ]
              },
              else: 0
            }
          }
        }
      }
    ];

    // Apply amount-based filters
    const matchConditions = {};

    if (minDue || maxDue) {
      matchConditions.netTotalDue = {};
      if (minDue) matchConditions.netTotalDue.$gte = parseFloat(minDue);
      if (maxDue) matchConditions.netTotalDue.$lte = parseFloat(maxDue);
    }

    if (minPurchase || maxPurchase) {
      matchConditions.totalSalesAmount = {};
      if (minPurchase) matchConditions.totalSalesAmount.$gte = parseFloat(minPurchase);
      if (maxPurchase) matchConditions.totalSalesAmount.$lte = parseFloat(maxPurchase);
    }

    // Apply date-based filters
    if (lastPurchaseDateFrom || lastPurchaseDateTo) {
      matchConditions.lastSaleDate = {};
      if (lastPurchaseDateFrom) matchConditions.lastPurchaseDate.$gte = new Date(lastPurchaseDateFrom);
      if (lastPurchaseDateTo) matchConditions.lastPurchaseDate.$lte = new Date(lastPurchaseDateTo);
    }

    if (lastPaymentDateFrom || lastPaymentDateTo) {
      matchConditions.lastPaymentDate = {};
      if (lastPaymentDateFrom) matchConditions.lastPaymentDate.$gte = new Date(lastPaymentDateFrom);
      if (lastPaymentDateTo) matchConditions.lastPaymentDate.$lte = new Date(lastPaymentDateTo);
    }

    // Apply status filter
    if (status) {
      if (status === 'due') {
        matchConditions.netTotalDue = { $gt: 0 };
      } else if (status === 'paid') {
        matchConditions.netTotalDue = { $lte: 0 };
      }
    }

    // Apply due ratio filter (percentage)
    if (dueRatio) {
      matchConditions.dueToPurchaseRatio = { $gte: parseFloat(dueRatio) / 100 };
    }

    // Apply inactive days filter
    if (inactiveDays) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - parseInt(inactiveDays));
      matchConditions.lastSaleDate = { $lt: cutoffDate };
    }

    // Apply quick filters
    if (quickFilter) {
      const currentDate = new Date();
      switch (quickFilter) {
        case 'highDues':
          matchConditions.netTotalDue = { $gt: 5000 };
          break;
        case 'noSales6Months':
          const sixMonthsAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 6));
          matchConditions.lastSaleDate = { $lt: sixMonthsAgo };
          break;
        case 'noPayments3Months':
          const threeMonthsAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 3));
          matchConditions.lastPaymentDate = { $lt: threeMonthsAgo };
          break;
        case 'highRisk':
          matchConditions.$and = [
            { netTotalDue: { $gt: 5000 } },
            { lastPaymentDate: { $lt: new Date(new Date().setMonth(new Date().getMonth() - 6)) } }
          ];
          break;
        case 'topDues':
          // This will be handled separately with sorting and limiting
          break;
      }
    }

    // Add match stage if we have conditions
    if (Object.keys(matchConditions).length > 0) {
      pipeline.push({ $match: matchConditions });
    }

    // Add projection stage
    pipeline.push({
      $project: {
        name: 1,
        email: 1,
        phoneNo: 1,
        address: 1,
        prevClosingBalance: 1,
        totalSalesAmount: 1,
        totalPayments: 1,
        netTotalDue: 1,
        thisYearDue: 1,
        lastSaleDate: 1,
        lastPaymentDate: 1,
        dueToPurchaseRatio: 1
      }
    });

    // Handle topDues quick filter with sorting
    if (quickFilter === 'topDues') {
      pipeline.push({ $sort: { netTotalDue: -1 } });
      pipeline.push({ $limit: 10 });
    } else {
      // Regular sorting
      pipeline.push({ $sort: { name: 1 } });
    }

    // Get total count for pagination
    const countPipeline = [...pipeline];
    countPipeline.push({ $count: "total" });
    const countResult = await Supplier.aggregate(countPipeline);
    const total = countResult.length > 0 ? countResult[0].total : 0;

    // Apply pagination (skip for topDues since it has its own limit)
    if (quickFilter !== 'topDues') {
      pipeline.push({ $skip: startIndex });
      pipeline.push({ $limit: limit });
    }

    // Execute the main pipeline
    const result = await Supplier.aggregate(pipeline);

    console.log(`Found ${result.length} suppliers with filters applied`);

    const remappedData = result.map(supplier => ({
      supplierID: supplier._id,
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phoneNo,
      address: supplier.address,
      prevClosingBalance: supplier.prevClosingBalance || 0,
      totalPurchase: supplier.totalSalesAmount || 0,
      totalPayments: supplier.totalPayments || 0,
      totalDue: supplier.netTotalDue || 0,
      currentDue: supplier.thisYearDue || 0,
      lastPurchaseDate: supplier.lastSaleDate,
      lastPaymentDate: supplier.lastPaymentDate,
      dueToPurchaseRatio: supplier.dueToSalesRatio || 0,
      status: supplier.netTotalDue > 0 ? 'due' : 'paid'
    }));

    res.json({
      success: true,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      count: remappedData.length,
      suppliers: remappedData
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching suppliers data', 
      error: error.message 
    });
  }
};



module.exports = {
    // getPurchaseDuesSummary,
    getSalesDuesList,
    getPurchaseDuesList,
    // getSalesDuesSummary,
    getSingleCustomerCompleteData,
    getSingleSupplierCompleteData,
    getAllCustomersCompleteData,
    getAllSuppliersCompleteData
};
