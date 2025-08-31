const Customer = require('../models/Customer');
const Company = require('../models/company');
const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, notFoundError } = require('../errors');

// Create a new customer
const createCustomer = async (req, res) => {
  const { name, email, phoneNo, address, prevClosingBalance, type, panNo, status, companyID, creditLimitAmount, creditTimePeriodInDays } = req.body;
  if (!name || !email || !phoneNo || !prevClosingBalance || !panNo || !address || !status || !companyID) {
    throw new BadRequestError('Please provide all values');
  }
  console.log(req.body)
  req.body.createdBy = req.user.tokenID;
  // req.body.companyID = req.user.companyID;
  req.body.adminID = req.user.adminID;

  // to keep the name of company from companyID
  const company = await Company.findOne({_id:companyID});
  const companyName = company.name;

  const customer = await Customer.create({ ...req.body, companyName });
  res.status(StatusCodes.CREATED).json({ customer });
};

// Get all customers
const getAllCustomers = async (req, res) => {
  
  let companyID;
  // for user, companyID from token:
  companyID = req.user.companyID;

  // for admin, where companyID comes from param
  if (!companyID && req.query.companyID){
    companyID = req.query.companyID;
  }


  const customers = await Customer.find({ companyID: companyID }).sort('createdAt');

  res.status(StatusCodes.OK).json({ customers, count: customers.length });
};



// get customers from the search menu:
const getCustomersBySearch = async (req, res) => {
  try {
    const { companyID, search } = req.query;
    console.log('from supplier by search', req.query);

    if (!companyID || !mongoose.Types.ObjectId.isValid(companyID)) {
      return res.status(400).json({ error: "Valid companyID is required." });
    }

    const searchTerm = search?.toLowerCase() || "";

    let results = [];

    if (searchTerm) {
      // Try to get matching suppliers
      results = await Customer.aggregate([
        {
          $match: {
            companyID: new mongoose.Types.ObjectId(companyID),
            name: { $regex: searchTerm, $options: "i" },
          },
        },
        {
          $addFields: {
            matchPosition: {
              $indexOfCP: [{ $toLower: "$name" }, searchTerm],
            },
          },
        },
        {
          $sort: {
            matchPosition: 1,
            name: 1,
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
          },
        },
        {
          $limit: 10,
        },
      ]);
    }

    // If no search or no results, fetch all suppliers
    if (!searchTerm || results.length === 0) {
      results = await Customer.find(
        { companyID: companyID },
        { _id: 1, name: 1 }
      ).sort({ name: 1 });
    }

    res.status(200).json(results);
  } catch (error) {
    console.error("Error in getCustomersBySearch:", error);
    res.status(500).json({ error: "Server error" });
  }
};


// Get a single customer
const getCustomer = async (req, res) => {
  const {
    params: { id: customerID },
  } = req;

  const customer = await Customer.findOne({ _id: customerID });

  if (!customer) {
    throw new notFoundError(`No Customer Found.`);
  }

  res.status(StatusCodes.OK).json({ customer });
};

// Update a customer
const updateCustomer = async (req, res) => {
  console.log('Got a request to update a customer: ', req.body);
  const {
    params: { id: customerID },
    body: { name, email, phoneNo, address, status, creditLimitAmount, creditTimePeriodInDays },
  } = req;

  // Remove or relax this check:
  if (
    ('name' in req.body && req.body.name === '') ||
    ('email' in req.body && req.body.email === '') ||
    ('phoneNo' in req.body && req.body.phoneNo === '') ||
    ('address' in req.body && req.body.address === '') ||
    ('creditLimitAmount' in req.body && req.body.creditLimitAmount === null) ||
    ('creditTimePeriodInDays' in req.body && req.body.creditTimePeriodInDays === null) ||
    ('status' in req.body && req.body.status === undefined)
  ) {
    throw new BadRequestError('Fields cannot be empty');
  }

  const customer = await Customer.findOneAndUpdate(
    { _id: customerID },
    req.body,
    { new: true, runValidators: true }
  );

  if (!customer) {
    throw new notFoundError(`No Customer Found with id: ${customerID}`);
  }
  res.status(StatusCodes.OK).json({ customer });
};

// Delete a customer
const deleteCustomer = async (req, res) => {
  const {
    params: { id: customerID },
  } = req;

  const customer = await Customer.findOneAndDelete({ _id: customerID });
  if (!customer) {
    throw new notFoundError(`No Customer Found with id: ${customerID}`);
  }
  res.status(StatusCodes.OK).send();
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomersBySearch,
  getCustomer,
  updateCustomer,
  deleteCustomer,
};