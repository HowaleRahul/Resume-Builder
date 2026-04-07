const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  profileImageUrl: { type: String },
  onboardingCompleted: { type: Boolean, default: false },
  preferences: {
    theme: { type: String, default: 'light' },
    defaultTemplate: { type: String, default: 'jitin-nair' }
  },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
