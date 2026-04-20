const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/register-test', authController.createDefaultAdmin); // Temporary for initial setup

module.exports = router;
