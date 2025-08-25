const excelJS = require("exceljs");
const { StatusCodes } = require("http-status-codes");
const archiver = require('archiver');
const mongoose = require('mongoose');

// Import all your models
const Admin = require("../models/admin");
const User = require("../models/user");
const Company = require("../models/company");
const Customer = require("../models/Customer");
const Supplier = require("../models/Supplier");
const SalesEntry = require("../models/salesEntry");
const ComputerizedSalesEntry = require("../models/computerizedSalesEntry");
const PurchaseEntry = require("../models/PurchaseEntry");
const CustomerPayment = require("../models/CustomerPayment");
const SupplierPayment = require("../models/SupplierPayment");

// Helper function to get admin-specific database data
const getAdminDatabaseData = async (adminID, companyID = null) => {
  // First, fetch the admin to check their mode
  const admin = await Admin.findById(adminID).lean();
  if (!admin) {
    throw new Error(`Admin with ID ${adminID} not found`);
  }
  console.log('Admin found:', { _id: admin._id, mode: admin.mode, name: admin.name });

  // Build a query to find documents by adminID
  const query = { adminID: new mongoose.Types.ObjectId(adminID) };
  console.log('Query for admin:', query);

  // If companyID is provided, add it to the query for applicable collections
  const companyQuery = companyID 
    ? { adminID: new mongoose.Types.ObjectId(adminID), _id: new mongoose.Types.ObjectId(companyID) }
    : { adminID: new mongoose.Types.ObjectId(adminID) };
  console.log('Company query:', companyQuery);

  // For collections that use companyID as a field (not _id)
  // Check both adminID and createdBy fields
  const userCompanyQuery = companyID 
    ? { 
        $or: [
          { adminID: new mongoose.Types.ObjectId(adminID) },
          { createdBy: new mongoose.Types.ObjectId(adminID) }
        ],
        companyID: new mongoose.Types.ObjectId(companyID) 
      }
    : { 
        $or: [
          { adminID: new mongoose.Types.ObjectId(adminID) },
          { createdBy: new mongoose.Types.ObjectId(adminID) }
        ]
      };
  console.log('User company query:', userCompanyQuery);

  // Get companies first to determine which companyIDs to filter payment tables
  const companies = await Company.find(companyQuery).lean();
  console.log('Companies found:', companies);

  const companyIDs = companies.map(company => company._id);
  console.log('Company IDs:', companyIDs);

  // Build payment query based on available companyIDs and also check adminID/createdBy
  const paymentQuery = companyID && companyIDs.length > 0
    ? { 
        companyID: new mongoose.Types.ObjectId(companyID),
        $or: [
          { adminID: new mongoose.Types.ObjectId(adminID) },
          { createdBy: new mongoose.Types.ObjectId(adminID) }
        ]
      }
    : companyIDs.length > 0 
      ? { 
          companyID: { $in: companyIDs },
          $or: [
            { adminID: new mongoose.Types.ObjectId(adminID) },
            { createdBy: new mongoose.Types.ObjectId(adminID) }
          ]
        }
      : { 
          $or: [
            { adminID: new mongoose.Types.ObjectId(adminID) },
            { createdBy: new mongoose.Types.ObjectId(adminID) }
          ]
        };
  console.log('Payment query:', paymentQuery);

  // Conditionally fetch sales entries based on admin mode
  let salesEntries = [];
  let computerizedSalesEntries = [];
  
  if (admin.mode === 'computerized') {
    computerizedSalesEntries = await ComputerizedSalesEntry.find(userCompanyQuery).lean();
    console.log('Fetched computerized sales entries:', computerizedSalesEntries.length);
  } else {
    salesEntries = await SalesEntry.find(userCompanyQuery).lean();
    console.log('Fetched manual sales entries:', salesEntries.length);
  }

  const result = {
    // Direct adminID + companyID filtering
    users: await User.find(userCompanyQuery).lean(),
    customers: await Customer.find(userCompanyQuery).lean(),
    suppliers: await Supplier.find(userCompanyQuery).lean(),
    purchaseEntries: await PurchaseEntry.find(userCompanyQuery).lean(),
    
    // Companies (filtered by adminID and optional companyID)
    companies: companies,
    
    // Payment tables (filtered by companyID derived from admin's companies)
    customerPayments: await CustomerPayment.find(paymentQuery).lean(),
    supplierPayments: await SupplierPayment.find(paymentQuery).lean(),
  };

  // Add sales entries based on admin mode
  if (admin.mode === 'computerized') {
    result.computerizedSalesEntries = computerizedSalesEntries;
  } else {
    result.salesEntries = salesEntries;
  }

  return result;
};

// Export functions for different formats (reused from superadmin export)
const exportExcel = async (res, data, exportType, adminID, companyID) => {
  const workbook = new excelJS.Workbook();

  // Helper function to create worksheet
  const createWorksheet = (name, data) => {
    const worksheet = workbook.addWorksheet(name);
    if (data.length > 0) {
      worksheet.columns = Object.keys(data[0]).map(key => ({
        header: key.charAt(0).toUpperCase() + key.slice(1),
        key: key,
        width: 15
      }));
      data.forEach(item => worksheet.addRow(item));
    }
  };

  // Create worksheets for each data type
  createWorksheet("Users", data.users);
  createWorksheet("Companies", data.companies);
  createWorksheet("Customers", data.customers);
  createWorksheet("Suppliers", data.suppliers);
  
  // Add sales entries based on which type exists in the data
  if (data.salesEntries) {
    createWorksheet("Sales Entries", data.salesEntries);
  }
  if (data.computerizedSalesEntries) {
    createWorksheet("Computerized Sales Entries", data.computerizedSalesEntries);
  }
  
  createWorksheet("Purchase Entries", data.purchaseEntries);
  createWorksheet("Customer Payments", data.customerPayments);
  createWorksheet("Supplier Payments", data.supplierPayments);

  const suffix = companyID ? `admin_${adminID}_company_${companyID}` : `admin_${adminID}`;
  const filename = `${exportType}_export_${suffix}_${new Date().toISOString().split('T')[0]}.xlsx`;
  
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

  await workbook.xlsx.write(res);
  res.end();
};

