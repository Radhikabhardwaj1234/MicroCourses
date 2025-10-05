// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');
const { createLesson, deleteLesson ,getLessonsByCourse ,getLessonById,updateLesson} = require('../controllers/lesson.controller');


router.post('/', auth, role(['creator']), createLesson);
router.get('/', auth, getLessonsByCourse);
router.get('/:lessonId', auth, getLessonById);
router.patch('/:lessonId', auth, role(['creator']), updateLesson);
router.delete('/:lessonId', auth, role(['creator']), deleteLesson);

module.exports = router;
