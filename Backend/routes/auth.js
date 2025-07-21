const express = require("express");
const router = express.Router();
const authentication = require("../middleware/authentication");

const {
  register,
  login,
  verifyEmail,
  setPassword,
  // registerAdmin,
  // registerUser,
} = require("../controllers/auth");

const { sendReVerificationEmail } = require('../controllers/admin');

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/set-password").post(setPassword);

router.route("/reVerificationEmail").post(sendReVerificationEmail);


router.route('/verify-Email/:id/:role').post(verifyEmail)

// router.route("/register/admin").post(authentication, registerAdmin);
// router.route("/register/user").post(authentication, registerUser);

module.exports = router;
