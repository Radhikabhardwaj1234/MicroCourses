const crypto = require('crypto');
const Certificate = require('../models/Certificate');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

exports.issueCertificate = async (req, res) => {
  try {
    const learnerId = req.user._id;
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({ learnerId, courseId });
    if (!enrollment) {
      return res.status(400).json({ message: 'You are not enrolled in this course' });
    }

    if (enrollment.progress < 100) {
      return res.status(400).json({ message: 'Course not yet completed' });
    }

    // Check if certificate already exists
    let certificate = await Certificate.findOne({ learnerId, courseId });
    if (certificate) {
      return res.status(200).json({ message: 'Certificate already issued', certificate });
    }

    // Generate unique serial hash
    const secret = process.env.CERT_SECRET || 'SECRET_KEY';
    const hash = crypto
      .createHash('sha256')
      .update(`${learnerId}|${courseId}|${Date.now()}|${secret}`)
      .digest('hex');

    certificate = await Certificate.create({
      learnerId,
      courseId,
      serialHash: hash,
      issuedAt: new Date()
    });

    res.status(201).json({ message: 'Certificate issued successfully', certificate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.getCertificate = async (req, res) => {
  try {
    const learnerId = req.user._id;
    const { courseId } = req.params;

    const certificate = await Certificate.findOne({ learnerId, courseId })
      .populate({
        path: 'courseId',
        select: 'title description',
        populate: { path: 'creatorId', select: 'name email' }
      });

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found. Complete the course to get certificate.' });
    }

    res.status(200).json({ certificate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
