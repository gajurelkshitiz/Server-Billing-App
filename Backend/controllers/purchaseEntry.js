const PurchaseEntry = require('../models/PurchaseEntry');
const { BadRequestError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
const { getFilePathFromRequest } = require("../utils/filePathHelper");

// Create a new purchase entry
const createPurchaseEntry = async (req, res) => {
  console.log(req.body);
  const { date, amount, itemDescription, supplierID, paid, dueAmount } = req.body;
  if (!date || !amount || !itemDescription || !supplierID || paid === undefined || dueAmount === undefined) {
    throw new BadRequestError('Please provide all values');
  }
  
  if (!req.file || !req.file.path) {
    throw new BadRequestError("Bill file is missing");
  }

  // Generate file path using helper
  req.body.billAttachment = getFilePathFromRequest(req, 'purchase');

  let companyID;
  companyID = req.user.companyID;
  if (!companyID && req.query.companyID) {
    companyID = req.query.companyID;
  }

  req.body.createdBy = req.user.tokenID;
  req.body.adminID = req.user.adminID;
  req.body.companyID = companyID;

  const purchaseEntry = await PurchaseEntry.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ purchaseEntry });
};

// Get all purchase entries
const getAllPurchaseEntries = async (req, res) => {
  // ID's from token
  const { adminID, companyID, tokenID } = req.user;

  let purchaseEntries;

  if (adminID) {
    // User: fetch purchase Entry created by this user
    purchaseEntries = await PurchaseEntry.find({ companyID: companyID }).sort('createdAt');
  } else {
    // Admin: fetch purhcase Entry created by admin (adminID == null) or by users under this admin (adminID == tokenID)
    purchaseEntries = await PurchaseEntry.find({
      $or: [
        { createdBy: tokenID, adminID: null },
        { adminID: tokenID }
      ]
    }).sort('createdAt');
  }

  // const purchaseEntries = await PurchaseEntry.find({}).sort('createdAt');
  res.status(StatusCodes.OK).json({ purchaseEntries, count: purchaseEntries.length });
};

// Get a single purchase entry
const getPurchaseEntry = async (req, res) => {
  const {
    params: { id: purchaseEntryID },
  } = req;

  const purchaseEntry = await PurchaseEntry.findOne({ _id: purchaseEntryID });

  if (!purchaseEntry) {
    throw new NotFoundError(`No Purchase Entry Found.`);
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
    throw new NotFoundError(`No Purchase Entry Found with id: ${purchaseEntryID}`);
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
    throw new NotFoundError(`No Purchase Entry Found with id: ${purchaseEntryID}`);
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