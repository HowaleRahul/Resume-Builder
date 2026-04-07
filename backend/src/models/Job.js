const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  company: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['applied', 'interviewing', 'offered', 'rejected', 'wishlist'],
    default: 'wishlist'
  },
  dateApplied: {
    type: Date,
    default: Date.now
  },
  location: String,
  salary: String,
  url: String,
  notes: String,
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume'
  },
  priority: {
    type: Number,
    default: 2 // 1: High, 2: Med, 3: Low
  }
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
