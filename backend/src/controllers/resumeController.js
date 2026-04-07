const { parseLatex } = require('../services/latexParser');
const { generateLatex } = require('../services/latexGenerator');
const Resume = require('../models/Resume');
const latex = require('node-latex');
const stream = require('stream');
const logger = require('../utils/logger');

exports.parseResume = async (req, res) => {
  try {
    const { latexCode } = req.body;
    if (!latexCode) {
      return res.status(400).json({ error: 'latexCode is required' });
    }
    logger.info('Parsing LaTeX resume', { codeLength: latexCode.length });
    const parsedData = await parseLatex(latexCode);
    logger.info('LaTeX parsed successfully', { sections: Object.keys(parsedData) });
    res.json({ success: true, data: parsedData });
  } catch (err) {
    logger.error('Failed to parse LaTeX', { error: err.message });
    res.status(500).json({ error: 'Failed to parse LaTeX', details: err.message });
  }
};

exports.generateResume = (req, res) => {
  try {
    const { resumeData, template } = req.body;
    if (!resumeData) {
      return res.status(400).json({ error: 'resumeData is required' });
    }
    logger.info('Generating LaTeX from resume data', { template: template || 'default' });
    const generatedLatex = generateLatex(resumeData, template);
    logger.info('LaTeX generated successfully', { outputLength: generatedLatex.length });
    res.json({ success: true, latexCode: generatedLatex });
  } catch (err) {
    logger.error('Failed to generate LaTeX', { error: err.message });
    res.status(500).json({ error: 'Failed to generate LaTeX', details: err.message });
  }
};

exports.compilePdf = (req, res) => {
  try {
    const { latexCode } = req.body;
    if (!latexCode) return res.status(400).json({ error: 'latexCode is required' });

    logger.info('Compiling PDF via node-latex', { codeLength: latexCode.length });
    const input = new stream.Readable();
    input.push(latexCode);
    input.push(null);

    res.setHeader('Content-Type', 'application/pdf');
    const pdf = latex(input);

    pdf.pipe(res);
    pdf.on('error', err => {
      logger.error('PDF compilation error', { error: err.message });
      if (!res.headersSent) {
        res.status(500).json({ error: 'PDF Compilation Failed', details: err.message });
      }
    });
    pdf.on('finish', () => logger.info('PDF compiled and streamed successfully'));
  } catch (err) {
    logger.error('compilePdf handler error', { error: err.message });
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to compile PDF', details: err.message });
    }
  }
};

exports.saveResume = async (req, res) => {
  try {
    const { userId, title, extractedData, latexCode } = req.body;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const newResume = new Resume({
      userId,
      title: title || 'Untitled Resume',
      personal: extractedData?.personal || {},
      education: extractedData?.education || [],
      experience: extractedData?.experience || [],
      projects: extractedData?.projects || [],
      skills: extractedData?.skills || [],
      originalLatexCode: latexCode,
      versions: [{ versionNumber: 1, jsonSnapshot: extractedData }]
    });

    await newResume.save();
    res.json({ success: true, resumeId: newResume._id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save resume', details: err.message });
  }
};

exports.listResumes = async (req, res) => {
  try {
    const { userId } = req.params;
    const resumes = await Resume.find({ userId }).select('title updatedAt templateType').sort({ updatedAt: -1 });
    res.json({ success: true, resumes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to list resumes', details: err.message });
  }
};

exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    res.json({ success: true, resume });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch resume', details: err.message });
  }
};
