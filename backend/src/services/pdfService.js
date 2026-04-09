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
      const data = await pdf(dataBuffer);
      return data.text;
    } catch (err) {
      logger.error("PDF Parsing Error", { error: err.message });
      throw new Error("Failed to parse PDF file. Ensure it is a valid PDF.");
    }
  }
}

module.exports = new PdfService();
