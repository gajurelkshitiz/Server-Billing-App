const Admin = require("../models/admin");
const excelJS = require("exceljs");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError, notFoundError } = require("../errors");
const path = require("path");
const fs = require("fs");
const { sendVerificationEmail } = require("../middleware/email");
const crypto = require('crypto');
const { sendCustomTemplateWhatsappMessage } = require("../middleware/whatsapp");
const { moveFileToFinalLocation, cleanupTempFile } = require("../utils/filePathHelper");

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

  const subsID = subscriptionDict[subsName];
  if (!subsID) {
    throw new BadRequestError("Invalid subscription name provided");
  }

  const emailVerificationToken = crypto.randomBytes(64).toString('hex');
  const emailVerificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

  // Create admin first
  const admin = await Admin.create({ 
    name,
    email,
    phoneNo,
    subsName,
    subsID,
    emailVerificationToken,
    emailVerificationTokenExpiresAt,
    isVerified: false,
    superadminID: req.user.tokenID
  });

  // Handle profile image upload after admin creation
  if (req.file) {
    try {
      const profileImagePath = await moveFileToFinalLocation(
        req.file.path,
        admin._id,
        admin.name,
        'admin_profile',
        req.file.filename,
        null,
        null,
        admin.name,    // ← Pass admin name as entity name
        admin._id      // ← Pass admin ID as entity ID
      );
      
      admin.profileImage = profileImagePath;
      await admin.save();
    } catch (error) {
      console.error('Error moving profile image:', error);
      cleanupTempFile(req.file.path);
    }
  }

  try {
    const emailResult = await sendVerificationEmail(admin.email, admin.name, emailVerificationToken, "admin");
    const whatsappResult = await sendCustomTemplateWhatsappMessage(admin.phoneNo, admin.name);

    const emailSuccess = emailResult && emailResult.status === "success";
    const whatsappSuccess = whatsappResult && whatsappResult.status === "success";

    res.status(200).json({
      status: emailSuccess && whatsappSuccess ? "success" : "partial_error",
      message: emailSuccess && whatsappSuccess
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


//Export the admins data via Excel export
const exportAdmins = async (req, res) => {
  console.log("Inside the export admins");


  const workbook = new excelJS.Workbook();  // Create a new workbook  
  const worksheet = workbook.addWorksheet("My Admins"); // New Worksheet  
  const path = "./files";  // Path to download excel  
  
  // Column for data in excel. key must match data key
  worksheet.columns = [    
    { header: "S.N.", key: "s_no", width: 10 },
    { header: "ID", key: "_id", width: 10 },
    { header: "Full Name", key: "name", width: 20 },
    { header: "Profile Picture", key: "profileImage", width: 10 },
    { header: "Email", key: "email", width: 20 },
    { header: "Password", key: "password", width: 10 },
    { header: "Phone Number", key: "phoneNo", width: 20 },
    { header: "Subscription ID", key: "subsID", width: 10 },
    { header: "Subscription Name", key: "subsName", width: 10 },
    // { header: "SuperAdmin ID", key: "superadminID", width: 10 },
    { header: "Role", key: "role", width: 10 },
    { header: "Last Login", key: "lastLogin", width: 10 },
    { header: "Is Verified", key: "isVerified", width: 10 },
    // { header: "SuperAdmin ID", key: "superadminID", width: 10 },
    { header: "Email Verification Token", key: "emailVerificationToken", width: 10 },
    { header: "Email Verification Token Expires At", key: "emailVerificationTokenExpiresAt", width: 10 },
    { header: "Country", key: "country", width: 10 },
    // { header: "Status", key: "status", width: 10 },
    // { header: "City", key: "city", width: 10 },
    // { header: "Province", key: "province", width: 10 },
    // { header: "Address", key: "address", width: 10 },
  ];
  
  
  // Looping through User data
  let counter = 1;

  // fetch admin
  const adminData = await Admin.find({}).sort("createdAt");
  
  adminData.forEach((admin) => {  
        admin.s_no = counter;  
        worksheet.addRow(admin); // Add data in worksheet  
        counter++;
      });
      
  // Making first line in excel bold
  worksheet.getRow(1).eachCell((cell) => {  
      cell.font = { bold: true };
  });
      
   try {
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename=users.xlsx`);

    return workbook.xlsx.write(res)
      .then(() => {
        res.status(200);
    });
  } catch (err) {
    res.send({
      status: "error",
      message: "Something went wrong",
    });
  }

}





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

  // Handle profile image upload
  if (req.file && req.file.path) {
    // Temporarily set tokenID for file path generation
    req.user = { tokenID: adminID };
    req.body.profileImage = getFilePathFromRequest(req, 'admin_profile');
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
  const disallowedFields = [
    "_id", "subsID", "isVerified", "createdAt", "updatedAt"
  ];

  let updates = Object.keys(req.body);

  if (req.file && req.file.path && !updates.includes("profileImage")) {
    updates.push("profileImage");
  }

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
    req.body.profileImage = getFilePathFromRequest(req, 'admin_profile');
  }

  // Update fields
  updates.forEach((update) => {
    if (req.body[update] !== undefined) {
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
  exportAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  getOwnProfile,
  updateOwnProfile,
};
