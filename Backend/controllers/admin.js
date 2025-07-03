const Admin = require("../models/admin");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  notFoundError,
} = require("../errors");
const path = require("path");
const fs = require("fs");
const { sendVerificationEmail, sendWelcomeEmail } = require("../middleware/email");
const crypto = require('crypto');
const { sendTemplateWhatsappMessage, sendCustomTemplateWhatsappMessage } = require("../middleware/whatsapp");
const uploadOnCloudinary = require("../utils/cloudinary");

const createAdmin = async (req, res) => {
  console.log(req.body);
  const { name, email, phoneNo, subsName } = req.body;
  if (!name || !email || !phoneNo || !subsName) {
    throw new BadRequestError("Please provide all values");
  }

  // Load the subscription dictionary
  const dictPath = path.join(__dirname, "../constants/subscriptionDict.json");
  let subscriptionDict = {};
  if (fs.existsSync(dictPath)) {
    subscriptionDict = JSON.parse(fs.readFileSync(dictPath, "utf-8"));
  }

  // Map subsName to subsID
  const subsID = subscriptionDict[subsName];
  if (!subsID) {
    throw new BadRequestError("Invalid subscription name provided");
  }

  // Optional profile image upload
  let profileImageUrl = undefined;
  if (req.file && req.file.path) {
    const uploaded = await uploadOnCloudinary(
      req.file.path,
      `${Date.now()}-${req.file.originalname}`,
      "BILL APP/ADMIN PROFILES"
    );
    if (uploaded && uploaded.url) {
      req.body.profileImage = uploaded.url;
    }
  }

  // Generate verification token
  const emailVerificationToken = crypto.randomBytes(64).toString('hex');
  const emailVerificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;  
  // yeslai paxi env variable banayera halnu chha.

  

  const admin = await Admin.create({ 
    ...req.body, 
    subsID,
    emailVerificationToken,
    emailVerificationTokenExpiresAt,
    isVerified: false 
  });

  console.log('to check how phone no would look like')
  console.log(admin.phoneNo)


  try {
    const emailResult = await sendVerificationEmail(admin.email, admin.name, emailVerificationToken, "admin");
    const whatsappResult = await sendCustomTemplateWhatsappMessage(admin.phoneNo, admin.name);

    const emailSuccess = emailResult && emailResult.status === "success";
    const whatsappSuccess = whatsappResult && whatsappResult.status === "success";
    const allSuccess = emailSuccess && whatsappSuccess;

    res.status(200).json({
      status: allSuccess ? "success" : "partial_error",
      message: allSuccess
        ? "Admin created, email and WhatsApp sent."
        : `Admin created. Email: ${emailSuccess ? "success" : "error"}, WhatsApp: ${whatsappSuccess ? "success" : "error"}`,
      emailResult,
      whatsappResult,
      admin,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred while creating admin or sending notifications.",
      error: error.message || error,
    });
  }
  
};


const getAllAdmins = async (req, res) => {
  const admins = await Admin.find({}).sort("createdAt");
  if (!admins) {
    throw new notFoundError("No Admins Found");
  }
  res.status(StatusCodes.OK).json({ admins, count: admins.length });
};



// yo specially get profile details ma use bhako chha
const getAdmin = async (req, res) => {
  const {
    params: { id: adminID },
  } = req;

  const admin = await Admin.findOne({
    _id: adminID,
  });

  if (!admin) {
    throw new notFoundError(`No Admin Found`);
  }

  res.status(StatusCodes.OK).json({ admin });
};


// yo specially get profile details ma use bhako chha
const updateAdmin = async (req, res) => {
  const {
    params: { id: adminID },
    body: { name, email, phoneNo },
  } = req;

  if (name === "" || email === "" || phoneNo === "") {
    throw new BadRequestError("All fields cannot be empty");
  }

  // Optional profile image upload
  let profileImageUrl = undefined;
  if (req.file && req.file.path) {
    const uploaded = await uploadOnCloudinary(
      req.file.path,
      `${Date.now()}-${req.file.originalname}`,
      "BILL APP/ADMIN PROFILES"
    );
    if (uploaded && uploaded.url) {
      req.body.profileImage = uploaded.url;
    }
  }


  const admin = await Admin.findOneAndUpdate({ _id: adminID }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!admin) {
    throw new notFoundError(`No Admin Found with id: ${adminID}`);
  }
  res.status(StatusCodes.OK).json({ admin });
};

const deleteAdmin = async (req, res) => {
  const {
    params: { id: adminID },
  } = req;
  const admin = await Admin.findOneAndDelete({
    _id: adminID,
  });

  if (!admin) {
    throw new notFoundError(`No Admin Found with id: ${adminID}`);
  }
  res.status(StatusCodes.OK).send();
};

// Functionalities done by Admin(self):

const getOwnProfile = async (req, res) => {
  const admin = await Admin.findById(req.user.tokenID);
  if (!admin) {
    throw new notFoundError(`No Admin Found.`);
  }
  res.status(StatusCodes.OK).json({ admin });
};



const updateOwnProfile = async (req, res) => {
  // Define fields that should NOT be changed
  const disallowedFields = [
    "_id", "subsID", "isVerified", "createdAt", "updatedAt"
  ];
  // "emailVerificationToken", "emailVerificationTokenExpiresAt", "__v"

  // Collect updates from body
  let updates = Object.keys(req.body);

  console.log(req.body);

  // If a file is uploaded, treat profileImage as an update
  if (req.file && req.file.path && !updates.includes("profileImage")) {
    updates.push("profileImage");
  }

  // Validate updates: none of the updates should be in disallowedFields
  const isValidOperation = updates.every((update) =>
    !disallowedFields.includes(update)
  );
  if (!isValidOperation) {
    throw new BadRequestError("Invalid Updates: Attempt to modify restricted fields");
  }

  const admin = await Admin.findById(req.user.tokenID);
  if (!admin) {
    throw new notFoundError(`No Admin Found`);
  }

  // Handle profile image upload
  if (req.file && req.file.path) {
    const uploaded = await uploadOnCloudinary(
      req.file.path,
      `${Date.now()}-${req.file.originalname}`,
      "BILL APP/ADMIN PROFILES"
    );
    if (uploaded && uploaded.url) {
      req.body.profileImage = uploaded.url;
    }
  }

  // Update fields
  updates.forEach((update) => {
    if (update === "profileImage" && req.body.profileImage) {
      admin.profileImage = req.body.profileImage;
    } else if (req.body[update] !== undefined) {
      admin[update] = req.body[update];
    }
  });

  await admin.save();
  res.status(StatusCodes.OK).json({ admin });
};



// this feature will be implemented later...
async function notifyAdmin(admin) {
  let emailResult, whatsappResult;

  try {
    emailResult = await sendWelcomeEmail(admin.email, admin.name);
  } catch (e) {
    emailResult = { status: "error", message: "Email failed", error: e.message || e };
  }

  try {
    whatsappResult = await sendTemplateMessage();
  } catch (e) {
    whatsappResult = { status: "error", message: "WhatsApp failed", error: e.message || e };
  }

  // Aggregate results
  const allSuccess = emailResult.status === "success" && whatsappResult.status === "success";

  return {
    status: allSuccess ? "success" : "partial_error",
    message: allSuccess
      ? "Email and WhatsApp sent successfully."
      : `Email: ${emailResult.status}, WhatsApp: ${whatsappResult.status}`,
    emailResult,
    whatsappResult,
    admin,
  };
}



module.exports = {
  createAdmin,
  getAllAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  getOwnProfile,
  updateOwnProfile,
};
