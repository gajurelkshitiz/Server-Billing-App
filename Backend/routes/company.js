const express = require("express");
const router = express.Router();
// Update to use the new multer configuration
const upload = require('../middleware/multer');

const { getCompaniesbyAdmin } = require("../controllers/companyController");
const authentication = require("../middleware/authentication");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
  createCompany,
  getAllCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
  importCompaniesFromExcel,
} = require("../controllers/company");


router.route("/")
    .post(authorizeRoles(["admin"]), upload.single('logo'), createCompany)
    .get(authorizeRoles(["admin","user"]), getAllCompanies);

router.route("/:id")
    .get(authorizeRoles(["admin", "user"]), getCompany)
    .patch(authorizeRoles(["admin"]), upload.single('logo'), updateCompany)
    .delete(authorizeRoles(["admin"]), deleteCompany);

router.route("/import/excel")
    .post(authorizeRoles(["admin"]), upload.single('file'), importCompaniesFromExcel);

router.get("/", authentication, getCompaniesbyAdmin);

module.exports = router;
