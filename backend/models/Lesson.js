const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String
  },
  videoUrl: {
    type: String
  },
  order: {
    type: Number,
    required: true
  },
   transcript: { type: String },
}, { timestamps: true });

// Unique index to enforce unique lesson order per course
lessonSchema.index({ courseId: 1, order: 1 }, { unique: true });

module.exports = mongoose.model('Lesson', lessonSchema);
