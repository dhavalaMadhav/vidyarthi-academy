const Internship = require('../models/Internship');
const Application = require('../models/Application');
const Feedback = require('../models/Feedback');

/**
 * @desc    Get employer dashboard
 * @route   GET /api/employer/dashboard
 * @access  Private (Employer)
 */
exports.getDashboard = async (req, res) => {
  try {
    const employerId = req.user.id;

    const internships = await Internship.find({ company: employerId });
    const totalApplications = await Application.countDocuments({
      internship: { $in: internships.map(i => i._id) },
    });

    const recentApplications = await Application.find({
      internship: { $in: internships.map(i => i._id) },
    })
      .populate('student', 'name email profile')
      .populate('internship', 'title')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalInternships: internships.length,
          activeInternships: internships.filter(i => i.status === 'active').length,
          totalApplications,
        },
        recentApplications,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard', error: error.message });
  }
};

/**
 * @desc    Create new internship
 * @route   POST /api/employer/internships
 * @access  Private (Employer)
 */
exports.createInternship = async (req, res) => {
  try {
    const internshipData = {
      ...req.body,
      company: req.user.id,
    };

    const internship = await Internship.create(internshipData);

    res.status(201).json({
      success: true,
      message: 'Internship created successfully',
      data: internship,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating internship', error: error.message });
  }
};

/**
 * @desc    Get employer's internships
 * @route   GET /api/employer/internships
 * @access  Private (Employer)
 */
exports.getInternships = async (req, res) => {
  try {
    const internships = await Internship.find({ company: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: internships.length,
      data: internships,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching internships', error: error.message });
  }
};

/**
 * @desc    Update internship
 * @route   PUT /api/employer/internships/:id
 * @access  Private (Employer)
 */
exports.updateInternship = async (req, res) => {
  try {
    const { id } = req.params;

    let internship = await Internship.findById(id);

    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    // Check ownership
    if (internship.company.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    internship = await Internship.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Internship updated successfully',
      data: internship,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating internship', error: error.message });
  }
};

/**
 * @desc    Delete internship
 * @route   DELETE /api/employer/internships/:id
 * @access  Private (Employer)
 */
exports.deleteInternship = async (req, res) => {
  try {
    const { id } = req.params;

    const internship = await Internship.findById(id);

    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    // Check ownership
    if (internship.company.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await internship.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Internship deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting internship', error: error.message });
  }
};

/**
 * @desc    Get applications for employer's internships
 * @route   GET /api/employer/applications
 * @access  Private (Employer)
 */
exports.getApplications = async (req, res) => {
  try {
    const internships = await Internship.find({ company: req.user.id });
    const internshipIds = internships.map(i => i._id);

    const applications = await Application.find({ internship: { $in: internshipIds } })
      .populate('student', 'name email mobile profile')
      .populate('internship', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
};

/**
 * @desc    Update application status
 * @route   PUT /api/employer/applications/:id
 * @access  Private (Employer)
 */
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, certificateEligible } = req.body;

    const application = await Application.findById(id).populate('internship');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check ownership
    if (application.internship.company.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    if (certificateEligible !== undefined) {
      application.certificateEligible = certificateEligible;
    }

    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application status updated',
      data: application,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating application', error: error.message });
  }
};

/**
 * @desc    Submit feedback for student
 * @route   POST /api/employer/feedback
 * @access  Private (Employer)
 */
exports.submitFeedback = async (req, res) => {
  try {
    const { to, relatedEntity, rating, review, aspects } = req.body;

    const feedback = await Feedback.create({
      from: req.user.id,
      to,
      type: 'company-to-student',
      relatedEntity,
      rating,
      review,
      aspects,
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting feedback', error: error.message });
  }
};
