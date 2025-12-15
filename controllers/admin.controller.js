const User = require('../models/User');
const Internship = require('../models/Internship');
const Application = require('../models/Application');
const Certificate = require('../models/Certificate');
const Training = require('../models/Training');
const Fellowship = require('../models/Fellowship');
const Feedback = require('../models/Feedback');

/**
 * @desc    Get admin dashboard stats
 * @route   GET /api/admin/dashboard
 * @access  Private (Admin)
 */
exports.getDashboard = async (req, res) => {
  try {
    const stats = {
      totalStudents: await User.countDocuments({ role: 'student' }),
      totalEmployers: await User.countDocuments({ role: 'employer' }),
      pendingEmployers: await User.countDocuments({ role: 'employer', isApproved: false }),
      totalInternships: await Internship.countDocuments(),
      activeInternships: await Internship.countDocuments({ status: 'active' }),
      totalApplications: await Application.countDocuments(),
      certificatesIssued: await Certificate.countDocuments({ status: 'issued' }),
      pendingCertificates: await Certificate.countDocuments({ status: 'pending' }),
      totalTrainings: await Training.countDocuments(),
      totalFellowships: await Fellowship.countDocuments(),
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard', error: error.message });
  }
};

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
exports.getUsers = async (req, res) => {
  try {
    const { role, approved } = req.query;
    
    let query = {};
    if (role) query.role = role;
    if (approved !== undefined) query.isApproved = approved === 'true';

    const users = await User.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

/**
 * @desc    Approve/reject employer
 * @route   PUT /api/admin/users/:id/approve
 * @access  Private (Admin)
 */
exports.approveUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { isApproved },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: `User ${isApproved ? 'approved' : 'rejected'} successfully`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

/**
 * @desc    Get all internships
 * @route   GET /api/admin/internships
 * @access  Private (Admin)
 */
exports.getAllInternships = async (req, res) => {
  try {
    const internships = await Internship.find()
      .populate('company', 'name email companyDetails')
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
 * @desc    Delete internship
 * @route   DELETE /api/admin/internships/:id
 * @access  Private (Admin)
 */
exports.deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findByIdAndDelete(req.params.id);

    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Internship deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting internship', error: error.message });
  }
};

/**
 * @desc    Get all certificates
 * @route   GET /api/admin/certificates
 * @access  Private (Admin)
 */
exports.getCertificates = async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = {};
    if (status) query.status = status;

    const certificates = await Certificate.find(query)
      .populate('student', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: certificates.length,
      data: certificates,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching certificates', error: error.message });
  }
};

/**
 * @desc    Approve certificate
 * @route   PUT /api/admin/certificates/:id/approve
 * @access  Private (Admin)
 */
exports.approveCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      { status: 'issued', issueDate: Date.now() },
      { new: true }
    );

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Certificate approved and issued',
      data: certificate,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error approving certificate', error: error.message });
  }
};

/**
 * @desc    Create training program
 * @route   POST /api/admin/trainings
 * @access  Private (Admin)
 */
exports.createTraining = async (req, res) => {
  try {
    const training = await Training.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Training program created successfully',
      data: training,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating training', error: error.message });
  }
};

/**
 * @desc    Create fellowship
 * @route   POST /api/admin/fellowships
 * @access  Private (Admin)
 */
exports.createFellowship = async (req, res) => {
  try {
    const fellowship = await Fellowship.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Fellowship created successfully',
      data: fellowship,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating fellowship', error: error.message });
  }
};

/**
 * @desc    Get all feedback
 * @route   GET /api/admin/feedback
 * @access  Private (Admin)
 */
exports.getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate('from', 'name email role')
      .populate('to', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedback.length,
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback', error: error.message });
  }
};

/**
 * @desc    Verify feedback
 * @route   PUT /api/admin/feedback/:id/verify
 * @access  Private (Admin)
 */
exports.verifyFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Feedback verified successfully',
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying feedback', error: error.message });
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin)
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};
