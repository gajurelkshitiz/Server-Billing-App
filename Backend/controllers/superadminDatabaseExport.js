const excelJS = require("exceljs");
const { StatusCodes } = require("http-status-codes");
const archiver = require('archiver');

// Import all your models
const Admin = require("../models/admin");
const User = require("../models/user");
const Company = require("../models/company");
const Customer = require("../models/Customer");
const Supplier = require("../models/Supplier");
const SalesEntry = require("../models/salesEntry");
const PurchaseEntry = require("../models/PurchaseEntry");
const Subscription = require("../models/subscription");
const FiscalYear = require("../models/FiscalYear");
const CustomerPayment = require("../models/CustomerPayment");
const SupplierPayment = require("../models/SupplierPayment");

// Helper function to get all database data
const getAllDatabaseData = async () => {
  return {
    admins: await Admin.find({}).lean(),
    users: await User.find({}).lean(),
    companies: await Company.find({}).lean(),
    customers: await Customer.find({}).lean(),
    suppliers: await Supplier.find({}).lean(),
    salesEntries: await SalesEntry.find({}).lean(),
    purchaseEntries: await PurchaseEntry.find({}).lean(),
    subscriptions: await Subscription.find({}).lean(),
    customerPayments: await CustomerPayment.find({}).lean(),
    supplierPayments: await SupplierPayment.find({}).lean(),
    fiscalYears: await FiscalYear.find({}).lean(),
  };
};

// Export functions for different formats
const exportExcel = async (res, data) => {
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
  createWorksheet("Admins", data.admins);
  createWorksheet("Users", data.users);
  createWorksheet("Companies", data.companies);
  createWorksheet("Customers", data.customers);
  createWorksheet("Suppliers", data.suppliers);
  createWorksheet("Sales Entries", data.salesEntries);
  createWorksheet("Purchase Entries", data.purchaseEntries);
  createWorksheet("Subscriptions", data.subscriptions);
  createWorksheet("Customer Payments", data.customerPayments);
  createWorksheet("Supplier Payments", data.supplierPayments);
  createWorksheet("Fiscal Years", data.fiscalYears);

  const filename = `database_excel_export_${new Date().toISOString().split('T')[0]}.xlsx`;
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

  await workbook.xlsx.write(res);
  res.end();
};

const exportJson = (res, data) => {
  // Create a zip archive
  const archive = archiver('zip', {
    zlib: { level: 9 } // Compression level
  });

  const filename = `database_json_export_${new Date().toISOString().split('T')[0]}.zip`;
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

  // Pipe archive data to the response
  archive.pipe(res);

  // Create separate JSON files for each table
  Object.keys(data).forEach(tableName => {
    if (data[tableName].length > 0) {
      const jsonData = {
        exportDate: new Date().toISOString(),
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
  archive.append(summaryContent, { name: 'complete_database_export.json' });

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

const exportCsv = (res, data) => {
  // Create a zip archive
  const archive = archiver('zip', {
    zlib: { level: 9 } // Compression level
  });

  const filename = `database_csv_export_${new Date().toISOString().split('T')[0]}.zip`;
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

// Main export controller
const exportAllDatabaseData = async (req, res) => {
  console.log(req.query);
  console.log(req.query.format);

  try {
    const format = req.query.format || 'excel';
    console.log(`Starting database export in ${format} format...`);

    // Get all database data
    const data = await getAllDatabaseData();

    // Export based on format
    switch (format.toLowerCase()) {
      case 'csv':
        return exportCsv(res, data);
      case 'json':
        return exportJson(res, data);
      case 'excel':
      case 'xlsx':
        return await exportExcel(res, data);
      default:
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Unsupported format. Supported formats: csv, json, excel'
        });
    }

  } catch (error) {
    console.error("Database export error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error exporting database",
      error: error.message
    });
  }
};

// Keep the old JSON function for backward compatibility (optional)
// const exportAllDatabaseDataJSON = async (req, res) => {
//   try {
//     const data = await getAllDatabaseData();
//     return exportJson(res, data);
//   } catch (error) {
//     console.error("JSON database export error:", error);
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: "Error exporting database as JSON",
//       error: error.message
//     });
//   }
// };

module.exports = {
  exportAllDatabaseData,
  // exportAllDatabaseDataJSON
};