const exportJson = (res, data, exportType, adminID, companyID) => {
  // Create a zip archive
  const archive = archiver('zip', {
    zlib: { level: 9 } // Compression level
  });

  const suffix = companyID ? `admin_${adminID}_company_${companyID}` : `admin_${adminID}`;
  const filename = `${exportType}_json_export_${suffix}_${new Date().toISOString().split('T')[0]}.zip`;
  
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

  // Pipe archive data to the response
  archive.pipe(res);

  // Create separate JSON files for each table
  Object.keys(data).forEach(tableName => {
    if (data[tableName].length > 0) {
      const jsonData = {
        exportDate: new Date().toISOString(),
        exportType: exportType,
        adminID: adminID,
        ...(companyID && { companyID: companyID }),
        tableName: tableName,
        count: data[tableName].length,
        data: data[tableName]
      };

      const jsonContent = JSON.stringify(jsonData, null, 2);
      
      // Add this JSON file to the archive
      archive.append(jsonContent, { name: `${tableName}.json` });
    }
  });

  // Add a summary file with all data combined
  const summaryData = {
    exportDate: new Date().toISOString(),
    exportType: exportType,
    adminID: adminID,
    ...(companyID && { companyID: companyID }),
    summary: {
      totalTables: Object.keys(data).length,
      tableCounts: Object.keys(data).reduce((acc, tableName) => {
        acc[tableName] = data[tableName].length;
        return acc;
      }, {})
    },
    data: data
  };

  const summaryContent = JSON.stringify(summaryData, null, 2);
  archive.append(summaryContent, { name: 'complete_admin_database_export.json' });

  // Handle archive errors
  archive.on('error', (err) => {
    console.error('Archive error:', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error creating ZIP file',
      error: err.message
    });
  });

  // Finalize the archive (this tells archiver that no more files will be added)
  archive.finalize();
};

const exportCsv = (res, data, exportType, adminID, companyID) => {
  // Create a zip archive
  const archive = archiver('zip', {
    zlib: { level: 9 } // Compression level
  });

  const suffix = companyID ? `admin_${adminID}_company_${companyID}` : `admin_${adminID}`;
  const filename = `${exportType}_csv_export_${suffix}_${new Date().toISOString().split('T')[0]}.zip`;
  
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

  // Pipe archive data to the response
  archive.pipe(res);

  // Create separate CSV files for each table
  Object.keys(data).forEach(tableName => {
    if (data[tableName].length > 0) {
      let csvContent = '';
      
      // Add headers
      const headers = Object.keys(data[tableName][0]);
      csvContent += headers.join(',') + '\n';
      
      // Add data rows
      data[tableName].forEach(row => {
        const values = headers.map(header => {
          const value = row[header];
          // Handle values that might contain commas or quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value || '';
        });
        csvContent += values.join(',') + '\n';
      });

      // Add this CSV file to the archive
      archive.append(csvContent, { name: `${tableName}.csv` });
    }
  });

  // Handle archive errors
  archive.on('error', (err) => {
    console.error('Archive error:', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error creating ZIP file',
      error: err.message
    });
  });

  // Finalize the archive (this tells archiver that no more files will be added)
  archive.finalize();
};

// Main export controller for admin-specific data
const exportAdminDatabaseData = async (req, res) => {
  console.log('Admin export query params:', req.query);

  try {
    const { companyID, format = 'excel' } = req.query;

    // get adminID from the req.user;
    const adminID = req.user.tokenID;
    console.log('AdminID From TokenID is: ', adminID);

    // Validate required adminID
    if (!adminID) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'adminID is required for admin database export'
      });
    }

    // Validate adminID format
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid adminID format'
      });
    }

    // Validate companyID format if provided
    if (companyID && !mongoose.Types.ObjectId.isValid(companyID)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid companyID format'
      });
    }

    const exportType = companyID ? 'admin_company_database' : 'admin_database';
    console.log(`Starting ${exportType} export in ${format} format for adminID: ${adminID}${companyID ? `, companyID: ${companyID}` : ''}`);

    // Get admin-specific database data
    const data = await getAdminDatabaseData(adminID, companyID);

    // Log the data counts for debugging
    console.log('Export data summary:', Object.keys(data).reduce((acc, key) => {
      acc[key] = data[key].length;
      return acc;
    }, {}));

    // Export based on format
    switch (format.toLowerCase()) {
      case 'csv':
        return exportCsv(res, data, exportType, adminID, companyID);
      case 'json':
        return exportJson(res, data, exportType, adminID, companyID);
      case 'excel':
      case 'xlsx':
        return await exportExcel(res, data, exportType, adminID, companyID);
      default:
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Unsupported format. Supported formats: csv, json, excel'
        });
    }

  } catch (error) {
    console.error("Admin database export error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error exporting admin database",
      error: error.message
    });
  }
};

module.exports = {
  exportAdminDatabaseData
};
