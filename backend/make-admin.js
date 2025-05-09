// backend/make-admin.js
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// Replace with the email of the user you want to make admin
const EMAIL_TO_UPDATE = 'your-email@example.com';

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Update user role to admin
    const result = await User.updateOne(
      { email: EMAIL_TO_UPDATE },
      { role: 'admin' }
    );
    
    if (result.matchedCount > 0) {
      console.log(`User with email ${EMAIL_TO_UPDATE} has been updated to admin`);
    } else {
      console.log(`No user found with email ${EMAIL_TO_UPDATE}`);
    }
    
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error:', err);
    mongoose.disconnect();
  });