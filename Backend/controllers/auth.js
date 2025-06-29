// Importing status codes and custom error classes
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
// Importing middlewares
const generateToken = require("../middleware/generateToken");
const checkPassword = require("../middleware/checkPassword");
// importing models
const Admin = require("../models/admin");
const User = require("../models/user");
const Superadmin = require("../models/superadmin");
const Company = require("../models/company");
const bcrypt = require("bcryptjs");
const { sendWelcomeEmail } = require("../middleware/email");

// register for superadmin
const register = async (req, res) => {
  const existing = await Superadmin.findOne({});
  if (existing) {
    throw new UnauthenticatedError("Superadmin already exists. Please login.");
  }

  const superadmin = await Superadmin.create({ ...req.body });
 
  res.status(StatusCodes.CREATED).json({
    user: { name: superadmin.name },
    msg: "Superadmin Registered Successfully",
  });
};



const verifyEmail = async (req, res) => {
  const emailVerificationToken = req.params.id;
  const Role = req.params.role;
  console.log(Role);
  console.log(Role==="admin")
  let userORadmin;
  if (Role === "user") {
    userORadmin = await User.findOne({emailVerificationToken:emailVerificationToken})
    console.log(userORadmin.name)
    if(userORadmin.name){
      userORadmin.emailVerificationToken = null;
      userORadmin.emailVerificationTokenExpiresAt = null;
      userORadmin.isVerified = true;
      await userORadmin.save()
      return res.status(200).json({ message: "Email verified successfully" });
    }
    else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  
  else if (Role === "admin") {
    userORadmin = await Admin.findOne({emailVerificationToken:emailVerificationToken})
    console.log(userORadmin.name)
    if(userORadmin.name){
      userORadmin.emailVerificationToken = null;
      userORadmin.emailVerificationTokenExpiresAt = null;
      userORadmin.isVerified = true;
      await userORadmin.save()
      return res.status(200).json({ message: "Email verified successfully" });
    }
    else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

}


// login for superadmin and admin and user
const login = async (req, res) => {
  console.log("Login request received");

  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  let account = null;
  let role = null;
 
  // Try to find in Superadmin collection
  account = await Superadmin.findOne({ email });
  if (account) role = "superadmin";

  // If not found, try Admin
  if (!account) {
    account = await Admin.findOne({ email });
    if (account) role = "admin";
  }

  // If not found, try User
  if (!account) {
    account = await User.findOne({ email });
    if (account) role = "user";
  }

  // If still not found, return error
  if (!account) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "User with this email not found" });
  }

  console.log('original password')
  console.log(account.password)
  console.log('entered password ')
  console.log(password)

  console.log(role)
  console.log(account.isVerified)
  // check for verified/unverified user or Admin.
  if (role === "user" || role === "admin") {
    if (!account.isVerified) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        msg: `Dear, ${account.name}. Please verify your email before login.`,
      });
    }
  }

  // Validate password
  const isPasswordCorrect = await checkPassword(password, account.password);

  console.log(isPasswordCorrect)
  console.log("check password correct or not boolean")
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Incorrect Password");
  }



  // Generate JWT token based on role
  let token;
  
  if (role === "user") {
    // For users, include adminID and companyID in token
    token = generateToken(account._id, account.name, role, account.adminID, account.companyID);
  } else if (role === "admin") {
    // For admins, only include their own ID
    token = generateToken(account._id, account.name, role);
  } else if (role === "superadmin") {
    // For superadmin, only include their own ID
    token = generateToken(account._id, account.name, role);
  }

  // Respond with role-specific message
  res.status(StatusCodes.OK).json({
    user: { 
      name: account.name, 
      role: account.role,
      ...(role === "user" && { adminID: account.adminID, companyID: account.companyID })
    },
    token,
    msg: `Successfully Logged in as ${role.charAt(0).toUpperCase() + role.slice(1)}.`,
  });
}

// Set password after email verification
const setPassword = async (req, res) => {
  const { token, role, password } = req.body;
  if (!token || !role || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let userOrAdmin;
  if (role === "user") {
    userOrAdmin = await User.findOne({ emailVerificationToken: token });
  } else if (role === "admin") {
    userOrAdmin = await Admin.findOne({ emailVerificationToken: token });
  } else {
    return res.status(400).json({ message: "Invalid role" });
  }

  // Token not found or already used
  if (!userOrAdmin) {
    return res.status(410).json({ message: "This link has already been used or is invalid. Please login." });
  }

  // Check if token is expired
  if (
    userOrAdmin.emailVerificationTokenExpiresAt &&
    userOrAdmin.emailVerificationTokenExpiresAt < new Date()
  ) {
    return res.status(410).json({ message: "This link has expired. Please request a new verification email." });
  }

  // Hash and set new password
  const salt = await bcrypt.genSalt(10);
  userOrAdmin.password = await bcrypt.hash(password, salt);

  userOrAdmin.isVerified = true;
  userOrAdmin.emailVerificationToken = null;
  userOrAdmin.emailVerificationTokenExpiresAt = null;
  await userOrAdmin.save();

  // Send welcome email here
  await sendWelcomeEmail(userOrAdmin.email, userOrAdmin.name);
  console.log('Welcome Message Sent Successfully')



  res.status(200).json({ message: "Password set successfully. Please login to continue." });
};

module.exports = {
  register,
  verifyEmail,
  login,
  setPassword,
  // registerAdmin,
  // registerUser,
};
