const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getInternships,
  applyInternship,
  getApplications,
  getCertificates,
  getTrainings,
  enrollTraining,
  submitFeedback,
  getFellowships,
  applyFellowship,
} = require('../controllers/student.controller');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

// All routes are protected and only for students
router.use(protect);
router.use(authorize('student'));

router.get('/dashboard', getDashboard);
router.get('/internships', getInternships);
router.post('/internships/:id/apply', applyInternship);
router.get('/applications', getApplications);
router.get('/certificates', getCertificates);
router.get('/trainings', getTrainings);
router.post('/trainings/:id/enroll', enrollTraining);
router.post('/feedback', submitFeedback);
router.get('/fellowships', getFellowships);
router.post('/fellowships/:id/apply', applyFellowship);

module.exports = router;
