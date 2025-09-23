// controllers/financialDocumentController.js
const { CustomerFinancialDocument } = require('../models/CustomerFinancialDocument');
const { SupplierFinancialDocument } = require('../models/SupplierFinancialDocument');
const Customer  = require('../models/Customer');
const Supplier = require('../models/Supplier');
const Company = require('../models/company');
const { moveFileToFinalLocation, cleanupTempFile } = require('../utils/filePathHelper');
const path = require('path');

const createSupplierDocument = async (req, res) => {
  try {
    // for debug:
    console.log('Document Creation request recieved.');
    // End-of-debug
    const { type, supplierID, companyID, ...fields } = req.body;

    console.log('Inside the create document controller req.body is: ',req.body)  

    if (!type) return res.status(400).json({ error: "Document type is required" });
    if (!supplierID) return res.status(400).json({ error: "SupplierId is required" });

    // write the code for customer so that i can get relavent output for file naming;
    const supplier = await Supplier.findOne({
        _id: supplierID, 
        companyID: companyID
    });
    console.log('Supplier info: ', supplier);


    

    // Create a new document (Mongoose knows which schema to use based on type)
    const document = await SupplierFinancialDocument.create({ 
        type, 
        supplierID, 
        companyID, 
        ...fields 
    });

    console.log('document: ', document);
    

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
        'suppliers',
        `${supplier.name}_${supplier._id}`
    ];
    if (req.file) {
        try {
        // code here to save the file in appropriate file location.
        console.log('code for file handling here.');
        const filePath = await moveFileToFinalLocation(
            req.file.path,
            req.user.adminID || req.user.tokenID,
            req.user.name,
            'supplierFinancialDocument',
            req.file.filename,
            company._id,
            company.name,
            supplier.name, // entityName (or whatever you want for filename)
            supplier._id,  // entityID
            filename,
            subfolders,     // <-- pass subfolders here
        );
        document.fileUrl = filePath;
        await document.save();
        } catch(error) {
            console.error('Error moving supplier Financial documents:', error);
            cleanupTempFile(req.file.path);
        }
    }

    res.status(201).json({ message: "Financial document created", document });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// nothing changed below this for now:::
const getDocumentsBySupplier = async (req, res) => {
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
    createSupplierDocument,
    getDocumentsBySupplier
}