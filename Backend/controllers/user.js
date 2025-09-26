const User = require("../models/user");
const { BadRequestError, notFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const crypto = require('crypto');
const { sendVerificationEmail } = require('../middleware/email');
const Company = require("../models/company");
const Admin = require("../models/admin")
const { moveFileToFinalLocation, cleanupTempFile } = require("../utils/filePathHelper");
const { sendCustomTemplateWhatsappMessage } = require("../middleware/whatsapp");

//  functionalities done by Admin:

const createUser = async (req, res) => {
  console.log('inside create user', req.body);
  const { name, email, password, phoneNo, companyID, departmentNo } = req.body;
  if (!name || !email || !password || !phoneNo || !companyID || !departmentNo) {
    throw new BadRequestError("Please provide all values");
  }

  // Verify company exists and belongs to admin
  const company = await Company.findOne({
    _id: companyID,
    adminID: req.user.tokenID,
  });

  if (!company) {
    throw new BadRequestError("Company not found or not authorized");
  }

  req.body.companyName = company.name;

  // CreatedBy and mode insertion for user:
  const admin = await Admin.findOne({
    _id: req.user.tokenID
  });
  // const mode = admin.mode;
  console.log('The mode of current Admin is: ', admin.mode);

  // Generate verification token
  const emailVerificationToken = crypto.randomBytes(64).toString('hex');
  const emailVerificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

  // Create user first
  const user = await User.create({
    ...req.body,
    adminID: req.user.tokenID,
    companyID: company._id,
    mode: admin.mode,
    emailVerificationToken,
    emailVerificationTokenExpiresAt,
    // isVerified: false
  });

  // Handle profile image upload after user creation
  if (req.file) {
    try {
      const profileImagePath = await moveFileToFinalLocation(
        req.file.path,
        req.user.tokenID,
        req.user.name,
        'users',
        req.file.filename,
        company._id,
        company.name,
        user.name,     // ← Pass user name as entity name
        user._id       // ← Pass user ID as entity ID
      );
      
      user.profileImage = profileImagePath;
      await user.save();
    } catch (error) {
      console.error('Error moving user profile image:', error);
      cleanupTempFile(req.file.path);
    }
  }

  // try {
  //   const emailResult = await sendVerificationEmail(user.email, user.name, emailVerificationToken, "user");
  //   const whatsappResult = await sendCustomTemplateWhatsappMessage(user.phoneNo, user.name);

  //   const emailSuccess = emailResult && emailResult.status === "success";
  //   const whatsappSuccess = whatsappResult && whatsappResult.status === "success";

  //   res.status(StatusCodes.CREATED).json({
  //     status: emailSuccess && whatsappSuccess ? "success" : "partial_success",
  //     message: `User created successfully. Email: ${emailSuccess ? "sent" : "failed"}, WhatsApp: ${whatsappSuccess ? "sent" : "failed"}`,
  //     user,
  //     emailResult,
  //     whatsappResult
  //   });
  // } catch (error) {
  //   res.status(StatusCodes.CREATED).json({
  //     status: "user_created_notification_failed",
  //     message: "User created but notifications failed",
  //     user,
  //     error: error.message
  //   });
  // }
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

  // Get existing user for file handling
  const existingUser = await User.findOne({ _id: userID, adminID: tokenID });
  if (!existingUser) {
    throw new notFoundError(`No User Found with id: ${userID}`);
  }

  // Handle profile image upload
  if (req.file && req.file.path) {
    try {
      const company = await Company.findById(existingUser.companyID);
      if (company) {
        const profileImagePath = await moveFileToFinalLocation(
          req.file.path,
          tokenID,
          req.user.name,
          'users',
          req.file.filename,
          company._id,
          company.name,
          req.body.name || existingUser.name,  // Use updated name if provided
          userID
        );
        req.body.profileImage = profileImagePath;
      }
    } catch (error) {
      console.error('Error moving user profile image:', error);
      cleanupTempFile(req.file.path);
    }
  }

  const user = await User.findOneAndUpdate(
    { _id: userID, adminID: tokenID },
    req.body,
    { new: true, runValidators: true }
  );

  res.status(StatusCodes.OK).json({ user });
};

const deleteUser = async (req, res) => {
  const {
    user: { tokenID },
    params: { id: userID },
  } = req;
  const user = await User.findOneAndDelete({ _id: userID, adminID: tokenID });

  console.log(user);

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
  
  let updates = Object.keys(req.body);

  console.log(req.body);

  if (req.file && req.file.path && !updates.includes("profileImage")) {
    updates.push("profileImage");
  }

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
    try {
      const company = await Company.findById(user.companyID);
      if (company) {
        const profileImagePath = await moveFileToFinalLocation(
          req.file.path,
          user.adminID,
          req.user.name,
          'users',
          req.file.filename,
          company._id,
          company.name,
          req.body.name || user.name,  // Use updated name if provided
          user._id
        );
        req.body.profileImage = profileImagePath;
      }
    } catch (error) {
      console.error('Error moving user profile image:', error);
      cleanupTempFile(req.file.path);
    }
  }

  // Update fields
  updates.forEach((update) => {
    if (req.body[update] !== undefined) {
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
