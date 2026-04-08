const aiService = require('../services/aiService');
const pdfService = require('../services/pdfService');
const logger = require('../utils/logger');
const axios = require('axios');

exports.enhanceResumeText = async (req, res) => {
  try {
    const suggestions = await aiService.enhanceText(req.body.textToImprove);
    res.json({ success: true, suggestions });
  } catch (err) {
    res.status(500).json({ error: 'AI Improvement failed', details: err.message });
  }
};

exports.calculateAtsScore = async (req, res) => {
  try {
    const { parsedResumeData, jobDescription } = req.body;
    const result = await aiService.matchJobDescription(jobDescription, JSON.stringify(parsedResumeData));
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ error: 'ATS analysis failed', details: err.message });
  }
};

exports.compareResumes = async (req, res) => {
  try {
    const { resumeA, resumeB } = req.body;
    const data = await aiService.compareResumes(resumeA, resumeB);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: 'Comparison failed', details: err.message });
  }
};

exports.translateResume = async (req, res) => {
  try {
    const { resumeData, targetLanguage } = req.body;
    const translatedData = await aiService.translate(resumeData, targetLanguage);
    res.json({ success: true, translatedData });
  } catch (err) {
    res.status(500).json({ error: 'Translation failed', details: err.message });
  }
};

exports.checkSyntax = async (req, res) => {
  try {
    const result = await aiService.checkLatexSyntax(req.body.latexCode);
    res.json({ success: true, ...result });
  } catch (err) {
    res.json({ success: true, valid: false, errors: [err.message] });
  }
};

exports.matchJobDescription = async (req, res) => {
  try {
    const { jobDescription, resumeText } = req.body;
    const result = await aiService.matchJobDescription(jobDescription, resumeText);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ error: 'JD matching failed', details: err.message });
  }
};

exports.tailorResume = async (req, res) => {
  try {
    const tailoredData = await aiService.tailorResume(req.body.resumeData, req.body.jobDescription);
    res.json({ success: true, tailoredData });
  } catch (err) {
    res.status(500).json({ error: 'Tailoring failed', details: err.message });
  }
};

exports.generateCoverLetter = async (req, res) => {
  try {
    const coverLetterLatex = await aiService.generateCoverLetter(req.body.resumeData, req.body.jobDescription);
    res.json({ success: true, coverLetterLatex });
  } catch (err) {
    res.status(500).json({ error: 'Cover letter failed', details: err.message });
  }
};

exports.getSkillGap = async (req, res) => {
  try {
    const result = await aiService.getSkillGap(req.body.resumeData, req.body.jobDescription);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ error: 'Skill gap analysis failed', details: err.message });
  }
};

exports.getInterviewPrep = async (req, res) => {
  try {
    const result = await aiService.getInterviewPrep(req.body.resumeData, req.body.jobDescription);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ error: 'Interview prep failed', details: err.message });
  }
};

exports.analyzePortfolio = async (req, res) => {
  try {
    const { url } = req.body;
    const webRes = await axios.get(url, { timeout: 8000 });
    const snippet = webRes.data.substring(0, 8000);
    const prompt = `Extract professional experience/projects from this text. Return JSON: { "projects": [{"title":"", "bullets":[], "date":"", "url": "${url}"}] }. TEXT: ${snippet}`;
    const result = await aiService.runPrompt(prompt, true);
    res.json({ success: true, extractedData: result });
  } catch (err) {
    res.status(500).json({ error: 'Portfolio analysis failed', details: err.message });
  }
};
exports.parsePdf = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const text = await pdfService.extractText(req.file.buffer);
    res.json({ success: true, text });
  } catch (err) {
    res.status(500).json({ error: 'PDF parsing failed', details: err.message });
  }
};
