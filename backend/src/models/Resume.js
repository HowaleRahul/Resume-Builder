const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  date: String,
  title: String,
  companyOrInst: String,
  location: String,
  details: String,
  description: String
});

const ResumeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    default: 'Untitled Resume'
  },
  personal: {
    name: String,
    email: String,
    phone: String,
    location: String
  },
  education: [ExperienceSchema],
  experience: [ExperienceSchema],
  projects: [ExperienceSchema],
  skills: [{ text: String }],
  customSections: [{ title: String, content: String }],
  
  // Storage fields
  originalLatexCode: String,
  generatedLatexCode: String,
  templateType: {
    type: String,
    default: 'moderncv'
  },
  atsScore: Number,
  
  versions: [{
    versionNumber: Number,
    jsonSnapshot: mongoose.Schema.Types.Mixed,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

const Resume = mongoose.model('Resume', ResumeSchema);

module.exports = Resume;
