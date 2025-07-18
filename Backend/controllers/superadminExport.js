const excelJS = require("exceljs");
const { StatusCodes } = require("http-status-codes");

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

const exportAllDatabaseData = async (req, res) => {
  try {
    console.log("Starting database export...");

    // Create a new workbook
    const workbook = new excelJS.Workbook();

    // Export Admins
    const adminWorksheet = workbook.addWorksheet("Admins");
    const admins = await Admin.find({}).lean();
    if (admins.length > 0) {
      adminWorksheet.columns = Object.keys(admins[0]).map(key => ({
        header: key.charAt(0).toUpperCase() + key.slice(1),
        key: key,
        width: 15
      }));
      admins.forEach(admin => adminWorksheet.addRow(admin));
    }

    // Export Users
    const userWorksheet = workbook.addWorksheet("Users");
    const users = await User.find({}).lean();
    if (users.length > 0) {
      userWorksheet.columns = Object.keys(users[0]).map(key => ({
        header: key.charAt(0).toUpperCase() + key.slice(1),
        key: key,
        width: 15
      }));
      users.forEach(user => userWorksheet.addRow(user));
    }

    // Export Companies
    const companyWorksheet = workbook.addWorksheet("Companies");
    const companies = await Company.find({}).lean();
    if (companies.length > 0) {
      companyWorksheet.columns = Object.keys(companies[0]).map(key => ({
        header: key.charAt(0).toUpperCase() + key.slice(1),
        key: key,
        width: 15
      }));
      companies.forEach(company => companyWorksheet.addRow(company));
    }

    // Export Customers
    const customerWorksheet = workbook.addWorksheet("Customers");
    const customers = await Customer.find({}).lean();
    if (customers.length > 0) {
      customerWorksheet.columns = Object.keys(customers[0]).map(key => ({
        header: key.charAt(0).toUpperCase() + key.slice(1),
        key: key,
        width: 15
      }));
      customers.forEach(customer => customerWorksheet.addRow(customer));
    }

    // Export Suppliers
    const supplierWorksheet = workbook.addWorksheet("Suppliers");
    const suppliers = await Supplier.find({}).lean();
    if (suppliers.length > 0) {
      supplierWorksheet.columns = Object.keys(suppliers[0]).map(key => ({
        header: key.charAt(0).toUpperCase() + key.slice(1),
        key: key,
        width: 15
      }));
      suppliers.forEach(supplier => supplierWorksheet.addRow(supplier));
    }

    // Export Sales Entries
    const salesWorksheet = workbook.addWorksheet("Sales Entries");
    const salesEntries = await SalesEntry.find({}).lean();
    if (salesEntries.length > 0) {
      salesWorksheet.columns = Object.keys(salesEntries[0]).map(key => ({
        header: key.charAt(0).toUpperCase() + key.slice(1),
        key: key,
        width: 15
      }));
      salesEntries.forEach(entry => salesWorksheet.addRow(entry));
    }

    // Export Purchase Entries
    const purchaseWorksheet = workbook.addWorksheet("Purchase Entries");
    const purchaseEntries = await PurchaseEntry.find({}).lean();
    if (purchaseEntries.length > 0) {
      purchaseWorksheet.columns = Object.keys(purchaseEntries[0]).map(key => ({
        header: key.charAt(0).toUpperCase() + key.slice(1),
        key: key,
        width: 15
      }));
      purchaseEntries.forEach(entry => purchaseWorksheet.addRow(entry));
    }

    // Export Subscriptions
    const subscriptionWorksheet = workbook.addWorksheet("Subscriptions");
    const subscriptions = await Subscription.find({}).lean();
    if (subscriptions.length > 0) {
      subscriptionWorksheet.columns = Object.keys(subscriptions[0]).map(key => ({
        header: key.charAt(0).toUpperCase() + key.slice(1),
        key: key,
        width: 15
      }));
      subscriptions.forEach(subscription => subscriptionWorksheet.addRow(subscription));
    }

    // Export Customer Payments
    const customerPaymentWorksheet = workbook.addWorksheet("Customer Payments");
    const customerPayments = await CustomerPayment.find({}).lean();
    if (customerPayments.length > 0) {
      customerPaymentWorksheet.columns = Object.keys(customerPayments[0]).map(key => ({
        header: key.charAt(0).toUpperCase() + key.slice(1),
        key: key,
        width: 15
      }));
      customerPayments.forEach(payment => customerPaymentWorksheet.addRow(payment));
    }

    // Export Supplier Payments
    const supplierPaymentWorksheet = workbook.addWorksheet("Supplier Payments");
    const supplierPayments = await SupplierPayment.find({}).lean();
    if (supplierPayments.length > 0) {
      supplierPaymentWorksheet.columns = Object.keys(supplierPayments[0]).map(key => ({
        header: key.charAt(0).toUpperCase() + key.slice(1),
        key: key,
        width: 15
      }));
      supplierPayments.forEach(payment => supplierPaymentWorksheet.addRow(payment));
    }

    // Export Fiscal Years
    const fiscalYearWorksheet = workbook.addWorksheet("Fiscal Years");
    const fiscalYears = await FiscalYear.find({}).lean();
    if (fiscalYears.length > 0) {
      fiscalYearWorksheet.columns = Object.keys(fiscalYears[0]).map(key => ({
        header: key.charAt(0).toUpperCase() + key.slice(1),
        key: key,
        width: 15
      }));
      fiscalYears.forEach(fiscalYear => fiscalYearWorksheet.addRow(fiscalYear));
    }

    // Set response headers for file download
    const filename = `database_export_${new Date().toISOString().split('T')[0]}.xlsx`;
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

    // Write workbook to response
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error("Database export error:", error);
    res.status(500).json({
      success: false,
      message: "Error exporting database",
      error: error.message
    });
  }
};

// Alternative JSON export function
const exportAllDatabaseDataJSON = async (req, res) => {
  try {
    console.log("Starting JSON database export...");

    const databaseData = {
      exportDate: new Date().toISOString(),
      data: {
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
      }
    };

    const filename = `database_export_${new Date().toISOString().split('T')[0]}.json`;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    
    res.status(StatusCodes.OK).json(databaseData);

  } catch (error) {
    console.error("JSON database export error:", error);
    res.status(500).json({
      success: false,
      message: "Error exporting database as JSON",
      error: error.message
    });
  }
};

module.exports = {
  exportAllDatabaseData,
  exportAllDatabaseDataJSON
};