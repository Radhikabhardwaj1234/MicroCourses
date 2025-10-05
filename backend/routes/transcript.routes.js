const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');
const { generateTranscript } = require('../controllers/transcript.controller');

// @route   POST /api/courses/:courseId/lessons/:lessonId/transcript
// @desc    Generate transcript for a lesson (placeholder)
// @access  Creator (owner) or Admin
router.post('/', auth, role(['creator', 'admin']), generateTranscript);

module.exports = router;
