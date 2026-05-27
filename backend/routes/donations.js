const express = require('express');
const router = express.Router();
const { createDonation, getDonations, getDonationStats } = require('../controllers/donations');
const { protect } = require('../middleware/auth');

router.post('/', protect, createDonation);
router.get('/', protect, getDonations);
router.get('/stats', protect, getDonationStats);

module.exports = router;
