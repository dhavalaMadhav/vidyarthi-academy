const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['student-to-company', 'company-to-student', 'training-feedback', 'mentorship-feedback', 'career-feedback'],
    required: true,
  },
  relatedEntity: {
    entityType: {
      type: String,
      enum: ['Internship', 'Training', 'Fellowship', 'Mentorship'],
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    required: true,
  },
  aspects: {
    communication: Number,
    professionalism: Number,
    skillLevel: Number,
    punctuality: Number,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Feedback', feedbackSchema);
