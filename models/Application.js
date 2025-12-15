const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  internship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  coverLetter: {
    type: String,
    required: true,
  },
  resume: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'shortlisted', 'rejected', 'accepted', 'completed'],
    default: 'pending',
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  certificateEligible: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Create compound index to prevent duplicate applications
applicationSchema.index({ internship: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
