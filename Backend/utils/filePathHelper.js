// filepath: \\wsl.localhost\Ubuntu-22.04\home\kshitizgajurel\Billing System Merged\Backend\utils\filePathHelper.js
const path = require('path');
const fs = require('fs');
const Company = require("../models/company");

const generateFilePath = async (adminID, adminUsername, category, filename, currentCompanyID) => {
    const baseUrl = process.env.BACKEND_URL;
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
        
        return `${baseUrl}/uploads/${adminUsernameAfterFormat}_${adminID}/${companyName}_${currentCompanyID}/${category}/${filename}`;
    } else {
        return `${baseUrl}/uploads/${adminUsernameAfterFormat}_${adminID}/${category}/${filename}`;
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

const moveFileToFinalLocation = async (tempFilePath, adminID, adminName, category, originalFilename, companyID = null, companyName = null, entityName = null, entityID = null) => {
  const baseUrl = process.env.BACKEND_URL;
  const cleanAdminName = adminName.replace(/[^a-zA-Z0-9]/g, '_');
  
  let finalDir;
  if (companyID && companyName) {
    const cleanCompanyName = companyName.replace(/[^a-zA-Z0-9]/g, '_');
    finalDir = path.join(__dirname, `../uploads/${cleanAdminName}_${adminID}/${cleanCompanyName}_${companyID}/${category}`);
  } else {
    finalDir = path.join(__dirname, `../uploads/${cleanAdminName}_${adminID}/${category}`);
  }

  // Create directory if it doesn't exist
  if (!fs.existsSync(finalDir)) {
    fs.mkdirSync(finalDir, { recursive: true });
  }

  // Generate custom filename based on entity info
  let finalFilename = originalFilename;
  
  if (entityName && entityID) {
    const ext = path.extname(originalFilename);
    const cleanEntityName = entityName.replace(/[^a-zA-Z0-9]/g, '_');
    
    // Generate filename based on category/context
    if (category === 'users' || category === 'admin_profile') {
      finalFilename = `${cleanEntityName}_${entityID}${ext}`;
    } else if (category === 'company_assets') {
      finalFilename = `${cleanEntityName}_logo_${entityID}${ext}`;
    } else if (category === 'sales' || category === 'purchase') {
      const timestamp = Date.now();
      finalFilename = `${category}_${cleanEntityName}_${timestamp}${ext}`;
    } else {
      finalFilename = `${cleanEntityName}_${entityID}_${Date.now()}${ext}`;
    }
  }

  const finalPath = path.join(finalDir, finalFilename);
  
  // Move file from temp to final location
  fs.renameSync(tempFilePath, finalPath);
  
  // Generate URL
  if (companyID && companyName) {
    const cleanCompanyName = companyName.replace(/[^a-zA-Z0-9]/g, '_');
    return `${baseUrl}/uploads/${cleanAdminName}_${adminID}/${cleanCompanyName}_${companyID}/${category}/${finalFilename}`;
  } else {
    return `${baseUrl}/uploads/${cleanAdminName}_${adminID}/${category}/${finalFilename}`;
  }
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