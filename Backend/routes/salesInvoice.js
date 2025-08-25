// routes/invoice.js
const express = require('express');
const router = express.Router();
const { generateSalesInvoice } = require('../controllers/salesInvoice');
const Company = require('../models/company');
const ComputerizedSalesEntry = require('../models/computerizedSalesEntry');
const Customer = require('../models/Customer');

// Helper to safely get text
function safeText(val) {
  return val !== undefined && val !== null ? String(val) : '';
}

// Helper to safely get number for .toLocaleString()
function safeNumber(val) {
  return typeof val === 'number' ? val : 0;
}

const createInvoiceDate = async (req, res) => {
  const { computerizedSalesEntryID } = req.query;
  if (!computerizedSalesEntryID) throw new Error('Missing computerizedSalesEntryID');

  const computerizedSalesEntry = await ComputerizedSalesEntry.findById(computerizedSalesEntryID);
  if (!computerizedSalesEntry) throw new Error('No computerized sales entry found');


  // check if bill is original or copy of original here, by setting a printFlag [true or false]
  const printFlag = computerizedSalesEntry.printCount > 0;

  const companyID = computerizedSalesEntry.companyID;
  const company = await Company.findById(companyID);
  if (!company) throw new Error('No company found');

  const customer = await Customer.findById(computerizedSalesEntry.customerID);
  if (!customer) throw new Error('No customer found');

  // format the date before using it:
  // Just use the date part (YYYY-MM-DD) from computerizedSalesEntry.date
  const formattedDate = computerizedSalesEntry.date
    ? computerizedSalesEntry.date.toISOString().split('T')[0].replace(/-/g, '/')
    : '';

  const invoiceData = {
    company: {
      name: safeText(company.name),
      address: safeText(company.address),
      vat: safeText(company.vat)
    },
    invoiceNumber: safeText(computerizedSalesEntry.invoiceNo),
    // date: safeText(computerizedSalesEntry.date),
    date: safeText(formattedDate),
    placeOfSupply: safeText(company.address),
    reverseCharge: "",
    billedTo: {
      name: safeText(customer.name),
      address: safeText(customer.address),
      pan: safeText(customer.panNo),
    },
    shippedTo: {
      name: safeText(computerizedSalesEntry.shipperName),
      address: safeText(computerizedSalesEntry.shipperAddress),
    },
    items: (computerizedSalesEntry.items || []).map(item => ({
      itemCode: safeText(item.itemCode),
      description: safeText(item.description),
      hsCode: safeText(item.hsCode),
      qty: safeNumber(item.quantity),
      unit: safeText(item.unit),
      price: safeNumber(item.price),
      amount: safeNumber(item.amount)
    })),
    subtotal: safeNumber(computerizedSalesEntry.total),
    vat: safeNumber(computerizedSalesEntry.vat),
    vatAmount: safeNumber(computerizedSalesEntry.vatAmount),
    total: safeNumber(computerizedSalesEntry.grandTotal),
    amountInWords: safeText(computerizedSalesEntry.amountInWords),
    generated_datetime: safeText(computerizedSalesEntry.createdAt),
    printFlag: printFlag
  };
  console.log('invoiceData', invoiceData);

  return invoiceData;
};

// Define shared invoice data once
// const invoiceData = {
//   company: {
//     name: 'ABC SUPERMARKET PVT. LTD',
//     address: 'BHARATPUR, CHITWAN',
//     vat: '123456789'
//   },
//   invoiceNumber: '19/081/83',
//   date: '1/9/2079',
//   placeOfSupply: 'Bharatpur-10,Chitwan',
//   reverseCharge: '',
//   billedTo: {
//     name: 'Local Kirana Pasal',
//     address: 'Bharatpur-10,Chitwan',
//     pan: '745981285'
//   },
//   shippedTo: {
//     name: 'Local Kirana Pasal',
//     address: 'Bharatpur-10,Chitwan'
//   },
//   items: [
//     { itemCode: 100, description: 'Loreal Shampoo-500ml', hsCode: '241', qty: 55, unit: 'Piece', price: 450, amount: 24750 },
//     { itemCode: 122, description: 'Bajaj Hair Oil - 200ml', hsCode: '246', qty: 50, unit: 'Piece', price: 400, amount: 20000 },
//     { itemCode: 202, description: 'Sanitizer', hsCode: '256', qty: 50, unit: 'Piece', price: 275, amount: 13750 }
//   ],
//   subtotal: 58500,
//   vat: 7605,
//   total: 66105,
//   amountInWords: 'Sixty Six thousands One hundred and five only.',
//   generated_datetime: '2025-07-29 13:50:50',
// };

// Route for downloading the invoice
router.get('/generate-invoice', async (req, res) => {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
  const invoiceData = await createInvoiceDate(req, res);
  generateSalesInvoice(invoiceData, res);
});

// Route for previewing the invoice in the browser
// router.get('/preview-invoice', async (req, res) => {
//   res.setHeader('Content-Type', 'application/pdf');
//   res.setHeader('Content-Disposition', 'inline; filename=invoice.pdf');
//   // Correct way to log query parameters
//   console.log('inside preview-invoice', req.query);

//   // If you're accessing a specific param
//   const { computerizedSalesEntryID } = req.query;
//   console.log('computerizedSalesEntryID:', computerizedSalesEntryID);
//   const invoiceData = await createInvoiceDate(req, res);
//   try {
//     await generateSalesInvoice(invoiceData, res);
//   } catch (err) {
//     // Only call next(err) if response hasn't been sent
//     if (!res.headersSent) next(err);
//   }
// });



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
    generateSalesInvoice(invoiceData, res); // doc.pipe(res) inside this function
  } catch (err) {
    if (!res.headersSent) {
      res.status(400).json({ error: err.message });
    } else {
      console.error('Error after headers sent:', err);
    }
  }
});


module.exports = router;
