const CreatorApplication = require('../models/CreatorApplication');
const User = require('../models/User');
const Course = require('../models/Course')
exports.applyCreator = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware
    const { bio, portfolioUrls } = req.body;

    // Check if user already applied
    const existingApplication = await CreatorApplication.findOne({ userId });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied' });
    }

    // Create application
    const application = await CreatorApplication.create({
      userId,
      bio,
      portfolioUrls
    });

    res.status(201).json({
      message: 'Creator application submitted successfully',
      application
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch Pending Creator Applications
exports.getPendingApplications = async (req, res) => {
  try {
    const pendingApps = await CreatorApplication.find({ status: 'pending' })
      .populate('userId', 'name email') // fetch user name and email
      .sort({ submittedAt: -1 }); // newest first

    res.status(200).json({ pendingApplications: pendingApps });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Admin – Approve/Reject Creator Application

exports.reviewApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { action } = req.body; // "approve" or "reject"
    const adminId = req.user._id;

    // Validate action
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }

    // Find the application
    const application = await CreatorApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Update application status
    application.status = action === 'approve' ? 'approved' : 'rejected';
    application.reviewedAt = new Date();
    application.reviewerId = adminId;
    await application.save();

    // If approved, update user
    if (action === 'approve') {
      await User.findByIdAndUpdate(application.userId, { isCreatorApproved: true });
    }

    res.status(200).json({ message: `Application ${action}d successfully`, application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    console.log(req.user.userId)
    const creatorId = req.user.id;

    const course = await Course.create({
      title,
      description,
      creatorId: creatorId,
      status: 'pending'
    });

    res.status(201).json({ message: 'Course created successfully', course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
