const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getUsers,
  approveUser,
  getAllInternships,
  deleteInternship,
  getCertificates,
  approveCertificate,
  createTraining,
  createFellowship,
  getAllFeedback,
  verifyFeedback,
  deleteUser,
} = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

// All routes are protected and only for admin
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.put('/users/:id/approve', approveUser);
router.delete('/users/:id', deleteUser);
router.get('/internships', getAllInternships);
router.delete('/internships/:id', deleteInternship);
router.get('/certificates', getCertificates);
router.put('/certificates/:id/approve', approveCertificate);
router.post('/trainings', createTraining);
router.post('/fellowships', createFellowship);
router.get('/feedback', getAllFeedback);
router.put('/feedback/:id/verify', verifyFeedback);

module.exports = router;
