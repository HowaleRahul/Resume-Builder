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
      const data = await pdf(dataBuffer);
      return data.text;
    } catch (err) {
      logger.error("PDF Parsing Error", { 
        message: err.message,
        stack: err.stack,
        bufferLength: dataBuffer?.length 
      });
      throw new Error(`PDF Parsing Failed: ${err.message}`);
    }
  }
}

module.exports = new PdfService();
