const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    required: true,
    unique: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
  },
  training: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Training',
  },
  type: {
    type: String,
    enum: ['internship', 'training', 'fellowship', 'workshop'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  verificationCode: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'issued'],
    default: 'pending',
  },
  pdfUrl: {
    type: String,
  },
  qrCode: {
    type: String,
  },
}, {
  timestamps: true,
});

// Auto-generate certificate ID
certificateSchema.pre('save', async function(next) {
  if (!this.certificateId) {
    const count = await this.constructor.countDocuments();
    this.certificateId = `VA${new Date().getFullYear()}${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Certificate', certificateSchema);
