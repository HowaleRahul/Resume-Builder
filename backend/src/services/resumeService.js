const Resume = require('../models/Resume');
const latex = require('node-latex');
const stream = require('stream');
const { execSync } = require('child_process');
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

    // Optimization: Check pdflatex availability only once or periodically
    if (this._pdflatexAvailable === undefined) {
      try {
        execSync('pdflatex --version', { stdio: 'ignore' });
        this._pdflatexAvailable = true;
      } catch (e) {
        this._pdflatexAvailable = false;
        logger.error('pdflatex binary not found in system path.');
      }
    }

    if (!this._pdflatexAvailable) {
      throw new Error('LaTeX compilation engine (pdflatex) is not installed on this server. AI Resume Suite can still generate the source code, but PDF compilation is restricted. Please use the "Download .tex" option or "Native Print" in the browser.');
    }
    
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
