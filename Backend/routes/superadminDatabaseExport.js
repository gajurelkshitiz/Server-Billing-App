const express = require("express");
const router = express.Router();

const authorizeRoles = require("../middleware/authorizeRoles");
const {
  exportAllDatabaseData,
} = require("../controllers/superadminDatabaseExport.js");

const {
  exportAdminDatabaseData
} = require("../controllers/adminDatabaseExport.js");

// Single route that handles both superadmin and admin
router.route("/files")
  .get(authorizeRoles(["superadmin", "admin"]), (req, res) => {
    // Route based on user role
    if (req.user.role === "superadmin") {
      return exportAllDatabaseData(req, res);
    } else if (req.user.role === "admin") {
      return exportAdminDatabaseData(req, res);
    } else {
      return res.status(403).json({
        success: false,
        message: "Access denied. Invalid role."
      });
    }
  });

module.exports = router;