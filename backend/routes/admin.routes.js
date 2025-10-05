const express = require('express');
const router = express.Router();
const { getPendingCourses, updateCourseStatus } = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Middleware to protect and authorize admin users
const protect = authMiddleware;
const authorize = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ message: 'Forbidden: Not authorized' });
  }
  next();
};

// Apply middleware to all admin routes
router.use(protect);
router.use(authorize('admin'));

// GET all pending courses
router.get('/courses/pending', getPendingCourses);

// POST approve/reject course
router.post('/courses/:courseId/:action', updateCourseStatus);

module.exports = router;
