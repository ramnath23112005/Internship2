const express = require('express');
const router = express.Router();
const { getDashboardStats, getVolunteerStats } = require('../controllers/analytics');
const { protect } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

router.get('/dashboard', protect, checkRole('ngo_admin', 'super_admin'), getDashboardStats);
router.get('/volunteer', protect, getVolunteerStats);

module.exports = router;
