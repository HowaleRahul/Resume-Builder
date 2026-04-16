const Resume = require('../models/Resume');
const stream = require('stream');
const axios = require('axios');
const logger = require('../utils/logger');
const { parseLatex } = require('./latexParser');
const { generateLatex } = require('./latexGenerator');
const { compilePdfViaCloud, generateHtmlPdf, latexToHtml } = require('../utils/pdfGenerator');
const LatexReconciler = require('./latexReconciler');

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

  async compilePdf(latexCode) {
    if (!latexCode) throw new Error('latexCode is required');

    try {
      // Step 1: Try cloud-based LaTeX compilation services
      logger.info('Attempting cloud-based LaTeX compilation...');
      const pdfBuffer = await compilePdfViaCloud(latexCode);
      
      if (pdfBuffer) {
        logger.info('✅ PDF generated successfully via cloud service');
        return pdfBuffer;
      }

      // Step 2: Fallback to HTML rendering if cloud services fail
      logger.warn('Cloud services unavailable, attempting fallback HTML rendering...');
      const resumeHtml = latexToHtml(latexCode);
      const pdfDoc = generateHtmlPdf(resumeHtml);
      
      // Convert PDFKit stream to buffer
      return new Promise((resolve, reject) => {
        const chunks = [];
        pdfDoc.on('data', chunk => chunks.push(chunk));
        pdfDoc.on('end', () => {
          logger.info('✅ PDF generated successfully via HTML fallback');
          resolve(Buffer.concat(chunks));
        });
        pdfDoc.on('error', reject);
        pdfDoc.end();
      });

    } catch (error) {
      logger.error('PDF compilation error', { error: error.message });
      
      // Provide helpful error messages
      if (error.message.includes('timeout')) {
        throw new Error('PDF compilation timeout. The document may be too complex. Please try again.');
      } else if (error.message.includes('syntax') || error.message.includes('LaTeX')) {
        throw new Error('LaTeX compilation error: Check your resume content for syntax errors.');
      } else {
        throw new Error('PDF generation service temporarily unavailable. Please try again in a moment.');
      }
    }
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
      latexStructure: extractedData?.latexStructure || latexCode,
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
