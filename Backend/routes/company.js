const express = require("express");
const router = express.Router();
const multer = require('multer');
const storage = require('../middleware/multer');
const upload = multer({ storage: storage });

const { getCompaniesbyAdmin } = require("../controllers/companyController");
const authentication = require("../middleware/authentication");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
  createCompany,
  getAllCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
} = require("../controllers/company");


router.route("/")
    .post(authorizeRoles(["admin"]), upload.single('logo'), createCompany)
    .get(authorizeRoles(["admin","user"]), getAllCompanies);

router.route("/:id")
    .get(authorizeRoles(["admin"]), getCompany)
    .patch(authorizeRoles(["admin"]), updateCompany)
    .delete(authorizeRoles(["admin"]), deleteCompany);

// yo chai future ma companies name ko dropdown ma use garna ko lagi ho
router.get("/", authentication, getCompaniesbyAdmin);

module.exports = router;
