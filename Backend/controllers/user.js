const User = require("../models/user");
const { 
    BadRequestError, 
    notFoundError 
} = require("../errors");
const { StatusCodes } = require("http-status-codes");
const genertateToken = require("../middleware/generateToken");
const crypto = require('crypto');
const { sendVerificationEmail }  = require('../middleware/email')
const Company = require("../models/company");
const uploadOnCloudinary = require("../utils/cloudinary");
const { sendCustomTemplateWhatsappMessage } = require("../middleware/whatsapp");

//  functionalities done by Admin:

const createUser = async (req, res) => {
  console.log(req.body);
  const { name, email, phoneNo, companyID, departmentNo } = req.body;
  if (!name || !email || !phoneNo || !companyID || !departmentNo) {
    throw new BadRequestError("Please provide all values");
  }

  // Verify company exists and belongs to admin
  const company = await Company.findOne({
    _id: companyID,
    adminID: req.user.tokenID,
  });

  if (!company) {
    throw new UnauthenticatedError("Company not found");
  }

  req.body.adminID = req.user.tokenID;

  // Optional profile image upload
  if (req.file && req.file.path) {
    const uploaded = await uploadOnCloudinary(
      req.file.path,
      `${Date.now()}-${req.file.originalname}`,
      "BILL APP/USER PROFILES"
    );
    if (uploaded && uploaded.url) {
      req.body.profileImage = uploaded.url;
    }
  }

  // Generate verification token
  const emailVerificationToken = crypto.randomBytes(64).toString('hex');
  const emailVerificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

  try {
    // Send verification email and WhatsApp first
    const emailResult = await sendVerificationEmail(email, name, emailVerificationToken, "user");
    const whatsappResult = await sendCustomTemplateWhatsappMessage(phoneNo, name);

    const emailSuccess = emailResult && (emailResult.status === "success" || emailResult.status === 200);
    const whatsappSuccess = whatsappResult && (whatsappResult.status === "success" || whatsappResult.status === 200);

    if (emailSuccess && whatsappSuccess) {
      // Only create user if both notifications succeeded
      const user = await User.create({
        ...req.body,
        emailVerificationToken,
        emailVerificationTokenExpiresAt,
        isVerified: false
      });

      res.status(StatusCodes.CREATED).json({
        status: "success",
        message: "User created, email and WhatsApp sent.",
        emailResult,
        whatsappResult,
        user,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: `User not created. Email: ${emailSuccess ? "success" : "error"}, WhatsApp: ${whatsappSuccess ? "success" : "error"}`,
        emailResult,
        whatsappResult,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred while sending notifications.",
      error: error.message || error,
    });
  }
};


const getAllUsers = async (req, res) => {
  const users = await User.find({ adminID: req.user.tokenID }).sort(
    "createdAt"
  );
  if (!users) {
    throw new notFoundError("No Users Found");
  }
  res.status(StatusCodes.OK).json({ users, count: users.length });
};

const getUser = async (req, res) => {
  const {
    user: { tokenID },
    params: { id: userID },
  } = req;

  const user = await User.findOne({
    _id: userID,
    adminID: tokenID, // yaha bug huna sakcha still confusion hataunu chha.
  });

  if (!user) {
    throw new notFoundError(`No User with id: ${userID}`);
  }

  res.status(StatusCodes.OK).json({ user });
};

const updateUser = async (req, res) => {
  const {
    user: { tokenID },
    params: { id: userID },
    body: { name, email, phoneNo },
  } = req;

  if (name === "" || email === "" || phoneNo === "") {
    throw new BadRequestError("All fields are required");
  }
  const user = await User.findOneAndUpdate(
    { _id: userID, adminID: tokenID },
    req.body,
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new notFoundError(`No User Found with id: ${userID}`);
  }
  res.status(StatusCodes.OK).json({ user });
};

const deleteUser = async (req, res) => {
  const {
    user: { tokenID },
    params: { id: userID },
  } = req;
  const user = await User.findOneAndDelete({ _id: userID, adminID: tokenID });
  if (!user) {
    throw new notFoundError(`No User Found with id: ${userID}`);
  }
  res.status(StatusCodes.OK).send();
};

// Functionalities done by User(self):

const getOwnProfile = async (req, res) => {
  const user = await User.findById(req.user.tokenID);
  if (!user) {
    throw new notFoundError(`No User with id: ${req.user.tokenID}`);
  }
  res.status(StatusCodes.OK).json({ user });
};

const updateOwnProfile = async (req, res) => {
  const disallowedFields = [
    "_id", "adminID", "companyID", "isVerified", 
     "createdAt", "updatedAt", 
  ];
  // "__v", "emailVerificationTokenExpiresAt", "emailVerificationToken",
  
  // Collect updates from body
  let updates = Object.keys(req.body);

  console.log(req.body);

  // If a file is uploaded, treat profileImage as an update
  if (req.file && req.file.path && !updates.includes("profileImage")) {
    updates.push("profileImage");
  }

  // Validate updates: none should be in disallowedFields
  const isValidOperation = updates.every((update) =>
    !disallowedFields.includes(update)
  );
  if (!isValidOperation) {
    throw new BadRequestError("Invalid updates!");
  }

  const user = await User.findById(req.user.tokenID);
  if (!user) {
    throw new notFoundError(`No User Found.`);
  }

  // Handle profile image upload
  if (req.file && req.file.path) {
    const uploaded = await uploadOnCloudinary(
      req.file.path,
      `${Date.now()}-${req.file.originalname}`,
      "BILL APP/USER PROFILES"
    );
    if (uploaded && uploaded.url) {
      req.body.profileImage = uploaded.url;
    }
  }

  // Update fields
  updates.forEach((update) => {
    if (update === "profileImage" && req.body.profileImage) {
      user.profileImage = req.body.profileImage;
    } else if (req.body[update] !== undefined) {
      user[update] = req.body[update];
    }
  });

  await user.save();
  res.status(StatusCodes.OK).json({ user });
};

module.exports = {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getOwnProfile,
  updateOwnProfile,
};
