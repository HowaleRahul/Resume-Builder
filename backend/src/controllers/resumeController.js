const resumeService = require('../services/resumeService');
const logger = require('../utils/logger');

exports.parseResume = async (req, res) => {
  try {
    const { latexCode } = req.body;
    const parsedData = await resumeService.parse(latexCode);
    logger.info('LaTeX parsed successfully');
    res.json({ success: true, data: parsedData });
  } catch (err) {
    logger.error('Failed to parse LaTeX', { error: err.message });
    res.status(500).json({ success: false, message: 'Parsing Failed', details: err.message });
  }
};

exports.generateResume = (req, res) => {
  try {
    const { resumeData, template } = req.body;
    const generatedLatex = resumeService.generate(resumeData, template);
    res.json({ success: true, latexCode: generatedLatex });
  } catch (err) {
    logger.error('Failed to generate resume', { error: err.message });
    res.status(500).json({ success: false, message: 'Generation Failed', details: err.message });
  }
};

exports.compilePdf = (req, res) => {
  try {
    const { latexCode } = req.body;
    const pdfStream = resumeService.compilePdf(latexCode);

    res.setHeader('Content-Type', 'application/pdf');
    pdfStream.pipe(res);
    pdfStream.on('error', err => {
      logger.error('PDF compilation error', { error: err.message });
      if (!res.headersSent) res.status(500).json({ error: 'Compilation Failed' });
    });
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ error: 'Failed to initiate PDF compilation' });
  }
};

exports.saveResume = async (req, res) => {
  try {
    const result = await resumeService.save(req.body);
    res.json({ success: true, resumeId: result._id });
  } catch (err) {
    logger.error('Failed to save resume', { error: err.message });
    res.status(500).json({ success: false, message: 'Failed to save resume', details: err.message });
  }
};

exports.listResumes = async (req, res) => {
  try {
    const resumes = await resumeService.listByUser(req.params.userId);
    res.json({ success: true, resumes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to list resumes', details: err.message });
  }
};

exports.getResumeById = async (req, res) => {
  try {
    const resume = await resumeService.getById(req.params.id);
    res.json({ success: true, resume });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch resume', details: err.message });
  }
};
