// const express = require("express");
// const router = express.Router();

// const authorizeRoles = require("../middleware/authorizeRoles");
// const {
//   exportAdminDatabaseData
// } = require("../controllers/adminDatabaseExport.js");

// // Admin should be able to export their own database data
// // Route: /api/v1/admin-database-export/files?adminID=123&companyID=456&format=excel
// // router.route("/files")
// //   .get(authorizeRoles(["admin"]), exportAdminDatabaseData);
// router.route("/files")
//   .get(exportAdminDatabaseData);

// module.exports = router;
