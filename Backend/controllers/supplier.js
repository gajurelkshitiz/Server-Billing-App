const Supplier = require('../models/Supplier');
const Company = require('../models/company');
const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, notFoundError } = require('../errors');

// Define supplier-related functions
const createSupplier = async (req, res) => {
  const { name, email, phoneNo, address, prevClosingBalance, type, panNo, status, companyID } = req.body;
  if (!name || !email || !phoneNo || !address || !prevClosingBalance || !panNo || !status || !companyID) {
    throw new BadRequestError('Please provide all values');
  }

  console.log(req.body);
  req.body.createdBy = req.user.tokenID;
  // req.body.companyID = req.user.companyID;
  req.body.adminID = req.user.adminID;

  // to keep the name of company from companyID
  const company = await Company.findOne({_id:companyID});
  const companyName = company.name;

  const supplier = await Supplier.create({ ...req.body, companyName});
  res.status(StatusCodes.CREATED).json({ supplier });
};

// euta adminID vanne, sabai users ma supplied chha, jun hami supplier mani supply garum,
//  ani based on adminID hami supply kura haru fetch garum, based on one Admin ko data
const getAllSuppliers = async (req, res) => {

   let companyID;
  // for user, companyID from token:
  companyID = req.user.companyID;

  // for admin, where companyID comes from param
  if (!companyID && req.query.companyID){
    companyID = req.query.companyID;
  }
  
  const suppliers = await Supplier.find({ companyID: companyID }).sort('createdAt');

  res.status(StatusCodes.OK).json({ suppliers, count: suppliers.length });
};


// get suppliers from the search menu:
const getSuppliersBySearch = async (req, res) => {
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
      results = await Supplier.aggregate([
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
      results = await Supplier.find(
        { companyID: companyID },
        { _id: 1, name: 1 }
      ).sort({ name: 1 });
    }

    res.status(200).json(results);
  } catch (error) {
    console.error("Error in getSuppliersBySearch:", error);
    res.status(500).json({ error: "Server error" });
  }
};



// get a single supplier
const getSupplier = async (req, res) => {
  const {
    params: { id: supplierID },
  } = req;

  const supplier = await Supplier.findOne({ _id: supplierID });

  if (!supplier) {
    throw new notFoundError(`No Supplier Found.`);
  }

  res.status(StatusCodes.OK).json({ supplier });
};

// Update a fiscal year
const updateSupplier = async (req, res) => {
  const {
    params: { id: supplierID },
    body: { name, email, phoneNo, address, status, creditLimitAmount, creditTimePeriodInDays },
  } = req;

  if (name === '' || email === '' || phoneNo === '' || address === '' || status === undefined || creditLimitAmount === undefined || creditTimePeriodInDays === undefined) {
    throw new BadRequestError('All fields cannot be empty');
  }

  const supplier = await Supplier.findOneAndUpdate(
    { _id: supplierID },
    req.body,
    { new: true, runValidators: true }
  );

  if (!supplier) {
    throw new notFoundError(`No Supplier Found with id: ${supplierID}`);
  }
  res.status(StatusCodes.OK).json({ supplier });
};

// delete a supplier
const deleteSupplier = async (req, res) => {
  const {
    params: { id: supplierID },
  } = req;

  const supplier = await Supplier.findOneAndDelete({ _id: supplierID });

  if (!supplier) {
    throw new notFoundError(`No Supplier Found with id: ${supplierID}`);
  }
  res.status(StatusCodes.OK).json({ msg: 'Success! Supplier removed.' });
};

module.exports = {
  createSupplier,
  getAllSuppliers,
  getSuppliersBySearch,
  getSupplier,
  updateSupplier,
  deleteSupplier,
};