// controllers/LedgerController.js
const {
    getCustomerLedgerService,
    getSupplierLedgerService
} = require("../services/LedgerService.js");

const getCustomerLedger = async (req, res) => {
  try {
    console.log("This is customer ledger.");
    const { customerId } = req.params;
    const { fromDate, toDate } = req.query;

    console.log("Request Received: ", customerId, fromDate, toDate);

    const ledger = await getCustomerLedgerService(
      customerId,
      fromDate,
      toDate
    );

    res.json(ledger);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSupplierLedger = async (req, res) => {
  try {
    console.log("This is Supplier ledger.");
    const { supplierId } = req.params;
    const { fromDate, toDate } = req.query;

    const ledger = await getSupplierLedgerService(
      supplierId,
      fromDate,
      toDate
    );

    res.json(ledger);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
    getCustomerLedger,
    getSupplierLedger
}
