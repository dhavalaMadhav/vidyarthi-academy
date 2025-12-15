const mongoose = require('mongoose');

const fellowshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  stipend: {
    type: String,
  },
  eligibility: [String],
  benefits: [String],
  applicationDeadline: {
    type: Date,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  applications: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    trainingPartner: {
      name: String,
      verified: {
        type: Boolean,
        default: false,
      },
    },
  }],
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Fellowship', fellowshipSchema);
