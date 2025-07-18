const Company = require("../models/company");
const { BadRequestError, NotFoundError } = require("../errors");
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

  // Handle logo update
  if (req.file && req.file.path) {
    // Temporarily set companyID in user object for file path generation
    req.user.companyID = companyId;
    req.body.logo = await getFilePathFromRequest(req, 'company_assets');
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

module.exports = {
  createCompany,
  getAllCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
  importCompaniesFromExcel,
};
