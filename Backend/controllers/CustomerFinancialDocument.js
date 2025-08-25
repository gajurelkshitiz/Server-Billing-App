// controllers/financialDocumentController.js
const { CustomerFinancialDocument } = require('../models/CustomerFinancialDocument');
const Customer  = require('../models/Customer');
const Company = require('../models/company');
const { moveFileToFinalLocation, cleanupTempFile } = require('../utils/filePathHelper');
const path = require('path');

const createDocument = async (req, res) => {
  try {
    // for debug:
    console.log('Document Creation request recieved.');
    // End-of-debug
    const { type, customerID, companyID, ...fields } = req.body;

    console.log('Inside the create document controller req.body is: ',req.body)  

    if (!type) return res.status(400).json({ error: "Document type is required" });
    if (!customerID) return res.status(400).json({ error: "CustomerId is required" });

    // write the code for customer so that i can get relavent output for file naming;
    const customer = await Customer.findOne({
        _id: customerID, 
        companyID: companyID
    });
    console.log('Customer info: ', customer);

    

    // Create a new document (Mongoose knows which schema to use based on type)
    const document = await CustomerFinancialDocument.create({ 
        type, 
        customerID, 
        companyID, 
        ...fields 
    });
    

    const company = await Company.findById(companyID);
    if (!company) {
    throw new BadRequestError("Company not found");
    }

    // writing a custome logic for filename based on attachment:
    let filename;
    if (type === 'attachment') {
        // for debug:
        console.log("Checking original filename: ", req.file.originalname);
        const ext = path.extname(req.file.originalname);
        console.log("ext file name is: ", ext);
        filename = req.body.fileName;
        if (!filename.endsWith(ext)){
            filename += ext;
        }
    }
    else {
        const ext = path.extname(req.file.originalname);
        // Use chequeNo or guaranteeNo and issueDate as before
        const chequeNo = fields.chequeNo;
        const guranteeNo = fields.guranteeNo;
        const issueDate = fields.issueDate;
        filename = `${chequeNo||guranteeNo}_${issueDate}${ext}`;
    }


    const subfolders = [
        'customers',
        `${customer.name}_${customer._id}`
    ];
    if (req.file) {
        try {
        // code here to save the file in appropriate file location.
        console.log('code for file handling here.');
        const filePath = await moveFileToFinalLocation(
            req.file.path,
            req.user.adminID || req.user.tokenID,
            req.user.name,
            'customerFinancialDocument',
            req.file.filename,
            company._id,
            company.name,
            customer.name, // entityName (or whatever you want for filename)
            customer._id,  // entityID
            filename,
            subfolders,     // <-- pass subfolders here
        );
        document.fileUrl = filePath;
        await document.save();
        } catch(error) {
            console.error('Error moving customer Financial documents:', error);
            cleanupTempFile(req.file.path);
        }
    }

    res.status(201).json({ message: "Financial document created", document });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDocumentsByCustomer = async (req, res) => {
  try {
    const {customerID}  = req.params;
    console.log('req.query.params is: ', req.params);
    console.log('customerID is: ', customerID);
    const documents = await CustomerFinancialDocument.find({ customerID });

    res.json({ customerID, documents });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
    createDocument,
    getDocumentsByCustomer
}