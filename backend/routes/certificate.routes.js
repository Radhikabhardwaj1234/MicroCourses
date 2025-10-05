const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');
const { issueCertificate ,getCertificate} = require('../controllers/certificate.controller');

router.post('/:courseId', auth, role(['learner']), issueCertificate);
router.get('/:courseId', auth, role(['learner']), getCertificate);

module.exports = router;
