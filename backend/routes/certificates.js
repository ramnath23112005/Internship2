const express = require('express');
const router = express.Router();
const { generateCertificate, getCertificates, verifyCertificate } = require('../controllers/certificates');
const { protect } = require('../middleware/auth');

router.post('/', protect, generateCertificate);
router.get('/', protect, getCertificates);
router.get('/verify/:id', verifyCertificate);

module.exports = router;
