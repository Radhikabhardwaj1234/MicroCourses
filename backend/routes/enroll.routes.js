// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');
const { enrollCourse,completeLesson,getEnrollments } = require('../controllers/enroll.controller');

router.post('/:courseId', auth, role(['learner']), enrollCourse);
router.patch('/:courseId/lesson/:lessonId', auth, role(['learner']), completeLesson);
router.get('/', auth, role(['learner']), getEnrollments);

module.exports = router;
