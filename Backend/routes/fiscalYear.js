const express = require("express");
const router = express.Router();

const authorizeRoles = require("../middleware/authorizeRoles");

const {
  createFiscalYear,
  getFiscalYear,
  getAllFiscalYears,
  updateFiscalYear,
  deleteFiscalYear,
} = require("../controllers/fiscalYear");

// router.use(authorizeRoles(["superadmin"]));

// Routes for Fiscal Year
router.route("/")
      .post(authorizeRoles(["superadmin"]), createFiscalYear)
      .get(authorizeRoles(["superadmin", "admin", "user"]), getAllFiscalYears);


router.route("/:id")
      .get(authorizeRoles(["superadmin"]), getFiscalYear)
      .patch(authorizeRoles(["superadmin"]), updateFiscalYear)
      .delete(authorizeRoles(["superadmin"]), deleteFiscalYear);

module.exports = router;
