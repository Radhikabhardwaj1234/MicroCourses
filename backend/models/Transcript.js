const mongoose = require('mongoose');

const transcriptSchema = new mongoose.Schema({
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  generatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Unique index to ensure one transcript per lesson
transcriptSchema.index({ lessonId: 1 }, { unique: true });

module.exports = mongoose.model('Transcript', transcriptSchema);
