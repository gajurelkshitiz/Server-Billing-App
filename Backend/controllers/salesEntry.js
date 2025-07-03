const SalesEntry = require('../models/salesEntry');
const Customer = require('../models/Customer');
const FiscalYear = require('../models/FiscalYear');
const { BadRequestError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
const  uploadOnCloudinary  = require('../utils/cloudinary')

// Create a new sales entry
const createSalesEntry = async (req, res) => {
  console.log('before creating sales entry, ', req.body);
  const { customerID, billNo, date, amount, itemDescription,  netTotalAmount } = req.body;
  if ( !customerID || !billNo || !date || !amount || !itemDescription ||  !netTotalAmount ) {
    throw new BadRequestError('Please provide all values');
  }
  console.log(req.body)

  const billAttachmentPath  = req.file.path
  if (!billAttachmentPath) {
    throw new BadRequestError("Bill file is missing")
  }

  const billAttachment = await uploadOnCloudinary(
    billAttachmentPath,
    `${Date.now()}-${req.file.originalname}`, // or any custom name you want 
    "BILL APP/BILL IMAGES/SalesEntries"
  )
  
  if (!billAttachment.url) {
    throw new BadRequestError('Error while uploading on bill')
  }



  let companyID;
  // for user, companyID from token:
  companyID = req.user.companyID;

  // for admin, where companyID comes from param
  if (!companyID && req.query.companyID){
    companyID = req.query.companyID;
  }

  // put the customer Name here in the database:
  const customerObj = await Customer.findOne({_id: customerID})
  const customerName = customerObj.name;

  // save the current fiscal Year value also, for filter by filter year later
  const fiscalYearObj = await FiscalYear.findOne({status:true})
  const fiscalYear = fiscalYearObj.name;

  req.body.billAttachment = billAttachment.url
  req.body.createdBy = req.user.tokenID;
  req.body.adminID = req.user.adminID;
  req.body.companyID = companyID;
  req.body.customerName = customerName;
  req.body.fiscalYear = fiscalYear;

  const salesEntry = await SalesEntry.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ salesEntry });
};


// Get all sales entries
const getAllSalesEntries = async (req, res) => {

  let companyID;
  // for user, companyID from token:
  companyID = req.user.companyID;

  // for admin, where companyID comes from param
  if (!companyID && req.query.companyID){
    companyID = req.query.companyID;
  }

  const salesEntries = await SalesEntry.find({ companyID: companyID }).sort('createdAt');

  res.status(StatusCodes.OK).json({ salesEntries, count: salesEntries.length });
};


// Get a single sales entry
const getSalesEntry = async (req, res) => {
  const {
    params: { id: salesEntryID },
  } = req;

  const salesEntry = await SalesEntry.findOne({ _id: salesEntryID });

  if (!salesEntry) {
    throw new NotFoundError(`No Sales Entry Found.`);
  }

  res.status(StatusCodes.OK).json({ salesEntry });
};


// Update a sales entry
const updateSalesEntry = async (req, res) => {
  const {
    params: { id: salesEntryID },
    body: { date, amount, itemDescription, CustomerID, billAttachment, paid, dueAmount },
  } = req;

  if (date === '' || amount === '' || itemDescription === '' || CustomerID === '' || billAttachment === undefined || paid === undefined || dueAmount === undefined) {
    throw new BadRequestError('All fields cannot be empty');
  }

  const salesEntry = await SalesEntry.findOneAndUpdate(
    { _id: salesEntryID },
    req.body,
    { new: true, runValidators: true }
  );

  if (!salesEntry) {
    throw new NotFoundError(`No Sales Entry Found with id: ${salesEntryID}`);
  }
  res.status(StatusCodes.OK).json({ salesEntry });
};

// Delete a sales entry
const deleteSalesEntry = async (req, res) => {
  const {
    params: { id: salesEntryID },
  } = req;

  const salesEntry = await SalesEntry.findOneAndDelete({ _id: salesEntryID });

  if (!salesEntry) {
    throw new NotFoundError(`No Sales Entry Found with id: ${salesEntryID}`);
  }
  res.status(StatusCodes.OK).json({ msg: 'Success! Sales Entry removed.' });
};

module.exports = {
  createSalesEntry,
  getAllSalesEntries,
  getSalesEntry,
  updateSalesEntry,
  deleteSalesEntry,
};