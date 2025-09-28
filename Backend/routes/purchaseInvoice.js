// routes/invoice.js
const express = require('express');
const router = express.Router();
const { generatePurchaseInvoice } = require('../controllers/purchaseInvoice');
const Company = require('../models/company');
const ComputerizedPurchaseEntry = require('../models/computerizedPurchaseEntry');
const Supplier = require('../models/Supplier');

// Helper to safely get text
function safeText(val) {
  return val !== undefined && val !== null ? String(val) : '';
}

// Helper to safely get number for .toLocaleString()
function safeNumber(val) {
  return typeof val === 'number' ? val : 0;
}

const createInvoiceDate = async (req, res) => {
  const { computerizedPurchaseEntryID } = req.query;
  if (!computerizedPurchaseEntryID) throw new Error('Missing computerizedPurchaseEntryID');

  const computerizedPurchaseEntry = await ComputerizedPurchaseEntry.findById(computerizedPurchaseEntryID);
  if (!computerizedPurchaseEntry) throw new Error('No computerized Purchase entry found');


  // check if bill is original or copy of original here, by setting a printFlag [true or false]
  const printFlag = computerizedPurchaseEntry.printCount > 0;

  const companyID = computerizedPurchaseEntry.companyID;
  const company = await Company.findById(companyID);
  if (!company) throw new Error('No company found');

  const supplier = await Supplier.findById(computerizedPurchaseEntry.supplierID);
  if (!supplier) throw new Error('No supplier found');

  // format the date before using it:
  // Just use the date part (YYYY-MM-DD) from computerizedSalesEntry.date
  const formattedDate = computerizedPurchaseEntry.date
    ? computerizedPurchaseEntry.date.toISOString().split('T')[0].replace(/-/g, '/')
    : '';

  const invoiceData = {
    company: {
      name: safeText(company.name),
      address: safeText(company.address),
      vat: safeText(company.vat)
    },
    invoiceNumber: safeText(computerizedPurchaseEntry.invoiceNo),
    // date: safeText(computerizedSalesEntry.date),
    date: safeText(formattedDate),
    placeOfSupply: safeText(company.address),
    reverseCharge: "",
    // billedTo: {
    //   name: safeText(customer.name),
    //   address: safeText(customer.address),
    //   pan: safeText(customer.panNo),
    // },
    // shippedTo: {
    //   name: safeText(computerizedPurchaseEntry.shipperName),
    //   address: safeText(computerizedPurchaseEntry.shipperAddress),
    // },
    items: (computerizedPurchaseEntry.items || []).map(item => ({
      itemCode: safeText(item.itemCode),
      description: safeText(item.description),
      hsCode: safeText(item.hsCode),
      qty: safeNumber(item.quantity),
      unit: safeText(item.unit),
      price: safeNumber(item.price),
      amount: safeNumber(item.amount)
    })),
    subtotal: safeNumber(computerizedPurchaseEntry.total),
    vat: safeNumber(computerizedPurchaseEntry.vat),
    vatAmount: safeNumber(computerizedPurchaseEntry.vatAmount),
    total: safeNumber(computerizedPurchaseEntry.grandTotal),
    amountInWords: safeText(computerizedPurchaseEntry.amountInWords),
    generated_datetime: safeText(computerizedPurchaseEntry.createdAt),
    printFlag: printFlag
  };
  console.log('invoiceData', invoiceData);

  return invoiceData;
};

// Route for downloading the invoice
router.get('/generate-invoice', async (req, res) => {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
  const invoiceData = await createInvoiceDate(req, res);
  generatePurchaseInvoice(invoiceData, res);
});



router.get('/preview-invoice', async (req, res, next) => {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename=invoice.pdf');

  // Attach error handler to res
  res.on('error', (err) => {
    console.error('Response stream error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  });

  try {
    const invoiceData = await createInvoiceDate(req, res);
    generatePurchaseInvoice(invoiceData, res); // doc.pipe(res) inside this function
  } catch (err) {
    if (!res.headersSent) {
      res.status(400).json({ error: err.message });
    } else {
      console.error('Error after headers sent:', err);
    }
  }
});


module.exports = router;
