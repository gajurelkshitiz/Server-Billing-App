const express = require("express");
const router = express.Router();
// const multer = require('multer');
// const storage = require('../middleware/multer');
// const upload = multer({ storage: storage });
// Update to use the new multer configuration
const upload = require('../middleware/multer');


const authorizeRoles = require("../middleware/authorizeRoles");

const {
  createAdmin,
  getAllAdmins,
  exportAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  getOwnProfile,
  updateOwnProfile,
  sendReVerificationEmail,
} = require("../controllers/admin");
 

// Superadmin-only routes
router.route("/")
  .get(authorizeRoles("superadmin"), getAllAdmins)
  .post(authorizeRoles("superadmin"), upload.single('profileImage'), createAdmin); // <-- add upload.single
  

router.route("/:id")
  .get(authorizeRoles(["superadmin", "admin"]), getAdmin)
  .patch(authorizeRoles(["superadmin"]), upload.single('profileImage'), updateAdmin)
  .delete(authorizeRoles(["superadmin"]), deleteAdmin);


// Admin-only self routes
router.get("/me/profile", authorizeRoles(["admin"]), getOwnProfile);
router.patch("/me/update", authorizeRoles(["admin"]), upload.single('profileImage'), updateOwnProfile);

router.route("/export/excel")
  .get(authorizeRoles("superadmin"), exportAdmins);

module.exports = router;
