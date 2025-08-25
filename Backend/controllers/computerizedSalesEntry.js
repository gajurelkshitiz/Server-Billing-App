const ComputerizedSalesEntry = require('../models/computerizedSalesEntry');
const Customer = require('../models/Customer');
const FiscalYear = require('../models/FiscalYear');
const Company = require('../models/company');
const { BadRequestError, notFoundError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
const { ToWords } = require('to-words');

// Helper function to calculate item net amounts
const calculateItemNetAmounts = (items) => {
  return items.map(item => {
    const baseAmount = parseFloat(item.amount) || 0;
    const discount = parseFloat(item.discount) || 0;
    const discountType = item.discountType || 'percentage';
    
    let discountAmount = 0;
    if (discountType === 'percentage') {
      discountAmount = (baseAmount * discount) / 100;
    } else {
      discountAmount = discount;
    }
    
    const netAmount = baseAmount - discountAmount;
    
    return {
      ...item,
      netAmount: Math.max(0, netAmount) // Ensure net amount is not negative
    };
  });
};

// Create a new computerized sales entry
const createComputerizedSalesEntry = async (req, res) => {
  // Destructure required fields from body
  const {
    customerID,
    date,
    shipperName,
    shipperAddress,
    items,
    total,
    taxableAmount,
    vat,
    vatAmount,
    grandTotal,
  } = req.body;

  // Validate required fields
  if (
    !customerID ||
    !date ||
    !items ||
    !Array.isArray(items) ||
    items.length === 0 ||
    !total ||
    !taxableAmount ||
    !grandTotal
  ) {
    throw new BadRequestError('Please provide all required fields and at least one item.');
  }

  console.log('Inside sales Entry : Items ==> ', items);

  // Get companyID from token or query
  let companyID = req.user.companyID;
  if (!companyID && req.query.companyID) {
    companyID = req.query.companyID;
  }

  console.log('companyID', companyID);
  // Get company info
  const company = await Company.findById(companyID);
  if (!company) {
    throw new BadRequestError("Company not found");
  }

  // Get customer name
  const customerObj = await Customer.findById(customerID);
  if (!customerObj) {
    throw new BadRequestError("Customer not found");
  }
  const customerName = customerObj.name;

  // Get current fiscal year
  const fiscalYearObj = await FiscalYear.findOne({ status: true });
  if (!fiscalYearObj) {
    throw new BadRequestError("Fiscal Year not found");
  }
  const fiscalYear = fiscalYearObj.name;

  // Process items with net amount calculations
  const processedItems = calculateItemNetAmounts(items);
  
  // Verify that taxableAmount matches sum of net amounts
  const calculatedTaxableAmount = processedItems.reduce((sum, item) => 
    sum + (parseFloat(item.netAmount) || 0), 0
  );

  // Allow small floating point differences (up to 0.01)
  if (Math.abs(calculatedTaxableAmount - parseFloat(taxableAmount)) > 0.01) {
    console.warn(`Taxable amount mismatch. Calculated: ${calculatedTaxableAmount}, Provided: ${taxableAmount}`);
    // You can either throw an error or use the calculated value
    // throw new BadRequestError(`Taxable amount should be ${calculatedTaxableAmount.toFixed(2)}`);
  }

  // library to convert number to words..
  const toWords = new ToWords();
  let amountInWords = toWords.convert(grandTotal, { currency: true });

  console.log(`amountInWords : ${amountInWords}`);

  // Generate a unique incremental invoice number and append fiscal year, with leading zeros (e.g., 001-2080/81)
  let lastEntry = await ComputerizedSalesEntry.findOne({ companyID, fiscalYear })
    .sort({ createdAt: -1 })
    .select("invoiceNo")
    .lean();

  let lastIncrement = 0;
  if (lastEntry && lastEntry.invoiceNo) {
    // Extract the numeric part before the hyphen (if format is like "005-2080/81")
    const match = String(lastEntry.invoiceNo).match(/^(\d+)-/);
    if (match) {
      lastIncrement = parseInt(match[1], 10);
    }
  }
  // Pad the increment to 3 digits with leading zeros
  const nextIncrement = String(lastIncrement + 1).padStart(3, "0");
  invoiceNo = `${nextIncrement}-${fiscalYear}`;

  // Create the computerized sales entry
  const computerizedSalesEntry = await ComputerizedSalesEntry.create({
    customerID,
    customerName,
    invoiceNo,
    date,
    shipperName,
    shipperAddress,
    items: processedItems, // Use processed items with net amount calculations
    total,
    taxableAmount: calculatedTaxableAmount, // Use calculated taxable amount
    vat,
    vatAmount,
    grandTotal,
    amountInWords,
    fiscalYear,
    createdBy: req.user.tokenID,
    adminID: req.user.adminID,
    companyID,
  });

  res.status(StatusCodes.CREATED).json({ computerizedSalesEntry });
};

// Get all computerized sales entries
const getAllComputerizedSalesEntries = async (req, res) => {
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
    customerID,
    customerName,
    minAmount,
    maxAmount,
  } = req.query;

  if (startDate && endDate) {
    filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  if (customerID) {
    filter.customerID = customerID;
  }

  if (customerName) {
    filter.customerName = { $regex: customerName, $options: 'i' };
  }

  if (minAmount && maxAmount) {
    filter.grandTotal = { $gte: parseFloat(minAmount), $lte: parseFloat(maxAmount) };
  }

  // Count & query
  const total = await ComputerizedSalesEntry.countDocuments(filter);
  const computerizedSalesEntries = await ComputerizedSalesEntry.find(filter)
    .sort('createdAt')
    .skip(startIndex)
    .limit(limit);

  res.status(StatusCodes.OK).json({
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    computerizedSalesEntries,
    count: computerizedSalesEntries.length,
  });
};

// Get a single computerized sales entry
const getComputerizedSalesEntry = async (req, res) => {
  const {
    params: { id: computerizedSalesEntryID },
  } = req;

  const computerizedSalesEntry = await ComputerizedSalesEntry.findOne({ _id: computerizedSalesEntryID });

  if (!computerizedSalesEntry) {
    throw new notFoundError(`No Computerized Sales Entry Found.`);
  }

  res.status(StatusCodes.OK).json({ computerizedSalesEntry });
};

// Update a computerized sales entry
const updateComputerizedSalesEntry = async (req, res) => {
  console.log('Inside Update Computerized Sales Entry');
  const {
    params: { id: computerizedSalesEntryID },
  } = req;

  // Get the existing computerized sales entry
  const existingComputerizedSalesEntry = await ComputerizedSalesEntry.findById(computerizedSalesEntryID);
  if (!existingComputerizedSalesEntry) {
    throw new notFoundError(`No computerized sales entry with id: ${computerizedSalesEntryID}`);
  }

  // If customerID is being updated, validate the customer exists
  if (req.body.customerID && req.body.customerID !== existingComputerizedSalesEntry.customerID) {
    const customerObj = await Customer.findById(req.body.customerID);
    if (!customerObj) {
      throw new BadRequestError("Customer not found");
    }
    req.body.customerName = customerObj.name;
  }

  // If items are being updated, recalculate net amounts and taxable amount
  if (req.body.items) {
    const processedItems = calculateItemNetAmounts(req.body.items);
    req.body.items = processedItems;
    
    // Calculate taxable amount from net amounts
    const calculatedTaxableAmount = processedItems.reduce((sum, item) => 
      sum + (parseFloat(item.netAmount) || 0), 0
    );
    req.body.taxableAmount = calculatedTaxableAmount;
  }

  // If grandTotal is being updated, recalculate amountInWords
  if (req.body.grandTotal) {
    const toWords = new ToWords();
    req.body.amountInWords = toWords.convert(req.body.grandTotal, { currency: true });
  }

  const computerizedSalesEntry = await ComputerizedSalesEntry.findOneAndUpdate(
    { _id: computerizedSalesEntryID },
    req.body,
    { new: true, runValidators: true }
  );

  if (!computerizedSalesEntry) {
    throw new notFoundError(`No computerized sales entry with id: ${computerizedSalesEntryID}`);
  }

  res.status(StatusCodes.OK).json({ computerizedSalesEntry });
};

// Delete a computerized sales entry
const deleteComputerizedSalesEntry = async (req, res) => {
  const {
    params: { id: computerizedSalesEntryID },
  } = req;

  const computerizedSalesEntry = await ComputerizedSalesEntry.findOneAndDelete({ _id: computerizedSalesEntryID });

  if (!computerizedSalesEntry) {
    throw new notFoundError(`No Computerized Sales Entry Found with id: ${computerizedSalesEntryID}`);
  }
  res.status(StatusCodes.OK).json({ msg: 'Success! Computerized Sales Entry removed.' });
};

module.exports = {
  createComputerizedSalesEntry,
  getAllComputerizedSalesEntries,
  getComputerizedSalesEntry,
  updateComputerizedSalesEntry,
  deleteComputerizedSalesEntry,
};
