const Company = require("../models/company");
const { BadRequestError, notFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { moveFileToFinalLocation, cleanupTempFile } = require("../utils/filePathHelper");

const createCompany = async (req, res) => {
  console.log('inside create company: ', req.body);
  const { name, email, phoneNo, address, vat, industrytype } = req.body;
  if (!name || !email || !phoneNo || !address || !vat || !industrytype) {
    throw new BadRequestError("Please provide all values");
  }

  req.body.adminID = req.user.tokenID;
  
  // Create company first
  const company = await Company.create({ ...req.body });

  // Handle logo upload after company creation
  if (req.file) {
    try {
      const logoPath = await moveFileToFinalLocation(
        req.file.path,
        req.user.tokenID,
        req.user.name,
        'company_assets',
        req.file.filename,
        company._id,
        company.name,
        company.name,  // ← Pass company name as entity name
        company._id    // ← Pass company ID as entity ID
      );
      
      company.logo = logoPath;
      await company.save();
    } catch (error) {
      console.error('Error moving company logo:', error);
      cleanupTempFile(req.file.path);
    }
  }
  
  res.status(StatusCodes.CREATED).json({ company });
};

const getAllCompanies = async (req, res) => {
  // for debugging:
  console.log('Get all Companies controller called.')
  // console.log("Inside the getAllCompanies feat: ",req.user);

  const { tokenID, companyID } = req.user;
  const companies = await Company.find({
    $or: [
      { _id: companyID},
      { adminID: tokenID }
    ]
  });
  // console.log('Get All companies', companies);
  res.status(StatusCodes.OK).json({ companies, count: companies.length });
};

const getCompany = async (req, res) => {
  // for debugging:
  console.log("Inside a single get Company controller. ")

  const { tokenID } = req.user;
  const { id: companyId } = req.params;

  const company = await Company.findOne({ _id: companyId });

  if (!company) {
    throw new notFoundError(`No Company with id: ${companyId}`);
  }

  res.status(StatusCodes.OK).json({ company });
};

const updateCompany = async (req, res) => {
  const { tokenID } = req.user;
  const { id: companyId } = req.params;

  const { name, email, phoneNo, address, vat, industrytype } = req.body;

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

  // Get existing company for file handling
  const existingCompany = await Company.findOne({ _id: companyId, adminID: tokenID });
  if (!existingCompany) {
    throw new notFoundError(`No Company with id: ${companyId}`);
  }

  // Handle logo update
  if (req.file && req.file.path) {
    try {
      const logoPath = await moveFileToFinalLocation(
        req.file.path,
        tokenID,
        req.user.name,
        'company_assets',
        req.file.filename,
        companyId,
        existingCompany.name,
        req.body.name || existingCompany.name,  // Use updated name if provided
        companyId
      );
      req.body.logo = logoPath;
    } catch (error) {
      console.error('Error moving company logo:', error);
      cleanupTempFile(req.file.path);
    }
  }

  const company = await Company.findOneAndUpdate(
    { _id: companyId, adminID: tokenID },
    req.body,
    { new: true, runValidators: true }
  );

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
    throw new notFoundError(`No Company with id: ${companyId}`);
  }

  res.status(StatusCodes.OK).send();
};

const importCompaniesFromExcel = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      throw new BadRequestError("Please provide an Excel file");
    }

    const filePath = req.file.path;
    const { tokenID } = req.user;

    console.log(`Excel file imported: ${req.file.filename} by user: ${tokenID}`);

    const workbook = XLSX.readFile(filePath);

    if (!workbook.SheetNames.includes("Company")) {
      throw new BadRequestError("Excel file must contain a sheet named 'Company'");
    }

    const sheet = workbook.Sheets["Company"];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    if (rawData.length === 0) {
      throw new BadRequestError("No data found in the Company sheet");
    }

    const validatedData = [];
    const errors = [];

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];
      const rowNumber = i + 2;

      const { Name, Email, Phone_Number, Address, VAT, Industry_Type } = row;

      if (!Name || !Email || !Phone_Number || !Address || !VAT || !Industry_Type) {
        errors.push(`Row ${rowNumber}: Missing required fields`);
        continue;
      }

      const companyData = {
        name: Name.toString().trim(),
        email: Email.toString().trim(),
        phoneNo: Phone_Number.toString().trim(),
        address: Address.toString().trim(),
        vat: VAT.toString().trim(),
        industrytype: Industry_Type.toString().trim(),
        adminID: tokenID
      };

      validatedData.push(companyData);
    }

    if (errors.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Validation errors found',
        errors,
        validRecords: validatedData.length,
        totalRows: rawData.length,
        importedFile: req.file.filename
      });
    }

    const insertedCompanies = await Company.insertMany(validatedData, {
      ordered: false
    });

    // Generate file path for imported file
    const importedFilePath = await getFilePathFromRequest(req, 'imported_files');

    res.status(StatusCodes.CREATED).json({
      message: 'Companies imported successfully',
      imported: insertedCompanies.length,
      totalRows: rawData.length,
      companies: insertedCompanies,
      importedFile: req.file.filename,
      importedFilePath
    });

  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'BadRequestError') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Import failed due to validation errors',
        error: error.message,
        importedFile: req.file ? req.file.filename : null
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Import failed',
      error: error.message,
      importedFile: req.file ? req.file.filename : null
    });
  }
};

// Get all customers with pagination and filters
const getAllCustomers = async (req, res) => {
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
    search,
    status,
    minBalance,
    maxBalance,
    email,
  } = req.query;

  // Search by name (case-insensitive)
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  // Filter by email
  if (email) {
    filter.email = { $regex: email, $options: 'i' };
  }

  // Filter by status
  if (status !== undefined && status !== '') {
    filter.status = status === 'true';
  }

  // Filter by balance range
  if (minBalance && maxBalance) {
    filter.prevClosingBalance = { 
      $gte: parseFloat(minBalance), 
      $lte: parseFloat(maxBalance) 
    };
  } else if (minBalance) {
    filter.prevClosingBalance = { $gte: parseFloat(minBalance) };
  } else if (maxBalance) {
    filter.prevClosingBalance = { $lte: parseFloat(maxBalance) };
  }

  // Count & query
  const total = await Customer.countDocuments(filter);
  const customers = await Customer.find(filter)
    .sort('createdAt')
    .skip(startIndex)
    .limit(limit);

  res.status(StatusCodes.OK).json({
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    customers,
    count: customers.length,
  });
};

module.exports = {
  createCompany,
  getAllCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
  importCompaniesFromExcel,
  getAllCustomers,
};
