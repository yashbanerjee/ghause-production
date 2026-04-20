const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');

const { upload } = require('../lib/upload');

router.get('/', optionalAuth, productController.getProducts);
router.get('/:id', optionalAuth, productController.getProductById);
router.post('/', auth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'catalogs', maxCount: 10 }]), productController.createProduct);
router.put('/:id', auth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'catalogs', maxCount: 10 }]), productController.updateProduct);
router.patch('/:id/status', auth, productController.updateProductStatus);
router.delete('/:id', auth, productController.deleteProduct);
router.delete('/catalogs/delete', auth, productController.deleteCatalogFile);

// New dedicated catalog upload endpoint
router.post('/:id/catalogs', auth, upload.array('files', 10), productController.uploadCatalogs);

module.exports = router;
