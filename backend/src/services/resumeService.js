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
    const { userId, resumeId, title, resumeData, latexCode, templateType, generatedLatex, atsScore } = data;
    if (!userId) throw new Error('userId is required');


    // If resumeId exists, we update. Otherwise, create new.
    let resume;
    if (resumeId && resumeId !== 'undefined' && resumeId !== 'null') {
      resume = await Resume.findById(resumeId);
    }

    if (resume) {
      // UPDATE EXISTING
      resume.title = title || resume.title;
      resume.personal = resumeData?.personal || resume.personal;
      resume.summary = resumeData?.summary || resume.summary;
      resume.education = resumeData?.education || resume.education;
      resume.experience = resumeData?.experience || resume.experience;
      resume.projects = resumeData?.projects || resume.projects;
      resume.skills = resumeData?.skills || resume.skills;
      resume.originalLatexCode = latexCode || resume.originalLatexCode;
      resume.generatedLatexCode = generatedLatex || resume.generatedLatexCode;
      resume.latexStructure = resumeData?.latexStructure || resume.latexStructure;
      resume.templateType = templateType || resume.templateType;
      
      // Add a new version
      const nextVersion = (resume.versions?.length || 0) + 1;
      resume.versions.push({
        versionNumber: nextVersion,
        jsonSnapshot: resumeData,
        timestamp: new Date()
      });

      return await resume.save();
    } else {
      // CREATE NEW
      const newResume = new Resume({
        userId,
        title: title || 'Untitled Resume',
        personal: resumeData?.personal || {},
        summary: resumeData?.summary || '',
        education: resumeData?.education || [],
        experience: resumeData?.experience || [],
        projects: resumeData?.projects || [],
        skills: resumeData?.skills || [],
        originalLatexCode: latexCode,
        generatedLatexCode: generatedLatex,
        latexStructure: resumeData?.latexStructure || latexCode,
        templateType: templateType || 'moderncv',
        versions: [{ versionNumber: 1, jsonSnapshot: resumeData }]
      });

      return await newResume.save();
    }
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
