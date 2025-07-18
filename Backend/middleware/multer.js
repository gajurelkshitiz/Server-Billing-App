const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Simplified directory creation - no temp folders needed
const createDirectoryStructure = (adminID, adminName, companyID = null, companyName = null) => {
  const baseDir = path.join(__dirname, "../uploads");
  const cleanAdminName = adminName.replace(/[^a-zA-Z0-9]/g, '_');
  const adminDir = path.join(baseDir, `${cleanAdminName}_${adminID}`);

  // Create admin directory
  if (!fs.existsSync(adminDir)) {
    fs.mkdirSync(adminDir, { recursive: true });
  }

  if (companyID && companyName) {
    const cleanCompanyName = companyName.replace(/[^a-zA-Z0-9]/g, '_');
    const companyDir = path.join(adminDir, `${cleanCompanyName}_${companyID}`);
    
    if (!fs.existsSync(companyDir)) {
      fs.mkdirSync(companyDir, { recursive: true });
    }

    // Create company subdirectories
    const subdirs = ["sales", "purchase", "users", "imported_files", "company_assets"];
    subdirs.forEach((subdir) => {
      const subdirPath = path.join(companyDir, subdir);
      if (!fs.existsSync(subdirPath)) {
        fs.mkdirSync(subdirPath, { recursive: true });
      }
    });

    return companyDir;
  }

  return adminDir;
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // For creation routes, store in a temporary upload folder
    if (req.method === 'POST' && !req.params.id) {
      const tempDir = path.join(__dirname, "../uploads/temp");
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      cb(null, tempDir);
      return;
    }

    // For updates, we have the entity info available
    const { tokenID, adminID, companyID, name } = req.user;
    const currentAdminID = adminID || tokenID;
    
    let targetDir;
    let subfolder = "";

    try {
      if (file.fieldname === "profileImage") {
        if (req.originalUrl?.includes("user")) {
          // We'll handle this in the controller after we have company info
          targetDir = path.join(__dirname, "../uploads/temp");
          subfolder = "users";
        } else {
          targetDir = createDirectoryStructure(currentAdminID, name);
          subfolder = "admin_profile";
        }
      } else if (file.fieldname === "logo") {
        targetDir = path.join(__dirname, "../uploads/temp");
        subfolder = "company_assets";
      } else if (file.fieldname === "billAttachment") {
        targetDir = path.join(__dirname, "../uploads/temp");
        if (req.originalUrl?.includes("salesEntry")) {
          subfolder = "sales-bills";
        } else {
          subfolder = "purchase-bills";
        }
      } else {
        targetDir = path.join(__dirname, "../uploads/temp");
        subfolder = "misc";
      }

      const finalPath = path.join(targetDir, subfolder);
      if (!fs.existsSync(finalPath)) {
        fs.mkdirSync(finalPath, { recursive: true });
      }
      
      cb(null, finalPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const nameWithoutExt = path.parse(file.originalname).name;
    const ext = path.extname(file.originalname);
    const filename = `${nameWithoutExt}-${uniqueSuffix}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg", "image/png", "image/gif", "image/webp",
      "application/pdf", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
});

module.exports = upload;
