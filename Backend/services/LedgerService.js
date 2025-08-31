// services/LedgerService.js
const NepaliDate = require("nepali-datetime");

const Customer = require("../models/Customer.js");
const SalesEntry = require("../models/salesEntry.js");
const ComputerizedSalesEntry = require("../models/computerizedSalesEntry.js");
const CustomerPayment = require("../models/CustomerPayment.js");


// Helper to get current fiscal year start date in Nepali calendar (Bikram Sambat)
// For now, hardcoded as "01-04-2082" as per your request
const getFiscalYearStartDate = () => {
  const now = new NepaliDate();
  const currentYear = now.getYear()
  return `01-04-${currentYear}`;
};

// Helper to format date as 'YYYY-MM-DD'
const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Get Customer Ledger as a function
const getCustomerLedgerService = async (customerId, fromDate, toDate) => {
  const customer = await Customer.findById(customerId);
  if (!customer) throw new Error("Customer not found");

  const start = new Date(fromDate);
  const end = new Date(toDate);

  // 1. Get Sales Entries (Invoices)
  const sales = await ComputerizedSalesEntry.find({
    customerID: customerId,
    // date: { $gte: start, $lte: end }
  }).sort({ date: 1 });

  // 2. Get Payments
  const payments = await CustomerPayment.find({
    customerID: customerId,
    // date: { $gte: start, $lte: end }
  }).sort({ date: 1 });

  // 3. Merge into one transaction list
  const transactions = [
    ...sales.map(s => ({
      date: s.date,
      particulars: `Invoice #${s.invoiceNo}`,
      debit: s.grandTotal,
      credit: 0
    })),
    ...payments.map(p => ({
      date: p.date,
      particulars: `Payment ${p.paymentMode || ""}`,
      debit: 0,
      credit: p.amountPaid
    }))
  ];

  // Sort by date
  transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

  // 4. Running Balance and type
  let balance = customer.prevClosingBalance || 0;
  let ledger = [];

  // Add opening balance as first transaction if not zero
  if (customer.prevClosingBalance && customer.prevClosingBalance !== 0) {
    ledger.push({
      date: getFiscalYearStartDate(), // Already formatted as 'YYYY-MM-DD'
      particulars: "Opening Balance",
      debit: 0,
      credit: 0,
      runningBalance: customer.prevClosingBalance,
      type: customer.type // 'credit' or 'debit'
    });
  }

  transactions.forEach(t => {
    balance = balance + t.debit - t.credit;
    ledger.push({
      ...t,
      date: formatDate(t.date), // Format the date here
      runningBalance: Math.abs(balance),
      type: balance >= 0 ? "debit" : "credit"
    });
  });

  return {
    customer: customer.name,
    openingBalance: customer.prevClosingBalance,
    openingBalanceType: customer.type,
    transactions: ledger,
    closingBalance: balance
  };
};

module.exports = {
  getCustomerLedgerService
}