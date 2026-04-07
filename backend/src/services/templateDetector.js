/**
 * Analyzes raw LaTeX to determine the underlying template.
 * Supported: 'moderncv', 'awesome-cv', 'standard'
 */
function detectTemplate(latexCode) {
  if (!latexCode) return 'standard';

  // Check document class
  if (latexCode.includes('\\documentclass[11pt,a4paper,sans]{moderncv}') || latexCode.includes('\\moderncvstyle')) {
    return 'moderncv';
  }
  
  if (latexCode.includes('{awesome-cv}')) {
    return 'awesome-cv';
  }

  // Fallback
  return 'standard';
}

module.exports = { detectTemplate };
