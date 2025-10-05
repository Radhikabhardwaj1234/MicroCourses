const Course = require('../models/Course');
const User = require('../models/User');

exports.createCourse = async (req, res) => {
  try {
    const creatorId = req.user._id;

    // Check if user is approved creator
    if (req.user.role !== 'creator' || !req.user.isCreatorApproved) {
      return res.status(403).json({ message: 'Only approved creators can create courses' });
    }

    const { title, description, category, coverImageUrl } = req.body;

    const course = await Course.create({
      creatorId,
      title,
      description,
      category,
      coverImageUrl
    });

    res.status(201).json({
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



// get all courses api 

exports.getCourses = async (req, res) => {
  try {
    let courses;

    if (req.user.role === 'learner') {
      // Learners see only published courses
      courses = await Course.find({ isPublished: true })
        .populate('creatorId', 'name email')
        .sort({ createdAt: -1 });
    } else if (req.user.role === 'creator') {
      // Creators see only their own courses
      courses = await Course.find({ creatorId: req.user._id })
        .populate('creatorId', 'name email')
        .sort({ createdAt: -1 });
    } else if (req.user.role === 'admin') {
      // Admin sees all courses
      courses = await Course.find()
        .populate('creatorId', 'name email')
        .sort({ createdAt: -1 });
    }

    res.status(200).json({ courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//get single course api

exports.getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId)
      .populate('creatorId', 'name email');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Learner can only access published courses
    if (req.user.role === 'learner' && !course.isPublished) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json({ course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


//update course

exports.updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, category, coverImageUrl, isPublished } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Only the creator who owns the course can update
    if (!course.creatorId.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update fields
    if (title) course.title = title;
    if (description) course.description = description;
    if (category) course.category = category;
    if (coverImageUrl) course.coverImageUrl = coverImageUrl;
    if (typeof isPublished === 'boolean') course.isPublished = isPublished;

    await course.save();

    res.status(200).json({ message: 'Course updated successfully', course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//delete course

exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Only the creator who owns the course can delete
    if (!course.creatorId.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await course.deleteOne();

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
