const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

exports.enrollCourse = async (req, res) => {
  try {
    const learnerId = req.user._id;
    const { courseId } = req.params;

    // Check if course exists and is published
    const course = await Course.findById(courseId);
    if (!course || !course.isPublished) {
      return res.status(404).json({ message: 'Course not found or not published' });
    }

    // Check if learner already enrolled
    const existingEnrollment = await Enrollment.findOne({ courseId, learnerId });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({
      courseId,
      learnerId,
      progress: 0 // initial progress
    });

    res.status(201).json({ message: 'Enrollment successful', enrollment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const Lesson = require('../models/Lesson');

exports.completeLesson = async (req, res) => {
  try {
    const learnerId = req.user._id;
    const { courseId, lessonId } = req.params;

    const enrollment = await Enrollment.findOne({ courseId, learnerId });
    if (!enrollment) {
      return res.status(400).json({ message: 'You are not enrolled in this course' });
    }

    // Check if lesson exists
    const lesson = await Lesson.findOne({ _id: lessonId, courseId });
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    // Add lessonId to completedLessons if not already there
    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    // Update progress (%)
    const totalLessons = await Lesson.countDocuments({ courseId });
    enrollment.progress = Math.floor((enrollment.completedLessons.length / totalLessons) * 100);

    await enrollment.save();

    res.status(200).json({ message: 'Lesson marked as completed', progress: enrollment.progress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.getEnrollments = async (req, res) => {
  try {
    const learnerId = req.user._id;

    const enrollments = await Enrollment.find({ learnerId })
      .populate({
        path: 'courseId',
        select: 'title description category coverImageUrl isPublished',
        populate: { path: 'creatorId', select: 'name email' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ enrollments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
