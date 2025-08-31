const SalesEntry = require('../models/salesEntry');
const Customer = require('../models/Customer');
const FiscalYear = require('../models/FiscalYear');
const { BadRequestError, notFoundError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const { getFilePathFromRequest, moveFileToFinalLocation, cleanupTempFile } = require("../utils/filePathHelper");
const Company = require("../models/company");

// Create a new sales entry
const createSalesEntry = async (req, res) => {
  console.log('before creating sales entry, ', req.body);
  const { customerID, billNo, date, amount, itemDescription, netTotalAmount } = req.body;
  if (!customerID || !billNo || !date || !amount || !itemDescription || !netTotalAmount) {
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

  // put the customer Name here in the database:
  const customerObj = await Customer.findOne({ _id: customerID });
  console.log('Customer Object: ', customerObj);
  const customerName = customerObj.name;

  // save the current fiscal Year value also, for filter by filter year later
  const fiscalYearObj = await FiscalYear.findOne({ status: true });
  console.log('Fiscal Year : ', fiscalYearObj);
  const fiscalYear = fiscalYearObj.name;

  console.log('before creation of sales Entry');

  // Create sales entry first
  const salesEntry = await SalesEntry.create({
    ...req.body,
    createdBy: req.user.tokenID,
    adminID: req.user.adminID,
    companyID: companyID,
    customerName: customerName,
    fiscalYear: fiscalYear
  });

  // Handle bill attachment upload after sales entry creation
  if (req.file) {
    try {
      const billAttachmentPath = await moveFileToFinalLocation(
        req.file.path,
        req.user.adminID || req.user.tokenID,
        req.user.name,
        'sales',
        req.file.filename,
        company._id,
        company.name,
        salesEntry.billNo,  // ← Pass bill number as entity name
        salesEntry._id      // ← Pass sales entry ID as entity ID
      );
      
      salesEntry.billAttachment = billAttachmentPath;
      await salesEntry.save();
    } catch (error) {
      console.error('Error moving bill attachment:', error);
      cleanupTempFile(req.file.path);
    }
  }

  res.status(StatusCodes.CREATED).json({ salesEntry });
};

// // Get all sales entries  ---> This is previous Working Implementation code
// const getAllSalesEntries = async (req, res) => {
//   // implementation pagination:
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;

//   const startIndex = (page - 1) * limit;
//   const total = await SalesEntry.countDocuments();


//   // for user, companyID from token:
//   let companyID;
//   companyID = req.user.companyID;

//   // for admin, where companyID comes from param
//   if (!companyID && req.query.companyID) {
//     companyID = req.query.companyID;
//   }



//   const salesEntries = await SalesEntry.find({ companyID: companyID }).sort('createdAt').skip(startIndex).limit(limit);

//   res.status(StatusCodes.OK)
//      .json({ 
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total/limit),
//         salesEntries, 
//         count: salesEntries.length });
// };

const getAllSalesEntries = async (req, res) => {
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
    customerID, // Add this
    customerName,
    minAmount,
    maxAmount,
  } = req.query;

  if (startDate && endDate) {
    filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  if (customerID) {
    filter.customerID = customerID; // Add this filter
  }

  if (customerName) {
    filter.customerName = { $regex: customerName, $options: 'i' };
  }

  if (minAmount && maxAmount) {
    filter.amount = { $gte: parseFloat(minAmount), $lte: parseFloat(maxAmount) };
  }

  // Count & query
  const total = await SalesEntry.countDocuments(filter);
  const salesEntries = await SalesEntry.find(filter)
    .sort('createdAt')
    .skip(startIndex)
    .limit(limit);

  res.status(StatusCodes.OK).json({
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    salesEntries,
    count: salesEntries.length,
  });
};


// Get a single sales entry
const getSalesEntry = async (req, res) => {
  const {
    params: { id: salesEntryID },
  } = req;

  const salesEntry = await SalesEntry.findOne({ _id: salesEntryID });

  if (!salesEntry) {
    throw new notFoundError(`No Sales Entry Found.`);
  }

  res.status(StatusCodes.OK).json({ salesEntry });
};

// Update a sales entry
const updateSalesEntry = async (req, res) => {
  console.log('Inside Update Sales Entry');
  const {
    params: { id: salesEntryID },
    body: { date, amount, itemDescription, CustomerID, paid, dueAmount },
  } = req;

  // Get the existing sales entry to get company info
  const existingSalesEntry = await SalesEntry.findById(salesEntryID);
  if (!existingSalesEntry) {
    throw new notFoundError(`No sales entry with id: ${salesEntryID}`);
  }

  // Handle bill attachment upload if file is provided
  if (req.file && req.file.path) {
    try {
      const company = await Company.findById(existingSalesEntry.companyID);
      if (company) {
        const billAttachmentPath = await moveFileToFinalLocation(
          req.file.path,
          req.user.adminID || req.user.tokenID,
          req.user.name,
          'sales',
          req.file.filename,
          company._id,
          company.name
        );
        req.body.billAttachment = billAttachmentPath;
      }
    } catch (error) {
      console.error('Error moving bill attachment:', error);
      cleanupTempFile(req.file.path);
    }
  }

  const salesEntry = await SalesEntry.findOneAndUpdate(
    { _id: salesEntryID },
    req.body,
    { new: true, runValidators: true }
  );

  if (!salesEntry) {
    throw new notFoundError(`No sales entry with id: ${salesEntryID}`);
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
    throw new notFoundError(`No Sales Entry Found with id: ${salesEntryID}`);
  }
  res.status(StatusCodes.OK).json({ msg: 'Success! Sales Entry removed.' });
};



// Helper function to convert Windows path to WSL path
const convertToWSLPath = (windowsPath) => {
  try {
    // Remove any quotes from the path
    windowsPath = windowsPath.replace(/['"]/g, '');
    
    // Check if it's a network path or local path
    if (windowsPath.startsWith('\\\\')) {
      // Network path
      return windowsPath.replace(/\\/g, '/');
    } else {
      // Local path: Convert C:\path to /mnt/c/path
      const match = windowsPath.match(/^([A-Za-z]):\\(.+)$/);
      if (match) {
        const [, drive, pathPart] = match;
        return `/mnt/${drive.toLowerCase()}/${pathPart.replace(/\\/g, '/')}`;
      }
    }
    return windowsPath;
  } catch (error) {
    console.error('Error converting path:', error);
    return null;
  }
};

// Modified copyFileToTemp function
const copyFileToTemp = async (sourcePath) => {
  try {
    // Create temp directory if it doesn't exist
    const tempDir = path.join(__dirname, "../uploads/temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Convert Windows path to WSL path
    const wslPath = convertToWSLPath(sourcePath);
    console.log('Original Windows path:', sourcePath);
    console.log('Converted WSL path:', wslPath);

    if (!wslPath || !fs.existsSync(wslPath)) {
      throw new Error(`File not found at path: ${wslPath}`);
    }

    // Generate temp filename
    const ext = path.extname(wslPath);
    const tempFileName = `temp-${Date.now()}${ext}`;
    const tempFilePath = path.join(tempDir, tempFileName);

    // Copy file to temp location
    await fs.promises.copyFile(wslPath, tempFilePath);
    console.log('File copied to temp location:', tempFilePath);
    
    // Return file object similar to multer
    return {
      path: tempFilePath,
      filename: tempFileName,
      originalname: path.basename(wslPath)
    };
  } catch (error) {
    console.error('Error copying file to temp:', error);
    throw new Error(`Failed to copy file to temp location: ${error.message}`);
  }
};

// Modified importSalesEntriesFromExcel function
const importSalesEntriesFromExcel = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      throw new BadRequestError("Please provide an Excel file");
    }

    const { tokenID, adminID, name } = req.user;
    const currentAdminID = adminID || tokenID;
    const isPreview = req.query.preview === 'true';
    
    // Get company info
    let companyID = req.user.companyID;
    if (!companyID && req.query.companyID) {
      companyID = req.query.companyID;
    }

    const company = await Company.findById(companyID);
    if (!company) {
      throw new BadRequestError("Company not found");
    }

    // Get current fiscal year
    const fiscalYearObj = await FiscalYear.findOne({ status: true });
    if (!fiscalYearObj) {
      throw new BadRequestError('No Fiscal Year Found.');
    }
    const fiscalYear = fiscalYearObj?.name;

    // Process Excel file
    const workbook = XLSX.readFile(req.file.path);
    if (!workbook.SheetNames.includes("SalesEntry")) {
      throw new BadRequestError("Excel file must contain a sheet named 'SalesEntry'");
    }

    const rawData = XLSX.utils.sheet_to_json(workbook.Sheets["SalesEntry"]);
    if (rawData.length === 0) {
      throw new BadRequestError("No data found in the SalesEntry sheet");
    }

    // Arrays to store validation results
    const validatedData = [];
    const errors = [];
    const processedBillNos = new Set(); // For checking duplicates

    // Check for existing bill numbers in database
    const existingBillNos = new Set((await SalesEntry.find({ companyID })
      .select('billNo')
      .distinct('billNo')));

    let dataToProcess = rawData;
    // Handle partial import if rowIndexes are provided
    if (req.body.rowIndexes) {
      const rowIndexes = JSON.parse(req.body.rowIndexes);
      dataToProcess = rawData.filter((_, index) => rowIndexes.includes(index));
      console.log('Processing partial import for rows:', rowIndexes);
    }

    // Validate each row
    for (let i = 0; i < dataToProcess.length; i++) {
      const row = dataToProcess[i];
      const rowNumber = i + 2; // Excel row number (1-based + header)
      const rowErrors = [];

      const { CustomerName, Bill_No, Bill_Date, Amount, Item_Description, Net_Total_Amount, Bill_Attachment } = row;

      // Check required fields
      const requiredFields = { CustomerName, Bill_No, Bill_Date, Amount, Item_Description, Net_Total_Amount, Bill_Attachment };
      for (const [field, value] of Object.entries(requiredFields)) {
        if (!value && value !== 0) {
          rowErrors.push(`Missing required field: ${field}`);
        }
      }

      // Check for duplicate bill numbers in current import
      if (Bill_No) {
        if (processedBillNos.has(Bill_No.toString().trim())) {
          rowErrors.push(`Duplicate bill number in import: ${Bill_No}`);
        } else if (existingBillNos.has(Bill_No.toString().trim())) {
          rowErrors.push(`Bill number already exists in database: ${Bill_No}`);
        }
        processedBillNos.add(Bill_No.toString().trim());
      }

      // Validate customer existence
      let customer = null;
      if (CustomerName) {
        customer = await Customer.findOne({ 
          name: CustomerName.toString().trim(),
          companyID 
        });
        
        if (!customer) {
          rowErrors.push(`Customer not found: ${CustomerName}`);
        }
      }

      // Validate bill attachment path
      if (Bill_Attachment) {
        const wslPath = convertToWSLPath(Bill_Attachment.toString().trim());
        if (!wslPath || !fs.existsSync(wslPath)) {
          rowErrors.push(`Bill attachment file not found: ${Bill_Attachment}`);
        }
      }

      // Add to backend validation
      if (Bill_Date) {
        // Validate Nepali date format (YYYY-MM-DD)
        // if (!Bill_Date.toString().match(/^\d{4}-\d{2}-\d{2}$/)) {
        //   rowErrors.push(`Invalid date format for bill ${Bill_No}. Expected: YYYY-MM-DD`);
        // }
      }

      // Prepare validated data
      if (rowErrors.length === 0) {
        const salesEntryData = {
          customerID: customer._id,
          customerName: customer.name,
          billNo: Bill_No.toString().trim(),
          date: Bill_Date.toString().trim(),
          amount: parseFloat(Amount),
          itemDescription: Item_Description.toString().trim(),
          netTotalAmount: parseFloat(Net_Total_Amount),
          createdBy: currentAdminID,
          adminID: currentAdminID,
          companyID,
          fiscalYear,
          discount: row.Discount ? parseFloat(row.Discount) : 0,
          discountType: row.Discount_Type || 'percentage',
          vat: row.VAT ? parseFloat(row.VAT) : 0,
          billAttachment: Bill_Attachment
        };
        validatedData.push({ rowNumber, data: salesEntryData });
      } else {
        errors.push(`Row ${rowNumber}: ${rowErrors.join('; ')}`);
      }
    }

    // If preview mode, return validation results
    if (isPreview) {
      return res.status(StatusCodes.OK).json({
        message: 'Preview data processed',
        data: rawData.map((row, index) => ({
          ...row,
          rowNumber: index + 2,
          isValid: !errors.some(error => error.includes(`Row ${index + 2}:`))
        })),
        validRecords: validatedData.length,
        totalRows: rawData.length,
        errors: errors,
        importedFile: req.file.filename
      });
    }

    // If there are validation errors, don't proceed with import
    if (errors.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Validation errors found',
        errors,
        validRecords: validatedData.length,
        totalRows: rawData.length
      });
    }

    // Process actual import
    const createdEntries = [];
    for (const { data } of validatedData) {
      try {
        // Create sales entry first
        const salesEntry = await SalesEntry.create(data);

        // Handle bill attachment if exists
        if (data.billAttachment) {
          try {
            const tempFile = await copyFileToTemp(data.billAttachment);
            if (tempFile) {
              const billAttachmentPath = await moveFileToFinalLocation(
                tempFile.path,
                currentAdminID,
                name,
                'sales',
                tempFile.filename,
                company._id,
                company.name,
                salesEntry.billNo,
                salesEntry._id
              );
              
              salesEntry.billAttachment = billAttachmentPath;
              await salesEntry.save();
              cleanupTempFile(tempFile.path);
            }
          } catch (error) {
            console.error('Error processing bill attachment:', error);
          }
        }

        createdEntries.push(salesEntry);
      } catch (error) {
        console.error('Error creating sales entry:', error);
        errors.push(`Failed to create entry: ${error.message}`);
      }
    }

    // Move the imported Excel file
    let importedFilePath = null;
    try {
      importedFilePath = await moveFileToFinalLocation(
        req.file.path,
        currentAdminID,
        name,
        'imported_files',
        req.file.filename,
        companyID,
        company.name
      );
    } catch (error) {
      console.error('Error moving imported file:', error);
    }

    res.status(StatusCodes.CREATED).json({
      message: 'Sales entries imported successfully',
      imported: createdEntries.length,
      totalRows: rawData.length,
      errors: errors.length > 0 ? errors : undefined,
      importedFilePath
    });

  } catch (error) {
    console.error('Import error:', error);
    res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Import failed', 
      error: error.message
    });
  }
};

module.exports = {
  createSalesEntry,
  getAllSalesEntries,
  getSalesEntry,
  updateSalesEntry,
  deleteSalesEntry,
  importSalesEntriesFromExcel,
};