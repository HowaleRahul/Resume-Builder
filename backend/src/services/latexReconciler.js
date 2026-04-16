const logger = require('../utils/logger');

/**
 * Intelligently manages LaTeX regeneration while preserving original fidelity.
 * 
 * Strategy:
 * 1. If no edits were made to parsed data → USE ORIGINAL LATEX
 * 2. If minor edits were made → Merge changes into original structure
 * 3. If major edits were made → Generate new LaTeX with enhanced preservation
 */

class LatexReconciler {
  /**
   * Determine if the parsed and regenerated data are significantly different
   */
  static hasSignificantChanges(originalData, editedData) {
    const fields = ['personal', 'summary', 'experience', 'education', 'projects', 'skills'];
    
    for (let field of fields) {
      const orig = JSON.stringify(originalData[field] || {});
      const edited = JSON.stringify(editedData[field] || {});
      
      if (orig !== edited) {
        // More than 20% change indicates significant edit
        const origLen = orig.length;
        const editLen = edited.length;
        const change = Math.abs(origLen - editLen) / Math.max(origLen, editLen);
        
        if (change > 0.2) {
          logger.info(`Significant changes detected in ${field}`);
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * Determine which LaTeX to use for PDF generation
   */
  static selectLatexForPdf(resumeData) {
    // Priority: Use original LaTeX if available (preserves formatting)
    if (resumeData.originalLatexCode && resumeData.originalLatexCode.trim().length > 100) {
      logger.info('Using original LaTeX for PDF (fidelity preservation)');
      return resumeData.originalLatexCode;
    }

    // Fallback: Use generated LaTeX
    if (resumeData.generatedLatexCode) {
      logger.info('Using generated LaTeX for PDF');
      return resumeData.generatedLatexCode;
    }

    logger.warn('No LaTeX source available');
    return null;
  }

  /**
   * Preserve original LaTeX structure while updating specific content
   * This is better than total regeneration as it maintains formatting
   */
  static mergeEditsIntoOriginal(originalLatex, editedData) {
    let mergedLatex = originalLatex;

    // Update personal info if changed
    if (editedData.personal?.name) {
      const nameParts = editedData.personal.name.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Replace name commands while preserving surrounding LaTeX
      mergedLatex = mergedLatex.replace(
        /\\name{[^}]*}{[^}]*}/,
        `\\name{${firstName}}{${lastName}}`
      );
    }

    // Update email
    if (editedData.personal?.email) {
      mergedLatex = mergedLatex.replace(
        /\\email{[^}]*}/,
        `\\email{${editedData.personal.email}}`
      );
    }

    // Update phone
    if (editedData.personal?.phone) {
      mergedLatex = mergedLatex.replace(
        /\\phone(?:\[[^\]]*\])?{[^}]*}/,
        `\\phone[mobile]{${editedData.personal.phone}}`
      );
    }

    logger.info('Merged edits into original LaTeX structure');
    return mergedLatex;
  }

  /**
   * Get the best LaTeX source considering edit history and data integrity
   */
  static getBestLatexSource(resumeData, parsedData, generatedLatex) {
    // Check if there are actual edits
    const hasChanges = this.hasSignificantChanges(parsedData, parsedData);
    
    if (!hasChanges && resumeData.originalLatexCode) {
      // No significant changes - prefer original for fidelity
      return resumeData.originalLatexCode;
    }

    // If there are edits, try to merge them into original
    if (resumeData.originalLatexCode && generatedLatex) {
      try {
        return this.mergeEditsIntoOriginal(resumeData.originalLatexCode, parsedData);
      } catch (error) {
        logger.warn('Failed to merge edits, using generated LaTeX', { error: error.message });
        return generatedLatex;
      }
    }

    // Fallback to generated LaTeX
    return generatedLatex;
  }
}

module.exports = LatexReconciler;
