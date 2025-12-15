const express = require('express');
const router = express.Router();
const {
  getDashboard,
  createInternship,
  getInternships,
  updateInternship,
  deleteInternship,
  getApplications,
  updateApplicationStatus,
  submitFeedback,
} = require('../controllers/employer.controller');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

// All routes are protected and only for employers
router.use(protect);
router.use(authorize('employer'));

router.get('/dashboard', getDashboard);
router.route('/internships')
  .get(getInternships)
  .post(createInternship);
router.route('/internships/:id')
  .put(updateInternship)
  .delete(deleteInternship);
router.get('/applications', getApplications);
router.put('/applications/:id', updateApplicationStatus);
router.post('/feedback', submitFeedback);

module.exports = router;
