const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');

const { upload } = require('../lib/upload');

router.get('/', optionalAuth, categoryController.getCategories);
router.get('/:id', optionalAuth, categoryController.getCategoryById);
router.post('/', auth, upload.fields([{ name: 'icon' }, { name: 'image' }]), categoryController.createCategory);
router.put('/:id', auth, upload.fields([{ name: 'icon' }, { name: 'image' }]), categoryController.updateCategory);
router.patch('/:id/status', auth, categoryController.updateCategoryStatus);
router.delete('/:id', auth, categoryController.deleteCategory);

module.exports = router;
