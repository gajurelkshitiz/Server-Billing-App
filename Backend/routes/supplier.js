const express = require("express");
const router = express.Router();

const authorizeRoles = require("../middleware/authorizeRoles");

const {
  createSupplier,
  getAllSuppliers,
  getSuppliersBySearch,
  getSupplier,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/supplier");

router.use(authorizeRoles(["user", "admin"]));

// Routes for suppliers
router.route("/")
    .post(authorizeRoles(["user", "admin"]), createSupplier)
    .get(authorizeRoles(["user", "admin"]), getAllSuppliers);
router.route("/getbysearch").get(getSuppliersBySearch);
router.route("/:id")
        .get(authorizeRoles(["user", "admin"]), getSupplier)
        .patch(authorizeRoles(["user", "admin"]), updateSupplier)
        .delete(authorizeRoles(["user", "admin"]), deleteSupplier);

        
module.exports = router;
