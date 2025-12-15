const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  mobile: {
    type: String,
    required: [true, 'Please provide a mobile number'],
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit mobile number'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['student', 'employer', 'admin'],
    default: 'student',
  },
  isApproved: {
    type: Boolean,
    default: function() {
      return this.role === 'student' ? true : false;
    },
  },
  profile: {
    education: String,
    institution: String,
    course: String,
    year: String,
    skills: [String],
    interests: [String],
    bio: String,
    resume: String,
    profilePicture: String,
  },
  companyDetails: {
    companyName: String,
    designation: String,
    industry: String,
    website: String,
    address: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
