const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');
const auth = require('../middleware/auth');

router.get('/', auth, enquiryController.getEnquiries);
router.patch('/:id', auth, enquiryController.updateEnquiryStatus);
router.delete('/:id', auth, enquiryController.deleteEnquiry);

module.exports = router;
