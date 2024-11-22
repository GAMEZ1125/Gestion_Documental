// routes/emailConfig.js
const express = require('express');
const router = express.Router();
const emailConfigController = require('../controllers/emailConfigController');
const authenticateToken = require('../middlewares/authMiddleware');

router.use(authenticateToken);

router.get('/email-config', emailConfigController.getConfig);
router.post('/email-config', emailConfigController.saveConfig);
router.post('/email-config/test', emailConfigController.testConfig);

module.exports = router;