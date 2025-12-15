const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  instructor: {
    name: String,
    bio: String,
    expertise: [String],
  },
  schedule: {
    startDate: Date,
    endDate: Date,
    sessions: [{
      title: String,
      date: Date,
      duration: String,
      isLive: Boolean,
    }],
  },
  materials: [{
    title: String,
    type: {
      type: String,
      enum: ['pdf', 'video', 'link'],
    },
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  assessments: [{
    title: String,
    type: {
      type: String,
      enum: ['weekly', 'final'],
    },
    questions: [{
      question: String,
      options: [String],
      correctAnswer: Number,
    }],
  }],
  enrolled: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  ratings: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    review: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  averageRating: {
    type: Number,
    default: 0,
  },
  maxStudents: {
    type: Number,
    default: 50,
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Training', trainingSchema);
