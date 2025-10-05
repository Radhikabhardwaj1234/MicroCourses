const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
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
  issuedAt: {
    type: Date,
    default: Date.now
  },
  serialHash: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true });

// Unique index to ensure one certificate per learner per course
certificateSchema.index({ learnerId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Certificate', certificateSchema);
