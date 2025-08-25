const express = require("express");
const router = express.Router();
const authorizeRoles = require("../middleware/authorizeRoles");
const ComputerizedSalesEntry = require("../models/computerizedSalesEntry"); // ✅ Add this import
const upload = require('../middleware/multer');

const {
  createComputerizedSalesEntry,
  getAllComputerizedSalesEntries,
  getComputerizedSalesEntry,
  updateComputerizedSalesEntry,
  deleteComputerizedSalesEntry,
} = require("../controllers/computerizedSalesEntry");

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
     .post(authorizeRoles(["admin", "user"]), createComputerizedSalesEntry)
     .get(authorizeRoles(["admin", "user"]), getAllComputerizedSalesEntries);

// Increment Print-Count on Printing:
// Add authentication middleware and proper error handling
router.post('/increment-print-count', authorizeRoles(["admin", "user"]), async (req, res) => {
  console.log('Increment ko request aayeko chha hai.');
  try {
    const { computerizedSalesEntryID } = req.body;
    console.log('req.body of computerizedSalesEntryID is: ', computerizedSalesEntryID);
    
    if (!computerizedSalesEntryID) {
      return res.status(400).json({ error: 'Missing computerizedSalesEntryID' });
    }
    
    const entry = await ComputerizedSalesEntry.findByIdAndUpdate(
      computerizedSalesEntryID,
      { $inc: { printCount: 1 } },
      { new: true }
    );

    console.log('Recently update sales entry after printing is: ', entry);
    
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
