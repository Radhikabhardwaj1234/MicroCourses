const Lesson = require('../models/Lesson');

// Placeholder: In future, connect to real transcription service
exports.generateTranscript = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;

    const lesson = await Lesson.findOne({ _id: lessonId, courseId });
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    // Only creator of course can generate transcript
    if (!lesson.courseId.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Placeholder transcript
    lesson.transcript = `Transcript for lesson "${lesson.title}" will be generated here.`;
    await lesson.save();

    res.status(200).json({ message: 'Transcript generated', transcript: lesson.transcript });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
