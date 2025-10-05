const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

exports.createLesson = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { title, content, videoUrl, order } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Only the creator who owns the course can add lessons
    if (!course.creatorId.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if order is unique for this course
    const existingLesson = await Lesson.findOne({ courseId, order });
    if (existingLesson) {
      return res.status(400).json({ message: 'Lesson order must be unique per course' });
    }

    const lesson = await Lesson.create({
      courseId,
      title,
      content,
      videoUrl,
      order
    });

    res.status(201).json({ message: 'Lesson created successfully', lesson });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


//get all lessons for course

exports.getLessonsByCourse = async (req, res) => {
  try {
    const { courseId } = req.query;
    console.log(courseId)
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Learners can only see lessons of published courses
    if (req.user.role === 'learner' && !course.isPublished) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const lessons = await Lesson.find({ courseId }).sort({ order: 1 }); // sort by order ascending

    res.status(200).json({ lessons });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//get single lesson

exports.getLessonById = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Learners can only see lessons of published courses
    if (req.user.role === 'learner' && !course.isPublished) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const lesson = await Lesson.findOne({ _id: lessonId, courseId });
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    res.status(200).json({ lesson });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//update lesson api

exports.updateLesson = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const { title, content, videoUrl, order } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Only the creator who owns the course can update lessons
    if (!course.creatorId.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const lesson = await Lesson.findOne({ _id: lessonId, courseId });
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    // If updating order, check uniqueness
    if (order && order !== lesson.order) {
      const existingLesson = await Lesson.findOne({ courseId, order });
      if (existingLesson) {
        return res.status(400).json({ message: 'Lesson order must be unique per course' });
      }
      lesson.order = order;
    }

    if (title) lesson.title = title;
    if (content) lesson.content = content;
    if (videoUrl) lesson.videoUrl = videoUrl;

    await lesson.save();

    res.status(200).json({ message: 'Lesson updated successfully', lesson });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// delete lesson api

exports.deleteLesson = async (req, res) => {
  try {
    // const { courseId } = req.body;
    const { lessonId } = req.params;
    // console.log(courseId);
    // console.log(lessonId);
    // const course = await Course.findById(courseId);
    // if (!course) return res.status(404).json({ message: 'Course not found' });

    // Only the creator who owns the course can delete lessons
    // if (!course.creatorId.equals(req.user._id)) {
    //   return res.status(403).json({ message: 'Access denied' });
    // }

    const lesson = await Lesson.findOne({ _id: lessonId });
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    await lesson.deleteOne();

    res.status(200).json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
