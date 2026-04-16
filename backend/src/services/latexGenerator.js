const logger = require('../utils/logger');
const StructurePreservingParser = require('./structurePreservingParser');

/**
 * STRUCTURE-PRESERVING LATEX GENERATION
 * 
 * Key Principle: If user parses LaTeX and edits data in visual editor,
 * the regenerated LaTeX should only have VALUES changed, NOT the structure.
 * 
 * This ensures the original formatting/styling is preserved!
 */

function generateLatex(json, template = 'moderncv') {
  // If structure is preserved from original LaTeX, use it
  if (json.latexStructure) {
    logger.info('✅ Regenerating LaTeX with PRESERVED STRUCTURE - only values changed');
    return StructurePreservingParser.regenerate(json);
  }

  // Fallback: Generate standard LaTeX when no original structure exists
  logger.info('📝 Generating standard LaTeX template');
  return generateStandardLatex(json);
}

/**
 * Generate standard LaTeX code from JSON resume data.
 * Used when no original structure is available (new resumes).
 */
function generateStandardLatex(json) {
  let latex = `\\documentclass[11pt,a4paper,sans]{moderncv}
\\moderncvstyle{classic}
\\moderncvcolor{blue}
\\usepackage[scale=0.75]{geometry}
\\usepackage{enumitem}

`;

  // Personal Info
  if (json.personal) {
    const name = json.personal.name || 'Professional Candidate';
    const email = json.personal.email || '';
    const phone = json.personal.phone || '';
    const location = json.personal.location || '';
    
    // Split name safely
    const parts = name.trim().split(/\s+/);
    const firstName = parts[0] || 'Professional';
    const lastName = parts.slice(1).join(' ') || 'Candidate';
    latex += `\\name{${escapeLatex(firstName)}}{${escapeLatex(lastName)}}\n`;
    
    if (phone) latex += `\\phone[mobile]{${escapeLatex(phone)}}\n`;
    if (email) latex += `\\email{${escapeLatex(email)}}\n`;
    if (location) latex += `\\address{${escapeLatex(location)}}{}\n`;
  } else {
    latex += `\\name{Professional}{Candidate}\n`;
  }

  latex += `\n\\begin{document}\n\\makecvtitle\n\n`;

  // Summary
  if (json.summary) {
    latex += `\\section{Summary}\n${escapeLatex(json.summary)}\n\n`;
  }

  // Education
  if (json.education && json.education.length > 0) {
    latex += `\\section{Education}\n`;
    json.education.forEach(edu => {
      if (!edu.title && !edu.companyOrInst) return;
      latex += `\\cventry{${escapeLatex(edu.date || '')}}{${escapeLatex(edu.title || '')}}{${escapeLatex(edu.companyOrInst || '')}}{${escapeLatex(edu.location || '')}}{${escapeLatex(edu.details || '')}}{}\n`;
    });
    latex += `\n`;
  }

  // Experience
  if (json.experience && json.experience.length > 0) {
    latex += `\\section{Experience}\n`;
    json.experience.forEach(exp => {
      if (!exp.title && !exp.companyOrInst) return;
      latex += `\\cventry{${escapeLatex(exp.date || '')}}{${escapeLatex(exp.title || '')}}{${escapeLatex(exp.companyOrInst || '')}}{${escapeLatex(exp.location || '')}}{}{`;
      if (exp.bullets && exp.bullets.length > 0) {
         latex += `\\begin{itemize} `;
         exp.bullets.forEach(b => {
           if (b && b.trim()) latex += `\\item ${escapeLatex(b.trim())} `;
         });
         latex += `\\end{itemize}`;
      }
      latex += `}\n`;
    });
    latex += `\n`;
  }

  // Projects
  if (json.projects && json.projects.length > 0) {
    latex += `\\section{Projects}\n`;
    json.projects.forEach(proj => {
      latex += `\\cventry{}{${escapeLatex(proj.title || '')}}{${escapeLatex(proj.techStack || '')}}{}{}{`;
      if (proj.bullets && proj.bullets.length > 0) {
         latex += `\\begin{itemize} `;
         proj.bullets.forEach(b => {
           if (b.trim()) latex += `\\item ${escapeLatex(b.trim())} `;
         });
         latex += `\\end{itemize}`;
      }
      latex += `}\n`;
    });
    latex += `\n`;
  }

  // Skills
  if (json.skills && json.skills.length > 0) {
    latex += `\\section{Skills}\n`;
    json.skills.forEach(skill => {
        if (skill.category && Array.isArray(skill.items)) {
            const items = skill.items.join(', ');
            if (items) latex += `\\cvitem{${escapeLatex(skill.category)}}{${escapeLatex(items)}}\n`;
        } else if (skill.text) {
            latex += `\\cvitem{}{${escapeLatex(skill.text)}}\n`;
        }
    });
    latex += `\n`;
  }

  latex += `\\end{document}\n`;
  return latex;
}

/**
 * Escapes special LaTeX characters
 */
function escapeLatex(str) {
  if (!str) return '';
  return String(str)
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/{/g, '\\{')
    .replace(/}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

module.exports = { generateLatex };
