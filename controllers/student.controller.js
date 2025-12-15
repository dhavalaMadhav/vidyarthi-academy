const Internship = require('../models/Internship');
const Application = require('../models/Application');
const Certificate = require('../models/Certificate');
const Training = require('../models/Training');
const Fellowship = require('../models/Fellowship');
const Feedback = require('../models/Feedback');

/**
 * @desc    Get student dashboard data
 * @route   GET /api/student/dashboard
 * @access  Private (Student)
 */
exports.getDashboard = async (req, res) => {
  try {
    const studentId = req.user.id;

    const applications = await Application.find({ student: studentId })
      .populate('internship')
      .limit(5);

    const certificates = await Certificate.find({ student: studentId }).limit(5);
    const trainings = await Training.find({ enrolled: studentId }).limit(5);

    res.status(200).json({
      success: true,
      data: {
        applications,
        certificates,
        trainings,
        stats: {
          totalApplications: applications.length,
          certificates: certificates.length,
          trainingsEnrolled: trainings.length,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard', error: error.message });
  }
};

/**
 * @desc    Get all internships
 * @route   GET /api/student/internships
 * @access  Private (Student)
 */
exports.getInternships = async (req, res) => {
  try {
    const { search, location, type, duration } = req.query;

    let query = { status: 'active' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (type) {
      query.type = type;
    }

    if (duration) {
      query.duration = duration;
    }

    const internships = await Internship.find(query)
      .populate('company', 'name companyDetails')
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
 * @desc    Apply for internship
 * @route   POST /api/student/internships/:id/apply
 * @access  Private (Student)
 */
exports.applyInternship = async (req, res) => {
  try {
    const { id } = req.params;
    const { coverLetter, resume } = req.body;
    const studentId = req.user.id;

    // Check if already applied
    const existingApplication = await Application.findOne({
      internship: id,
      student: studentId,
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied for this internship' });
    }

    const application = await Application.create({
      internship: id,
      student: studentId,
      coverLetter,
      resume,
    });

    // Update application count
    await Internship.findByIdAndUpdate(id, { $inc: { applicationsCount: 1 } });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error applying for internship', error: error.message });
  }
};

/**
 * @desc    Get student's applications
 * @route   GET /api/student/applications
 * @access  Private (Student)
 */
exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user.id })
      .populate('internship')
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
 * @desc    Get student certificates
 * @route   GET /api/student/certificates
 * @access  Private (Student)
 */
exports.getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ 
      student: req.user.id,
      status: 'issued'
    }).sort({ issueDate: -1 });

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
 * @desc    Get all trainings
 * @route   GET /api/student/trainings
 * @access  Private (Student)
 */
exports.getTrainings = async (req, res) => {
  try {
    const trainings = await Training.find({ status: { $ne: 'completed' } })
      .sort({ 'schedule.startDate': 1 });

    res.status(200).json({
      success: true,
      count: trainings.length,
      data: trainings,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trainings', error: error.message });
  }
};

/**
 * @desc    Enroll in training
 * @route   POST /api/student/trainings/:id/enroll
 * @access  Private (Student)
 */
exports.enrollTraining = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user.id;

    const training = await Training.findById(id);

    if (!training) {
      return res.status(404).json({ message: 'Training not found' });
    }

    if (training.enrolled.includes(studentId)) {
      return res.status(400).json({ message: 'Already enrolled in this training' });
    }

    if (training.enrolled.length >= training.maxStudents) {
      return res.status(400).json({ message: 'Training is full' });
    }

    training.enrolled.push(studentId);
    await training.save();

    res.status(200).json({
      success: true,
      message: 'Successfully enrolled in training',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error enrolling in training', error: error.message });
  }
};

/**
 * @desc    Submit feedback
 * @route   POST /api/student/feedback
 * @access  Private (Student)
 */
exports.submitFeedback = async (req, res) => {
  try {
    const { to, type, relatedEntity, rating, review, aspects } = req.body;

    const feedback = await Feedback.create({
      from: req.user.id,
      to,
      type,
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

/**
 * @desc    Get fellowships
 * @route   GET /api/student/fellowships
 * @access  Private (Student)
 */
exports.getFellowships = async (req, res) => {
  try {
    const fellowships = await Fellowship.find({ status: 'open' })
      .sort({ applicationDeadline: 1 });

    res.status(200).json({
      success: true,
      count: fellowships.length,
      data: fellowships,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching fellowships', error: error.message });
  }
};

/**
 * @desc    Apply for fellowship
 * @route   POST /api/student/fellowships/:id/apply
 * @access  Private (Student)
 */
exports.applyFellowship = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user.id;

    const fellowship = await Fellowship.findById(id);

    if (!fellowship) {
      return res.status(404).json({ message: 'Fellowship not found' });
    }

    // Check if already applied
    const alreadyApplied = fellowship.applications.some(
      app => app.student.toString() === studentId
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: 'Already applied for this fellowship' });
    }

    fellowship.applications.push({
      student: studentId,
      status: 'pending',
    });

    await fellowship.save();

    res.status(200).json({
      success: true,
      message: 'Fellowship application submitted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error applying for fellowship', error: error.message });
  }
};
