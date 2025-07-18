const express = require("express");
const router = express.Router();
// const multer = require('multer');
// const storage = require('../middleware/multer');
// const upload = multer({ storage: storage });
const upload = require('../middleware/multer');

const authorizeRoles = require("../middleware/authorizeRoles");

const {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  updateOwnProfile,
  getOwnProfile,
} = require("../controllers/user");


// Admin-only routes
router.route('/')
  .post(authorizeRoles(["admin"]), upload.single('profileImage'), createUser)
  .get(authorizeRoles(["admin"]), getAllUsers);
router
  .route("/:id")
  .get(authorizeRoles(["admin"]), getUser)
  .patch(authorizeRoles(["admin"]), upload.single('profileImage'), updateUser)
  .delete(authorizeRoles(["admin"]), deleteUser);


// User-only self routes
router.get("/me/profile", authorizeRoles(["user"]), getOwnProfile);
router.patch("/me/update", authorizeRoles(["user"]), upload.single('profileImage'), updateOwnProfile);

module.exports = router;
