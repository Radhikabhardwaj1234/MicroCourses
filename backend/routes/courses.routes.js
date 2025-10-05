// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');
const { createCourse,getCourses , getCourseById , updateCourse, deleteCourse } = require('../controllers/course.controller');


router.post('/', auth, role(['creator']), createCourse);
router.get('/', auth, getCourses);
router.get('/:courseId', auth, getCourseById);
router.patch('/:courseId', auth, role(['creator']), updateCourse);
router.delete('/:courseId', auth, role(['creator']), deleteCourse);


module.exports = router;
