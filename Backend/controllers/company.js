const Company = require("../models/company");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const uploadOnCloudinary = require("../utils/cloudinary");

const createCompany = async (req, res) => {
  const { name, email, phoneNo, address, vat, industrytype } = req.body;
  if (!name || !email || !phoneNo || !address || !vat || !industrytype) {
    throw new BadRequestError("Please provide all values");
  }

  // Optional company logo upload
  // let companyLogoUrl = undefined;
  if (req.file && req.file.path) {
    const uploaded = await uploadOnCloudinary(
      req.file.path,
      `${Date.now()}-${req.file.originalname}`,
      "BILL APP/COMPANY LOGO"
    );
    if (uploaded && uploaded.url) {
      req.body.logo = uploaded.url;
    }
  }

  req.body.adminID = req.user.tokenID;
  const company = await Company.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ company });
};

const getAllCompanies = async (req, res) => {
  const { tokenID, companyID } = req.user;
  console.log("tokenID and companyID", tokenID, companyID);
  const companies = await Company.find({
    $or: [
      { _id: companyID},
      { adminID: tokenID }
    ]
  });
  res.status(StatusCodes.OK).json({ companies, count: companies.length });
};

const getCompany = async (req, res) => {
  const { tokenID } = req.user;
  const { id: companyId } = req.params;

  const company = await Company.findOne({ _id: companyId, adminID: tokenID });

  if (!company) {
    throw new NotFoundError(`No Company with id: ${companyId}`);
  }

  res.status(StatusCodes.OK).json({ company });
};

const updateCompany = async (req, res) => {
  const { tokenID } = req.user;
  const { id: companyId } = req.params;
  const { name, email, phoneNo, address, vat, industrytype } = req.body;

  console.log('succefully called update from frontend here.')

  if (
    name === "" ||
    email === "" ||
    phoneNo === "" ||
    address === "" ||
    vat === "" ||
    industrytype === ""
  ) {
    throw new BadRequestError("All fields cannot be empty");
  }

  // for logo updating 
  if (req.file && req.file.path) {
    const uploaded = await uploadOnCloudinary(
      req.file.path,
      `${Date.now()}-${req.file.originalname}`,
      "BILL APP/COMPANY LOGO"
    );
    if (uploaded && uploaded.url) {
      req.body.logo = uploaded.url;
    }
  }

  const company = await Company.findOneAndUpdate(
    { _id: companyId, adminID: tokenID },
    req.body,
    { new: true, runValidators: true }
  );

  if (!company) {
    throw new NotFoundError(`No Company with id: ${companyId}`);
  }

  res.status(StatusCodes.OK).json({ company });
};



const deleteCompany = async (req, res) => {
  const { tokenID } = req.user;
  const { id: companyId } = req.params;

  const company = await Company.findOneAndDelete({
    _id: companyId,
    adminID: tokenID,
  });

  if (!company) {
    throw new NotFoundError(`No Company with id: ${companyId}`);
  }

  res.status(StatusCodes.OK).send();
};

module.exports = {
  createCompany,
  getAllCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
};
