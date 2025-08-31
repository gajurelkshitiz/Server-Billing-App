// filepath: \\wsl.localhost\Ubuntu-22.04\home\kshitizgajurel\Billing System Merged\Backend\utils\filePathHelper.js
const path = require('path');
const fs = require('fs');
const Company = require("../models/company");

const generateFilePath = async (adminID, adminUsername, category, filename, currentCompanyID) => {
    // Remove the baseUrl from here - store only relative path
    const adminUsernameAfterFormat = adminUsername.replace(/[^a-zA-Z0-9]/g, '_');
    
    if (currentCompanyID) {
        // Fetch company name dynamically
        let companyName = ''; // fallback
        try {
            const company = await Company.findById(currentCompanyID);
            if (company && company.name) {
                // Clean company name for folder naming (remove special characters)
                companyName = company.name.replace(/[^a-zA-Z0-9]/g, '_');
            }
        } catch (error) {
            console.error('Error fetching company name:', error);
        }
        
        return `/uploads/${adminUsernameAfterFormat}_${adminID}/${companyName}_${currentCompanyID}/${category}/${filename}`;
    } else {
        return `/uploads/${adminUsernameAfterFormat}_${adminID}/${category}/${filename}`;
    }
};

const getFilePathFromRequest = async (req, category) => {
    const { tokenID, adminID, companyID, name } = req.user;
    console.log('inside getFilePathFromRequest, req.user: ', req.user);
    const currentAdminID = adminID || tokenID;
    const currentCompanyID = req.query.companyID || companyID;
    const adminUsername = name;

    console.log('inside getFilePathFromRequest currentCompanyID is: ', currentCompanyID);
    
    if (req.file && req.file.filename) {
        return await generateFilePath(currentAdminID, adminUsername, category, req.file.filename, currentCompanyID);
    }
    
    return null;
};

const moveFileToFinalLocation = async (
  tempFilePath,
  adminID,
  adminName,
  category,
  originalFilename,
  companyID = null,
  companyName = null,
  entityName = null,
  entityID = null,
  filename = null,
  subfolders = [], // <-- keep support for subfolders
) => {
  // for Debug of values here...
  console.log(`passed values are:- category: ${category} entityName: ${entityName} entityID: ${entityID} fileName: ${filename}`)
  // End of debug code here.

  const cleanAdminName = adminName.replace(/[^a-zA-Z0-9]/g, '_');

  // Clean all subfolder values
  const cleanSubfolders = subfolders.map(val =>
    typeof val === 'string' ? val.replace(/[^a-zA-Z0-9]/g, '_') : val
  );

  let finalDir;

  if (companyID && companyName) {
    const cleanCompanyName = companyName.replace(/[^a-zA-Z0-9]/g, '_');
    if (cleanSubfolders && cleanSubfolders.length > 0) {
      finalDir = path.join(
        __dirname,
        `../uploads/${cleanAdminName}_${adminID}/${cleanCompanyName}_${companyID}`,
        ...cleanSubfolders,
        category
      );
    } else {
      finalDir = path.join(
        __dirname,
        `../uploads/${cleanAdminName}_${adminID}/${cleanCompanyName}_${companyID}/${category}`
      );
    }
  } else {
    finalDir = path.join(
      __dirname,
      `../uploads/${cleanAdminName}_${adminID}/${category}`
    );
  }

  if (!fs.existsSync(finalDir)) {
    fs.mkdirSync(finalDir, { recursive: true });
  }

  // --- Custom filename logic ---
  let finalFilename = originalFilename;
  if (entityName && entityID) {
    const ext = path.extname(originalFilename);
    const cleanEntityName = entityName.replace(/[^a-zA-Z0-9]/g, '_');
    if (category === 'users' || category === 'admin_profile') {
      finalFilename = `${cleanEntityName}_${entityID}${ext}`;
    } else if (category === 'company_assets') {
      finalFilename = `${cleanEntityName}_logo_${entityID}${ext}`;
    } else if (category === 'sales' || category === 'purchase') {
      const timestamp = Date.now();
      finalFilename = `${category}_${cleanEntityName}_${timestamp}${ext}`;
    } else if (category === "customerFinancialDocument" || category === "attachments") {
      console.log('Category was: ', category);
      finalFilename = filename;
    } else {
      finalFilename = `${cleanEntityName}_${entityID}_${Date.now()}${ext}`;
    }
  }
  // --- End custom filename logic ---

  const finalPath = path.join(finalDir, finalFilename);
  fs.renameSync(tempFilePath, finalPath);

  // Build relative path for DB
  let relativePath;
  if (companyID && companyName) {
    const cleanCompanyName = companyName.replace(/[^a-zA-Z0-9]/g, '_');
    if (cleanSubfolders && cleanSubfolders.length > 0) {
      relativePath = path.join(
        `/uploads/${cleanAdminName}_${adminID}/${cleanCompanyName}_${companyID}`,
        ...cleanSubfolders,
        category,
        finalFilename
      );
    } else {
      relativePath = `/uploads/${cleanAdminName}_${adminID}/${cleanCompanyName}_${companyID}/${category}/${finalFilename}`;
    }
  } else {
    relativePath = `/uploads/${cleanAdminName}_${adminID}/${category}/${finalFilename}`;
  }

  return relativePath.replace(/\\/g, '/'); // For Windows compatibility
};

const cleanupTempFile = (tempFilePath) => {
  try {
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  } catch (error) {
    console.error('Error cleaning up temp file:', error);
  }
};

module.exports = {
    generateFilePath,
    getFilePathFromRequest,
    moveFileToFinalLocation,
    cleanupTempFile
};