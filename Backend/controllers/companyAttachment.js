const CompanyAttachment = require('../models/companyAttachment');
const path = require('path');
const { cleanupTempFile, moveFileToFinalLocation } = require('../utils/filePathHelper');
const Company = require('../models/company');
const { BadRequestError } = require('../errors');


const createAttachment = async (req, res) => {
    console.log('Before Starting the Attachment Creation Section.')
    console.log('Checking request body: ', req.body);
    const { category, fileName, message, companyID, dateOfFile } = req.body;

    if (!category || !fileName || !dateOfFile || !companyID) {
      throw new BadRequestError("Please provide all values");
    }
    if (!req.file) return res.status(400).json({ error: 'File is required' });

    const attachment = await CompanyAttachment.create({
        companyID,
        fileName,
        // filePath: req.file.path,
        category,
        message,
        dateOfFile
        // uploadedBy: req.user ? req.user._id : null
    });

    const company = await Company.findById(companyID);
    if (!company) {
    throw new BadRequestError("Company not found");
    }

    let filename;
    const ext = path.extname(req.file.originalname);
    filename = req.body.fileName;
    console.log('For checking what the user types the name: ', filename);
    // formatting filename before appending it with the ext:
    filename = filename.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    if (!filename.endsWith(ext)){
        filename += ext;
    }
    console.log('Full ready filename is: ', filename);

    console.log('Just created attachment is: ', attachment);

    if (req.file) {
      try {
        const filePath = await moveFileToFinalLocation(
            req.file.path,
            req.user.adminID || req.user.tokenID,
            req.user.name,
            'attachments',
            req.file.originalname,
            company._id,
            company.name,
            // just to validate the logic in Remaining, i am passing entityID and entityName here...
            attachment.fileName,
            attachment._id,
            // here i want to give a custom name, not with [entity_id, entity_name]..
            filename,
        )
        attachment.filePath = filePath;
        await attachment.save();
        
      } catch (err) {
          console.log("Error moving Company Attachments to appropriate location.")
          // res.status(500).json({ error: err.message });
          cleanupTempFile(req.file.path);
      }

    }
    res.status(201).json({ attachment });
};

const getAllAttachments = async (req, res) => {
  try {
    const { companyID } = req.query;
    console.log('companyID value: ', companyID);
    const attachments = await CompanyAttachment.find({ companyID }).sort("createdAt");
    console.log('for checking is output comes or not: ', attachments);
    res.json({ attachments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// this is not done, yo paxi garaula..
// Serve file download/view
const getAttachmentFile = async (req, res) => {
  try {
    const { id } = req.params;
    const attachment = await CompanyAttachment.findById(id);
    if (!attachment) return res.status(404).json({ error: 'Not found' });
    res.sendFile(path.resolve(attachment.filePath));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
    createAttachment,
    getAllAttachments,
    getAttachmentFile
}