require('dotenv').config(); // Load environment variables FIRST

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');

// Environment check
console.log('\n🔍 Environment Variables Check:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('NODE_ENV:', process.env.NODE_ENV || '⚠️  not set (defaulting to development)');
console.log('PORT:', process.env.PORT || '⚠️  not set (defaulting to 3000)');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ configured' : '❌ NOT SET');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ configured' : '❌ NOT SET');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Check for required environment variables
if (!process.env.JWT_SECRET) {
  console.error('⚠️  WARNING: JWT_SECRET is not set. Using default (INSECURE for production)');
}

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/student', require('./routes/student.routes'));
app.use('/api/employer', require('./routes/employer.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

// Public routes (Serve EJS pages)
app.get('/', (req, res) => {
  res.render('public/home', { title: 'Vidyarthi Academy - Home' });
});

app.get('/login', (req, res) => {
  res.render('public/login', { title: 'Login - Vidyarthi Academy' });
});

app.get('/signup', (req, res) => {
  res.render('public/signup', { title: 'Sign Up - Vidyarthi Academy' });
});

// Student routes (Protected - JWT check on frontend)
app.get('/student/dashboard', (req, res) => {
  res.render('student/dashboard', { title: 'Student Dashboard' });
});

app.get('/student/internship', (req, res) => {
  res.render('student/internship', { title: 'Internships' });
});

app.get('/student/certificate', (req, res) => {
  res.render('student/certificate', { title: 'My Certificates' });
});

app.get('/student/training', (req, res) => {
  res.render('student/training', { title: 'Training Programs' });
});

app.get('/student/mentorship', (req, res) => {
  res.render('student/mentorship', { title: 'Mentorship' });
});

app.get('/student/fellowship', (req, res) => {
  res.render('student/fellowship', { title: 'Fellowship Programs' });
});

app.get('/student/career', (req, res) => {
  res.render('student/career', { title: 'Career Counseling' });
});

app.get('/student/feedback', (req, res) => {
  res.render('student/feedback', { title: 'Feedback & Rating' });
});

// Employer routes
app.get('/employer/dashboard', (req, res) => {
  res.render('employer/dashboard', { title: 'Employer Dashboard' });
});

app.get('/employer/internships', (req, res) => {
  res.render('employer/internships', { title: 'Manage Internships' });
});

// Admin routes
app.get('/admin/dashboard', (req, res) => {
  res.render('admin/dashboard', { title: 'Admin Dashboard' });
});

app.get('/admin/manage', (req, res) => {
  res.render('admin/manage', { title: 'Manage Portal' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('\n🚀 Server Status:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📱 Local: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
});
