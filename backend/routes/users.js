const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole, toggleUserStatus } = require('../controllers/users');
const { protect } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

router.get('/', protect, checkRole('super_admin'), getUsers);
router.put('/:id/role', protect, checkRole('super_admin'), updateUserRole);
router.put('/:id/status', protect, checkRole('super_admin'), toggleUserStatus);

module.exports = router;
