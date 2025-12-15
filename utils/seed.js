// Load environment variables FIRST
const path = require('path');
const dotenv = require('dotenv');

// Load .env from parent directory
const envPath = path.resolve(__dirname, '../.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

// Check if environment variables are loaded
console.log('\n🔍 Environment Check:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Loaded' : '❌ Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Loaded' : '❌ Missing');
console.log('');

if (!process.env.MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI is not defined in .env file');
  console.error('\n💡 Solution:');
  console.error('1. Create .env file in project root');
  console.error('2. Add this line: MONGODB_URI=mongodb://localhost:27017/vidyarthi_academy\n');
  process.exit(1);
}

const mongoose = require('mongoose');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    console.log('📍 URI:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB successfully!\n');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@vidyarthiacademy.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin already exists!');
      console.log('Email: admin@vidyarthiacademy.com');
      console.log('Use password you set during creation\n');
      process.exit(0);
    }

    // Create admin user
    console.log('🔨 Creating admin user...');
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@vidyarthiacademy.com',
      mobile: '9999999999',
      password: 'admin123', // Will be hashed by User model
      role: 'admin',
      isApproved: true,
    });

    console.log('\n✅ Admin account created successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👑 ADMIN LOGIN CREDENTIALS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🌐 Login URL:  http://localhost:3000/login');
    console.log('📧 Email:      admin@vidyarthiacademy.com');
    console.log('🔑 Password:   admin123');
    console.log('👤 Role:       Select "Admin" from dropdown');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message);
    
    if (error.message.includes('connect')) {
      console.error('\n💡 MongoDB Connection Error:');
      console.error('   1. Make sure MongoDB is running: mongod');
      console.error('   2. Check if MongoDB is installed');
      console.error('   3. Verify connection string in .env file\n');
    }
    
    process.exit(1);
  }
};

createAdmin();
