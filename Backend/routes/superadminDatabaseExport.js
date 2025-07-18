const express = require("express");
const router = express.Router();

const authorizeRoles = require("../middleware/authorizeRoles");
const {
  exportAllDatabaseData,
  // exportAllDatabaseDataJSON
} = require("../controllers/superadminDatabaseExport.js");

// Only superadmin should be able to export entire database
router.route("/files")
  .get(authorizeRoles(["superadmin"]), exportAllDatabaseData);


// yo chaidaina paxi....  
// router.route("/json")
//   .get(authorizeRoles(["superadmin"]), exportAllDatabaseDataJSON);

module.exports = router;