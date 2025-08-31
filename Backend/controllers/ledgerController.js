// controllers/LedgerController.js
import LedgerService from "../services/LedgerService.js";

class LedgerController {
  static async getCustomerLedger(req, res) {
    try {
      const { customerId } = req.params;
      const { fromDate, toDate } = req.query;

      const ledger = await LedgerService.getCustomerLedger(
        customerId,
        fromDate,
        toDate
      );

      res.json(ledger);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getSupplierLedger(req, res) {
    try {
      const { supplierId } = req.params;
      const { fromDate, toDate } = req.query;

      const ledger = await LedgerService.getSupplierLedger(
        supplierId,
        fromDate,
        toDate
      );

      res.json(ledger);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

export default LedgerController;
