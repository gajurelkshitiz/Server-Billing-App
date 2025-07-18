const SalesEntry = require('../models/salesEntry');
const Customer = require('../models/Customer');
const FiscalYear = require('../models/FiscalYear');
const { BadRequestError, NotFoundError } = require('../errors');
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

  let companyID;
  // for user, companyID from token:
  companyID = req.user.companyID;

  // for admin, where companyID comes from param
  if (!companyID && req.query.companyID) {
    companyID = req.query.companyID;
  }

  // Get company info for file handling
  const company = await Company.findById(companyID);
  if (!company) {
    throw new BadRequestError("Company not found");
  }

  // put the customer Name here in the database:
  const customerObj = await Customer.findOne({ _id: customerID });
  const customerName = customerObj.name;

  // save the current fiscal Year value also, for filter by filter year later
  const fiscalYearObj = await FiscalYear.findOne({ status: true });
  const fiscalYear = fiscalYearObj.name;

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

// Get all sales entries
const getAllSalesEntries = async (req, res) => {
  let companyID;
  // for user, companyID from token:
  companyID = req.user.companyID;

  // for admin, where companyID comes from param
  if (!companyID && req.query.companyID) {
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
  console.log('Inside Update Sales Entry');
  const {
    params: { id: salesEntryID },
    body: { date, amount, itemDescription, CustomerID, paid, dueAmount },
  } = req;

  // Get the existing sales entry to get company info
  const existingSalesEntry = await SalesEntry.findById(salesEntryID);
  if (!existingSalesEntry) {
    throw new NotFoundError(`No sales entry with id: ${salesEntryID}`);
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
    throw new NotFoundError(`No sales entry with id: ${salesEntryID}`);
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

const importSalesEntriesFromExcel = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      throw new BadRequestError("Please provide an Excel file");
    }

    const filePath = req.file.path;
    const { tokenID } = req.user;
    const isPreview = req.query.preview === 'true';
    
    // Get row indexes for partial import
    const rowIndexes = req.body.rowIndexes ? JSON.parse(req.body.rowIndexes) : null;
    const isPartialImport = rowIndexes && Array.isArray(rowIndexes);

    console.log(`Excel file ${isPreview ? 'previewed' : 'imported'}: ${req.file.filename} by user: ${tokenID}`);
    if (isPartialImport) {
      console.log('Partial import for rows:', rowIndexes);
    }

    // Read the Excel file
    const workbook = XLSX.readFile(filePath);

    if (!workbook.SheetNames.includes("SalesEntry")) {
      throw new BadRequestError("Excel file must contain a sheet named 'SalesEntry'");
    }

    const sheet = workbook.Sheets["SalesEntry"];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    if (rawData.length === 0) {
      throw new BadRequestError("No data found in the SalesEntry sheet");
    }

    // Filter data for partial import
    const dataToProcess = isPartialImport 
      ? rawData.filter((_, index) => rowIndexes.includes(index))
      : rawData;

    console.log(`Processing ${dataToProcess.length} rows out of ${rawData.length} total rows`);

    let companyID;
    // for user, companyID from token:
    companyID = req.user.companyID;

    // for admin, where companyID comes from param
    if (!companyID && req.query.companyID) {
      companyID = req.query.companyID;
    }

    // Get company info for file handling
    const company = await Company.findById(companyID);
    if (!company) {
      throw new BadRequestError("Company not found");
    }

    // Get current fiscal year
    const fiscalYearObj = await FiscalYear.findOne({ status: true });
    const fiscalYear = fiscalYearObj ? fiscalYearObj.name : null;

    const validatedData = [];
    const errors = [];

    for (let i = 0; i < dataToProcess.length; i++) {
      const row = dataToProcess[i];
      // For partial import, get original row number for error reporting
      const originalIndex = isPartialImport ? rowIndexes[i] : i;
      const rowNumber = originalIndex + 2; // +2 because Excel is 1-based and has header

      const { CustomerName, Bill_No, Bill_Date, Amount, Item_Description, Net_Total_Amount, Discount, Discount_Type, Bill_Attachment } = row;

      console.log('Processing row:', rowNumber, 'Data:', { CustomerName, Bill_No, Bill_Date, Amount, Item_Description, Net_Total_Amount });

      if (!CustomerName || !Bill_No || !Bill_Date || !Amount || !Item_Description || !Net_Total_Amount || !Bill_Attachment) {
        errors.push(`Row ${rowNumber}: Missing required fields (CustomerName, Bill_No, Date, Amount, Item_Description, Net_Total_Amount, Bill_Attachment)`);
        continue;
      }

      // Validate if customer exists based on CustomerName and companyID
      const customerObj = await Customer.findOne({ 
        name: CustomerName.toString().trim(),
        companyID: companyID 
      });
      
      if (!customerObj) {
        errors.push(`Row ${rowNumber}: Customer with name '${CustomerName}' not found for this company`);
        continue;
      }

      const salesEntryData = {
        customerID: customerObj._id,
        billNo: Bill_No.toString().trim(),
        date: Bill_Date.toString().trim(),
        amount: parseFloat(Amount),
        itemDescription: Item_Description.toString().trim(),
        netTotalAmount: parseFloat(Net_Total_Amount),
        createdBy: tokenID,
        adminID: req.user.adminID,
        companyID: companyID,
        customerName: customerObj.name,
        fiscalYear: fiscalYear
      };

      // Handle optional fields
      if (Discount && Discount_Type) {
        salesEntryData.discount = parseFloat(Discount);
        salesEntryData.discountType = Discount_Type.toString().trim();
      }

      // Handle VAT if present
      if (row.VAT !== undefined && row.VAT !== null && row.VAT !== '') {
        salesEntryData.vat = parseFloat(row.VAT);
      }

      // Handle bill attachment processing for Excel import
      if (Bill_Attachment) {
        try {
          let sourceBillPath = Bill_Attachment.toString().trim();
          if (sourceBillPath[1] === ':') {
            sourceBillPath = '/mnt/' + sourceBillPath[0].toLowerCase() + sourceBillPath.slice(2).replace(/\\/g, '/');
          }
          
          const ext = path.extname(sourceBillPath);
          const uniqueName = `bill-${path.parse(sourceBillPath).name}-${Date.now()}_${originalIndex}${ext}`;
          
          // Use the new file helper approach
          const billAttachmentPath = await moveFileToFinalLocation(
            sourceBillPath,
            req.user.adminID || tokenID,
            req.user.name,
            'sales',
            uniqueName,
            company._id,
            company.name
          );

          salesEntryData.billAttachment = billAttachmentPath;
        } catch (err) {
          errors.push(`Row ${rowNumber}: Failed to process bill attachment (${err.message})`);
        }
      }

      validatedData.push(salesEntryData);
    }

    // If it's preview mode, return data without saving
    if (isPreview) {
      return res.status(StatusCodes.OK).json({
        message: 'Preview data processed',
        data: rawData.map((row, index) => ({
          ...row,
          index,
          isValid: !errors.some(error => error.includes(`Row ${index + 2}:`))
        })),
        validRecords: validatedData.length,
        totalRows: rawData.length,
        errors: errors,
        importedFile: req.file.filename
      });
    }

    // If not preview mode, proceed with actual import
    if (errors.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Validation errors found',
        errors,
        validRecords: validatedData.length,
        totalRows: isPartialImport ? dataToProcess.length : rawData.length,
        processedRows: isPartialImport ? rowIndexes.length : rawData.length,
        importedFile: req.file.filename
      });
    }

    const insertedSalesEntries = await SalesEntry.insertMany(validatedData, {
      ordered: false
    });

    // Handle imported file movement
    if (req.file) {
      try {
        const importedFilePath = await moveFileToFinalLocation(
          req.file.path,
          req.user.adminID || tokenID,
          req.user.name,
          'imported_files',
          req.file.filename,
          company._id,
          company.name
        );

        res.status(StatusCodes.CREATED).json({
          message: `Sales entries ${isPartialImport ? 'partially ' : ''}imported successfully`,
          imported: insertedSalesEntries.length,
          totalRows: rawData.length,
          processedRows: isPartialImport ? dataToProcess.length : rawData.length,
          salesEntries: insertedSalesEntries,
          importedFile: req.file.filename,
          importedFilePath,
          isPartialImport: isPartialImport
        });
      } catch (error) {
        console.error('Error moving imported file:', error);
        cleanupTempFile(req.file.path);
        
        // Still return success for sales entries, but note file upload issue
        res.status(StatusCodes.CREATED).json({
          message: `Sales entries ${isPartialImport ? 'partially ' : ''}imported successfully`,
          imported: insertedSalesEntries.length,
          totalRows: rawData.length,
          processedRows: isPartialImport ? dataToProcess.length : rawData.length,
          salesEntries: insertedSalesEntries,
          importedFile: req.file.filename,
          importedFilePath: null,
          isPartialImport: isPartialImport,
          note: 'Import successful but file archiving failed'
        });
      }
    }

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
  createSalesEntry,
  getAllSalesEntries,
  getSalesEntry,
  updateSalesEntry,
  deleteSalesEntry,
  importSalesEntriesFromExcel,
};