const PurchaseEntry = require('../models/PurchaseEntry');
const Supplier = require('../models/Supplier')
const { BadRequestError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
const { getFilePathFromRequest, cleanupTempFile, moveFileToFinalLocation } = require("../utils/filePathHelper");
const FiscalYear = require('../models/FiscalYear');
const Company = require('../models/company');

// Create a new purchase entry
const createPurchaseEntry = async (req, res) => {
  // console.log('checking for body value in purchase entry', req.body);
  console.log('checking inside body of purchase entry', req.body);
  console.log('req.file: ', req.file);
  const { supplierID, billNo, date, dueAmount, itemDescription, netDueAmount } = req.body;
  if (!supplierID || !billNo || !date || !dueAmount || !itemDescription || !netDueAmount) {
    throw new BadRequestError('Please provide all values');
  }
  
  if (!req.file || !req.file.path) {
    throw new BadRequestError("Bill file is missing");
  }

  console.log('CompanyID: ', req.user.companyID);
  let companyID;
  // for user, companyID from token:
  companyID = req.user.companyID;

  // for admin, where companyID comes from param
  if (!companyID && req.query.companyID) {
    companyID = req.query.companyID;
  }
  console.log('After filling from query: ', req.query.companyID);

  // Get company info for file handling
  const company = await Company.findById(companyID);
  if (!company) {
    throw new BadRequestError("Company not found");
  }

  // get the supplier Name here in the database: 
  const supplierObj = await Supplier.findOne({ _id: supplierID });
  console.log('Supplier Object: ', supplierObj);
  const supplierName = supplierObj.name;

  
  // save the current fiscal Year value also, for filter by filter year later
  const fiscalYearObj = await FiscalYear.findOne({ status: true });
  const fiscalYear = fiscalYearObj.name;

  // Create Purchase Entry first:
  const purchaseEntry = await PurchaseEntry.create({
    ...req.body,
    createdBy: req.user.tokenID,
    adminID: req.user.adminID,
    companyID: companyID,
    supplierName: supplierName,
    fiscalYear: fiscalYear
  })

  // Handle bill attachment upload after sales entry creation
  if (req.file) {
    try {
      const billAttachmentPath = await moveFileToFinalLocation(
        req.file.path,
        req.user.adminID || req.user.tokenID,
        req.user.name,
        'purchase',
        req.file.filename,
        company._id,
        company.name,
        purchaseEntry.billNo,  // ← Pass bill number as entity name
        purchaseEntry._id      // ← Pass sales entry ID as entity ID
      );
      
      purchaseEntry.billAttachment = billAttachmentPath;
      await purchaseEntry.save();
    } catch (error) {
      console.error('Error moving bill attachment:', error);
      cleanupTempFile(req.file.path);
    }
  }

  res.status(StatusCodes.CREATED).json({ purchaseEntry });
  
};

// Get all purchase entries
const getAllPurchaseEntries = async (req, res) => {

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;

  // CompanyID logic: from token (user) or from query (admin)
  let companyID = req.user.companyID;
  if (!companyID && req.query.companyID) {
    companyID = req.query.companyID;
  }

  // Build filter dynamically
  const filter = { companyID };

  const {
    startDate,
    endDate,
    supplierID, // Add this
    supplierName,
    minAmount,
    maxAmount,
  } = req.query;

  if (startDate && endDate) {
    filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  if (supplierID) {
    filter.supplierID = supplierID; // Add this filter
  }

  if (supplierName) {
    filter.supplierName = { $regex: supplierName, $options: 'i' };
  }

  if (minAmount && maxAmount) {
    filter.amount = { $gte: parseFloat(minAmount), $lte: parseFloat(maxAmount) };
  }

  // Count & query
  const total = await PurchaseEntry.countDocuments(filter);
  const purchaseEntries = await PurchaseEntry.find(filter)
    .sort('createdAt')
    .skip(startIndex)
    .limit(limit);

  res.status(StatusCodes.OK).json({
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    purchaseEntries,
    count: purchaseEntries.length,
  });



};

// Get a single purchase entry
const getPurchaseEntry = async (req, res) => {
  const {
    params: { id: purchaseEntryID },
  } = req;

  const purchaseEntry = await PurchaseEntry.findOne({ _id: purchaseEntryID });

  if (!purchaseEntry) {
    throw new notFoundError(`No Purchase Entry Found.`);
  }

  res.status(StatusCodes.OK).json({ purchaseEntry });
};

// Update a purchase entry
const updatePurchaseEntry = async (req, res) => {
  const {
    params: { id: purchaseEntryID },
    body: { date, amount, itemDescription, supplierID, billAttachment, paid, dueAmount },
  } = req;

  if (date === '' || amount === '' || itemDescription === '' || supplierID === '' || billAttachment === undefined || paid === undefined || dueAmount === undefined) {
    throw new BadRequestError('All fields cannot be empty');
  }

  const purchaseEntry = await PurchaseEntry.findOneAndUpdate(
    { _id: purchaseEntryID },
    req.body,
    { new: true, runValidators: true }
  );

  if (!purchaseEntry) {
    throw new notFoundError(`No Purchase Entry Found with id: ${purchaseEntryID}`);
  }
  res.status(StatusCodes.OK).json({ purchaseEntry });
};

// Delete a purchase entry
const deletePurchaseEntry = async (req, res) => {
  const {
    params: { id: purchaseEntryID },
  } = req;

  const purchaseEntry = await PurchaseEntry.findOneAndDelete({ _id: purchaseEntryID }); 
  if (!purchaseEntry) {
    throw new notFoundError(`No Purchase Entry Found with id: ${purchaseEntryID}`);
  }
  res.status(StatusCodes.OK).send();
};

module.exports = {
  createPurchaseEntry,
  getAllPurchaseEntries,
  getPurchaseEntry,
  updatePurchaseEntry,
  deletePurchaseEntry,
};