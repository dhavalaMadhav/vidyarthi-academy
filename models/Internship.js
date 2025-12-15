const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide internship title'],
    trim: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide description'],
  },
  location: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  stipend: {
    type: String,
    default: 'Unpaid',
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Remote', 'Hybrid'],
    default: 'Full-time',
  },
  skillsRequired: [String],
  startDate: {
    type: Date,
    required: true,
  },
  applicationDeadline: {
    type: Date,
    required: true,
  },
  positions: {
    type: Number,
    default: 1,
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'pending'],
    default: 'active',
  },
  applicationsCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Internship', internshipSchema);
