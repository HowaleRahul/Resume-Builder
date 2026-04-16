const logger = require('../utils/logger');
const StructurePreservingParser = require('./structurePreservingParser');

/**
 * Parses raw LaTeX code into structured JSON data while preserving original structure.
 * 
 * Key Feature: Stores the original LaTeX structure so that when data is edited 
 * and regenerated, only values change - the formatting/structure stays the same.
 */
async function parseLatex(latexCode) {
    logger.info('Parsing LaTeX with structure preservation...');
    
    // Use the structure-preserving parser
    const result = StructurePreservingParser.parse(latexCode);
    
    logger.info('LaTeX parsed successfully with structure preserved');
    return result;
}

module.exports = { parseLatex };
