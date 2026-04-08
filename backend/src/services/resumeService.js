const Resume = require('../models/Resume');
const latex = require('node-latex');
const stream = require('stream');
const logger = require('../utils/logger');
const { parseLatex } = require('./latexParser');
const { generateLatex } = require('./latexGenerator');

/**
 * Service to handle Resume business logic
 */
class ResumeService {
  async parse(latexCode) {
    if (!latexCode) throw new Error('latexCode is required');
    return await parseLatex(latexCode);
  }

  generate(resumeData, template) {
    if (!resumeData) throw new Error('resumeData is required');
    return generateLatex(resumeData, template);
  }

  compilePdf(latexCode) {
    if (!latexCode) throw new Error('latexCode is required');
    
    const input = new stream.Readable();
    input.push(latexCode);
    input.push(null);
    
    return latex(input);
  }

  async save(data) {
    const { userId, title, extractedData, latexCode, templateType } = data;
    if (!userId) throw new Error('userId is required');

    const newResume = new Resume({
      userId,
      title: title || 'Untitled Resume',
      personal: extractedData?.personal || {},
      education: extractedData?.education || [],
      experience: extractedData?.experience || [],
      projects: extractedData?.projects || [],
      skills: extractedData?.skills || [],
      originalLatexCode: latexCode,
      templateType: templateType || 'jitin-nair',
      versions: [{ versionNumber: 1, jsonSnapshot: extractedData }]
    });

    return await newResume.save();
  }

  async listByUser(userId) {
    return await Resume.find({ userId })
      .select('title updatedAt templateType atsScore')
      .sort({ updatedAt: -1 })
      .lean();
  }

  async getById(id) {
    const resume = await Resume.findById(id).lean();
    if (!resume) throw new Error('Resume not found');
    return resume;
  }
}

module.exports = new ResumeService();
