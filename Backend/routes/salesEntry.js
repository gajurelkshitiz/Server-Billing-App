const express = require("express");
const router = express.Router();
const authorizeRoles = require("../middleware/authorizeRoles");
const multer = require('multer');
const storage = require('../middleware/multer');

const upload = multer({ storage: storage });

const {
  createSalesEntry,
  getAllSalesEntries,
  getSalesEntry,
  updateSalesEntry,
  deleteSalesEntry,
} = require("../controllers/salesEntry");

// Routes for sales entries
router.route("/")
  .post(authorizeRoles(["admin","user"]), upload.single('billAttachment'), createSalesEntry)
  .get(authorizeRoles(["admin", "user"]), getAllSalesEntries);

router.route("/:id")
  .get(authorizeRoles(["admin", "user"]), getSalesEntry)
  .patch(authorizeRoles(["admin","user"]), updateSalesEntry)
  .delete(authorizeRoles(["admin", "user"]), deleteSalesEntry);

  
module.exports = router;
