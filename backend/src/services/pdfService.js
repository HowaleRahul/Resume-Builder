const pdfjsLib = require('pdfjs-dist');
const logger = require('../utils/logger');

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `file://${require.resolve('pdfjs-dist/build/pdf.worker.js')}`;

/**
 * Service to handle PDF operations using PDF.js
 */
class PdfService {
  /**
   * Extracts text from a PDF buffer
   * @param {Buffer} dataBuffer
   * @returns {Promise<string>}
   */
  async extractText(dataBuffer) {
    try {
      // Load the PDF document
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(dataBuffer),
        verbosity: 0 // Reduce console output
      });

      const pdf = await loadingTask.promise;
      let fullText = '';

      // Extract text from each page
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        // Combine all text items from the page
        const pageText = textContent.items
          .map(item => item.str)
          .join(' ');

        fullText += pageText + '\n';
      }

      return fullText.trim();
    } catch (err) {
      logger.error("PDF Parsing Error", { error: err.message });
      throw new Error("Failed to parse PDF file. Ensure it is a valid PDF.");
    }
  }
}

module.exports = new PdfService();
