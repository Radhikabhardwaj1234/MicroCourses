const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'General'
  },
  isPublished: {
    type: Boolean,
    default: null
  },
  lessonsCount: {
    type: Number,
    default: 0
  },
  coverImageUrl: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
