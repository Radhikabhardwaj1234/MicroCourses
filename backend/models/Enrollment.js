const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  learnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  completedLessons: {
    type: [mongoose.Schema.Types.ObjectId], // array of lesson IDs completed
    ref: 'Lesson',
    default: []
  },
  progress: {
    type: Number, // percentage
    default: 0
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Unique index to ensure one enrollment per learner per course
enrollmentSchema.index({ learnerId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
