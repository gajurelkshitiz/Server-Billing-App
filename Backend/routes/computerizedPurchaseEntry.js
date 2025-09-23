const express = require("express");
const router = express.Router();
const authorizeRoles = require("../middleware/authorizeRoles");
const ComputerizedPurchaseEntry = require("../models/computerizedPurchaseEntry"); // ✅ Add this import
const upload = require('../middleware/multer');


// NOT UPDATED TILL NOW ...

const {
  createComputerizedPurchaseEntry,
  getAllComputerizedPurchaseEntries,
  getComputerizedPurchaseEntry,
  // updateComputerizedSalesEPurchase
  // deleteComputerizedSalesEntry,
} = require("../controllers/computerizedPurchaseEntry");

// Routes for sales entries
// router.route("/")
//   .post(authorizeRoles(["admin","user"]), upload.single('billAttachment'), createSalesEntry)
//   .get(authorizeRoles(["admin", "user"]), getAllSalesEntries);

// router.route("/:id")
//   .get(authorizeRoles(["admin", "user"]), getSalesEntry)
//   .patch(authorizeRoles(["admin","user"]), upload.single('billAttachment'), updateSalesEntry)
//   .delete(authorizeRoles(["admin", "user"]), deleteSalesEntry);

// router.route("/import/excel")
//   .post(authorizeRoles(["admin"]), upload.single('file'), importSalesEntriesFromExcel);

router.route("/")
     .post(authorizeRoles(["admin", "user"]), createComputerizedPurchaseEntry)
     .get(authorizeRoles(["admin", "user"]), getAllComputerizedPurchaseEntries);

// Increment Print-Count on Printing:
// Add authentication middleware and proper error handling
router.post('/increment-print-count', authorizeRoles(["admin", "user"]), async (req, res) => {
  console.log('Increment ko request aayeko chha hai.');
  try {
    const { computerizedPurchaseEntryID } = req.body;
    console.log('req.body of computerizedPurchaseEntryID is: ', computerizedPurchaseEntryID);
    
    if (!computerizedPurchaseEntryID) {
      return res.status(400).json({ error: 'Missing computerizedPurchaseEntryID' });
    }
    
    const entry = await ComputerizedPurchaseEntry.findByIdAndUpdate(
      computerizedPurchaseEntryID,
      { $inc: { printCount: 1 } },
      { new: true }
    );

    console.log('Recently update Purchase entry after printing is: ', entry);
    
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    
    res.json({ printCount: entry.printCount });
  } catch (err) {
    console.error('Error incrementing print count:', err); // ✅ Add error logging
    res.status(500).json({ error: err.message });
  }
});
  
module.exports = router;
