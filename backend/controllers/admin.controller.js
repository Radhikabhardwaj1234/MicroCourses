const Course = require('../models/Course');

// GET all pending courses
exports.getPendingCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: 'pending' }).populate('creatorId', 'name email');
    const formattedCourses = courses.map(c => ({
      _id: c._id,
      title: c.title,
      description: c.description,
      creatorName: c.creatorId.name,
      status: c.status
    }));
    res.status(200).json({ courses: formattedCourses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST approve/reject a course

exports.updateCourseStatus = async (req, res) => {
  try {
    const { courseId, action } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }

    course.status = action === 'approve' ? 'approved' : 'rejected';
    course.isPublished = action === 'approve'; // only publish if approved
    await course.save();

    res.status(200).json({ message: `Course ${action}d successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
