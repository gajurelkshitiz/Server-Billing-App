const express = require('express');
const router = express.Router();
const { createAttachment, getAllAttachments, getAttachmentFile } = require('../controllers/companyAttachment');
const multer = require('../middleware/multer'); // adjust if needed
// const { authenticateUser } = require('../middleware/authentication'); // adjust if needed

router.post('/', multer.single('companyAttachment'), createAttachment);
router.get('/',  getAllAttachments);
router.get('/file/:id',  getAttachmentFile);

module.exports = router;
