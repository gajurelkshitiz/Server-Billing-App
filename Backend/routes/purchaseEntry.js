const express = require("express");
const router = express.Router();
const authorizeRoles = require("../middleware/authorizeRoles");

// const multer = require('multer');
// const storage = require('../middleware/multer');
// const upload = multer({ storage: storage });

const upload = require('../middleware/multer');

const {
  createPurchaseEntry,
  getAllPurchaseEntries,
  getPurchaseEntry,
  updatePurchaseEntry,
  deletePurchaseEntry,
} = require("../controllers/purchaseEntry");


// Routes for purchase entries
router.route("/")
        .post(authorizeRoles(["admin","user"]), upload.single('billAttachment'), createPurchaseEntry)
        // .post(authorizeRoles(["admin","user"]), createPurchaseEntry)
        .get(authorizeRoles(["admin", "user"]), getAllPurchaseEntries);

router.route("/:id")
        .get(authorizeRoles(["admin", "user"]), getPurchaseEntry)
        .patch(authorizeRoles(["admin","user"]), upload.single('billAttachment'), updatePurchaseEntry)
        .delete(authorizeRoles(["admin", "user"]), deletePurchaseEntry);

module.exports = router;
