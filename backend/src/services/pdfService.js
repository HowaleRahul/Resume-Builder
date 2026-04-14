const pdf = require('pdf-parse');
const logger = require('../utils/logger');

/**
 * Service to handle PDF operations
 */
class PdfService {
  /**
   * Extracts text from a PDF buffer
   * @param {Buffer} dataBuffer 
   * @returns {Promise<string>}
   */
  async extractText(dataBuffer) {
    try {
      if (!dataBuffer || dataBuffer.length === 0) {
        throw new Error("Empty PDF buffer received.");
      }

      // Vercel serverless functions often lack system-level rendering libs (like canvas).
      // We provide a custom text-only render function to bypass the dependency.
      const render_page = async (pageData) => {
        const textContent = await pageData.getTextContent();
        return textContent.items.map(item => item.str).join(' ');
      };

      const options = {
        pagerender: render_page,
        max: 10 // Only parse first 10 pages for safety
      };

      const data = await pdf(dataBuffer, options);
      
      if (!data.text || data.text.trim().length === 0) {
        throw new Error("PDF yielded no text. It might be an image-only (scanned) PDF or encrypted.");
      }

      return data.text;
    } catch (err) {
      logger.error("PDF Parsing Error", { 
        message: err.message,
        bufferLength: dataBuffer?.length 
      });
      throw new Error(`PDF Parsing Failed: ${err.message}`);
    }
  }
}

module.exports = new PdfService();
