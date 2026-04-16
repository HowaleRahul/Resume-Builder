const axios = require('axios');
const logger = require('../utils/logger');

/**
 * Convert LaTeX to HTML for rendering
 * This is a simplified conversion for resume display
 */
function latexToHtml(latexCode) {
  let html = latexCode
    // Replace LaTeX commands with HTML
    .replace(/\\textbf\{([^}]*)\}/g, '<strong>$1</strong>')
    .replace(/\\textit\{([^}]*)\}/g, '<em>$1</em>')
    .replace(/\\underline\{([^}]*)\}/g, '<u>$1</u>')
    .replace(/\\section\{([^}]*)\}/g, '<h2>$1</h2>')
    .replace(/\\subsection\{([^}]*)\}/g, '<h3>$1</h3>')
    .replace(/\\item /g, '<li>')
    .replace(/\\begin\{itemize\}/g, '<ul>')
    .replace(/\\end\{itemize\}/g, '</ul>')
    .replace(/\\begin\{enumerate\}/g, '<ol>')
    .replace(/\\end\{enumerate\}/g, '</ol>')
    .replace(/\\\\/g, '<br />')
    .replace(/~/g, ' ')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return html;
}

/**
 * Compile LaTeX to PDF using cloud service
 */
async function compilePdfViaCloud(latexCode) {
  // List of cloud LaTeX compilation services to try
  const services = [
    {
      name: 'latexonline.cc',
      url: 'https://latexonline.cc/compile',
      payload: { latex: latexCode },
      config: { 
        responseType: 'arraybuffer',
        timeout: 35000,
        headers: { 'Content-Type': 'application/json' }
      }
    },
    {
      name: 'miktex.org',
      url: 'https://miktex.org/api/compile',
      payload: { latex: latexCode },
      config: { 
        responseType: 'arraybuffer',
        timeout: 35000,
        headers: { 'Content-Type': 'application/json' }
      }
    }
  ];

  for (const service of services) {
    try {
      logger.info(`Attempting LaTeX compilation via ${service.name}...`);
      const response = await axios.post(service.url, service.payload, service.config);
      
      if (response.status === 200 && response.data && response.data.length > 0) {
        logger.info(`✅ PDF compiled successfully via ${service.name}`);
        return response.data;
      }
    } catch (error) {
      logger.warn(`${service.name} failed`, { error: error.message });
    }
  }

  return null;
}

/**
 * Generate PDF using HTML rendering as fallback
 * This is more reliable when cloud services are unavailable
 */
function generateHtmlPdf(resumeHtml) {
  try {
    // Check if PDFKit is available
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument();
    
    // Extract text from HTML and render to PDF
    const text = resumeHtml
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .trim();

    // Add text to PDF with wrapping
    doc.fontSize(12);
    doc.text(text, {
      width: 500,
      align: 'left'
    });

    return doc;
  } catch (error) {
    logger.error('PDFKit not available for fallback rendering', { error: error.message });
    throw new Error('PDF generation failed: Neither cloud service nor local rendering available');
  }
}

module.exports = {
  latexToHtml,
  compilePdfViaCloud,
  generateHtmlPdf
};
