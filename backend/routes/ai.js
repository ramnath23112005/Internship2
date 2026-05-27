const express = require('express');
const router = express.Router();
const { getAITips, generateDescription } = require('../controllers/ai');
const { protect } = require('../middleware/auth');

router.get('/tips/:campaignId', protect, getAITips);
router.post('/generate-description', protect, generateDescription);

module.exports = router;
