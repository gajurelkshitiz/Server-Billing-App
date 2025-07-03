const express = require("express");
const router = express.Router();
const multer = require('multer');
const storage = require('../middleware/multer');
const upload = multer({ storage: storage });

const authorizeRoles = require("../middleware/authorizeRoles");

const {
  createAdmin,
  getAllAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  getOwnProfile,
  updateOwnProfile,
} = require("../controllers/admin");
 

// Superadmin-only routes
router.route("/")
  .get(authorizeRoles("superadmin"), getAllAdmins)
  .post(authorizeRoles("superadmin"), upload.single('profileImage'), createAdmin); // <-- add upload.single

router.route("/:id")
  .get(authorizeRoles(["superadmin"]), getAdmin)
  .patch(authorizeRoles(["superadmin"]), upload.single('profileImage'), updateAdmin)
  .delete(authorizeRoles(["superadmin"]), deleteAdmin);


// Admin-only self routes
router.get("/me/profile", authorizeRoles(["admin"]), getOwnProfile);
router.patch("/me/update", authorizeRoles(["admin"]), upload.single('profileImage'), updateOwnProfile);

module.exports = router;
