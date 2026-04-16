const resumeService = require('../services/resumeService');
const Resume = require('../models/Resume');
const logger = require('../utils/logger');

exports.parseResume = async (req, res) => {
  try {
    const { latexCode } = req.body;
    const parsedData = await resumeService.parse(latexCode);
    logger.info('✅ LaTeX parsed successfully with structure preserved');
    // Explicitly include latexStructure in response
    res.json({ 
      success: true, 
      data: parsedData,
      hasStructure: !!parsedData.latexStructure
    });
  } catch (err) {
    logger.error('Failed to parse LaTeX', { error: err.message });
    res.status(500).json({ success: false, message: 'Parsing Failed', details: err.message });
  }
};

exports.generateResume = (req, res) => {
  try {
    const { resumeData, template } = req.body;
    if (!resumeData) {
      return res.status(400).json({ success: false, message: 'resumeData is required' });
    }
    
    const generatedLatex = resumeService.generate(resumeData, template);
    const hasStructure = !!resumeData.latexStructure;
    
    logger.info(`✅ LaTeX regenerated${hasStructure ? ' with PRESERVED STRUCTURE' : ' from template'}`);
    
    res.json({ 
      success: true, 
      latexCode: generatedLatex,
      hasStructure: hasStructure,
      message: hasStructure ? 'Structure preserved - only values changed' : 'Generated from template'
    });
  } catch (err) {
    logger.error('Failed to generate resume', { error: err.message });
    res.status(500).json({ success: false, message: 'Generation Failed', details: err.message });
  }
};

exports.compilePdf = async (req, res) => {
  try {
    const { latexCode } = req.body;

    if (!latexCode) {
      return res.status(400).json({ success: false, error: 'LaTeX code required' });
    }

    const pdfBuffer = await resumeService.compilePdf(latexCode);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
    res.send(pdfBuffer);
  } catch (err) {
    logger.error('PDF compilation error', { error: err.message });
    res.status(500).json({ success: false, error: err.message });
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
