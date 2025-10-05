// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { createCourse,applyCreator,getPendingApplications ,reviewApplication} = require('../controllers/creator.controller');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');

router.post('/apply', auth, applyCreator);
router.get('/pending', auth, role(['admin']), getPendingApplications);
router.patch('/review/:applicationId', auth, role(['admin']), reviewApplication);
router.post('/courses',auth, createCourse);

module.exports = router;
