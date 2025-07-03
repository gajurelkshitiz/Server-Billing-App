const FiscalYear = require("../models/FiscalYear");
const { BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

// Create a new fiscal year
const createFiscalYear = async (req, res) => {
  const { name, startDate, endDate, status } = req.body;
  if (!name || !startDate || !endDate || status === undefined) {
    throw new BadRequestError("Please provide all values");
  }
  req.body.superadminID = req.user.tokenID;

  const fiscalYear = await FiscalYear.create({ ...req.body });

  // console.log('After FY Creation, and before Status check')
  // If status is true, deactivate all other fiscal years for this superadmin except the new one
  if (status === true || status === "true") {
    const result = await FiscalYear.updateMany(
      { superadminID: req.body.superadminID, _id: { $ne: fiscalYear._id } },
      { $set: { status: false } }
    );
    // console.log("Fiscal years deactivated:", result.modifiedCount);
  }

  // console.log('After Status Check')
  res.status(StatusCodes.CREATED).json({ fiscalYear });
};

// Get all fiscal years
const getAllFiscalYears = async (req, res) => {
  const fiscalYears = await FiscalYear.find({}).sort("createdAt");
  res.status(StatusCodes.OK).json({ fiscalYears, count: fiscalYears.length });
};

// Get fiscal year
const getFiscalYear = async (req, res) => {
  const {
    params: { id: fiscalYearID },
  } = req;
  const fiscalYear = await FiscalYear.findOne({ _id: fiscalYearID });

  if (!fiscalYear) {
    throw new BadRequestError(`No Fiscal Year found.`);
  }

  res.status(StatusCodes.OK).json({ fiscalYear });
};

// Update a fiscal year
const updateFiscalYear = async (req, res) => {
  const {
    params: { id: fiscalYearID },
    body: { name, startDate, endDate, status },
  } = req;

  if (
    name === "" ||
    startDate === "" ||
    endDate === "" ||
    status === undefined
  ) {
    throw new BadRequestError("All fields cannot be empty");
  }

  
  const fiscalYear = await FiscalYear.findOneAndUpdate(
    { _id: fiscalYearID },
    req.body,
    { new: true, runValidators: true }
  );
  
  if (!fiscalYear) {
    throw new BadRequestError(`No Fiscal Year found.`);
  }

  // If status is true, deactivate all other fiscal years for this superadmin
  if (status === true || status === 'true') {
    const fiscalYear = await FiscalYear.findById(fiscalYearID);
    if (fiscalYear) {
      await FiscalYear.updateMany(
        { superadminID: fiscalYear.superadminID, _id: { $ne: fiscalYearID } },
        { $set: { status: false } }
      );
    }
  }

  res.status(StatusCodes.OK).json({ fiscalYear });
};

// Delete a fiscal year
const deleteFiscalYear = async (req, res) => {
  const {
    params: { id: fiscalYearID },
  } = req;
  const fiscalYear = await FiscalYear.findOneAndDelete({ _id: fiscalYearID });

  if (!fiscalYear) {
    throw new BadRequestError(`No Fiscal Year found.`);
  }
  res.status(StatusCodes.OK).send();
};

module.exports = {
  createFiscalYear,
  getFiscalYear,
  getAllFiscalYears,
  updateFiscalYear,
  deleteFiscalYear,
};
