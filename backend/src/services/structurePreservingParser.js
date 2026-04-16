const logger = require('../utils/logger');

/**
 * Smart LaTeX Parser that preserves structure while extracting data
 * 
 * When parsing: Extracts both DATA and STRUCTURE
 * When regenerating: Uses same structure, updates only changed values
 * 
 * Example:
 * Original: \name{John}{Doe}
 * Parsed:   { name: "John Doe", structure: "\name{%name_first%}{%name_last%}" }
 * Edited:   { name: "Jane Smith" }
 * Regen:    \name{Jane}{Smith}
 */

class StructurePreservingParser {
  /**
   * Parse LaTeX while preserving its original structure as a template
   */
  static parse(latexCode) {
    const result = {
      personal: { name: "", email: "", phone: "", location: "" },
      summary: "",
      experience: [],
      education: [],
      skills: [],
      projects: [],
      latexStructure: latexCode  // ← Store original structure
    };

    if (!latexCode || typeof latexCode !== 'string') return result;

    // Extract name
    const nameMatch = latexCode.match(/\\name{([^}]*)}{([^}]*)}/);
    if (nameMatch) {
      result.personal.name = nameMatch[1] + (nameMatch[2] ? ' ' + nameMatch[2] : '');
    }

    // Extract email
    const emailMatch = latexCode.match(/\\email{([^}]*)}/);
    if (emailMatch) result.personal.email = emailMatch[1];

    // Extract phone
    const phoneMatch = latexCode.match(/\\phone(?:\[[^\]]*\])?{([^}]*)}/);
    if (phoneMatch) result.personal.phone = phoneMatch[1];

    // Extract location
    const locationMatch = latexCode.match(/\\(?:location|address){([^}]*)}/);
    if (locationMatch) result.personal.location = locationMatch[1];

    // Extract sections
    const sectionRegex = /\\section{([^}]+)}([\s\S]*?)(?=\\section{|\Z)/g;
    let sectionMatch;

    while ((sectionMatch = sectionRegex.exec(latexCode)) !== null) {
      const secTitle = sectionMatch[1].trim().toLowerCase();
      const secContent = sectionMatch[2].trim();

      if (secTitle.includes('summary') || secTitle.includes('objective')) {
        result.summary = this.extractPlainText(secContent);
      } else if (secTitle.includes('education')) {
        result.education = this.extractCventries(secContent);
      } else if (secTitle.includes('experience') || secTitle.includes('work')) {
        result.experience = this.extractCventries(secContent);
      } else if (secTitle.includes('project')) {
        result.projects = this.extractCventries(secContent);
      } else if (secTitle.includes('skill')) {
        result.skills = this.extractSkills(secContent);
      }
    }

    return result;
  }

  /**
   * Extract plain text from section content
   */
  static extractPlainText(content) {
    return content
      .replace(/\\textbf{([^}]*)}/g, '$1')
      .replace(/\\textit{([^}]*)}/g, '$1')
      .replace(/\\underline{([^}]*)}/g, '$1')
      .replace(/\\\\/g, '\n')
      .trim();
  }

  /**
   * Extract cventry blocks: \cventry{date}{title}{company}{location}{details}{extra}
   */
  static extractCventries(content) {
    const items = [];
    const cventryRegex = /\\cventry{([^}]*)}{([^}]*)}{([^}]*)}{([^}]*)}{([^}]*)}{([^}]*)}/g;
    let match;

    while ((match = cventryRegex.exec(content)) !== null) {
      items.push({
        date: match[1].trim(),
        title: match[2].trim(),
        companyOrInst: match[3].trim(),
        location: match[4].trim(),
        details: match[5].trim(),
        bullets: this.extractBullets(match[5])
      });
    }

    return items;
  }

  /**
   * Extract bullet points from itemize environment
   */
  static extractBullets(text) {
    const bullets = [];
    const bulletRegex = /\\item\s+([^\n\\]*?)(?=\\item|\s*\\end{itemize}|$)/g;
    let match;

    while ((match = bulletRegex.exec(text)) !== null) {
      const bullet = match[1].trim();
      if (bullet) bullets.push(bullet);
    }

    return bullets;
  }

  /**
   * Extract skills
   */
  static extractSkills(content) {
    const skills = [];
    const skillRegex = /\\cvitem{([^}]*)}{([^}]*)}/g;
    let match;

    while ((match = skillRegex.exec(content)) !== null) {
      skills.push({
        category: match[1].trim(),
        items: match[2].split(',').map(item => item.trim())
      });
    }

    return skills;
  }

  /**
   * Regenerate LaTeX from parsed data using the original structure
   * Only values change, structure is preserved
   */
  static regenerate(parsedData) {
    let latex = parsedData.latexStructure || this.generateDefault(parsedData);

    // Update name only if changed
    if (parsedData.personal?.name) {
      const nameParts = parsedData.personal.name.split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Replace only the values inside \name{...}{...}
      latex = latex.replace(
        /\\name{[^}]*}{[^}]*}/,
        `\\name{${firstName}}{${lastName}}`
      );
    }

    // Update email only
    if (parsedData.personal?.email) {
      latex = latex.replace(
        /\\email{[^}]*}/,
        `\\email{${parsedData.personal.email}}`
      );
    }

    // Update phone only
    if (parsedData.personal?.phone) {
      latex = latex.replace(
        /\\phone(?:\[[^\]]*\])?{[^}]*}/,
        `\\phone[mobile]{${parsedData.personal.phone}}`
      );
    }

    // Update location only and preserve original macro name
    if (parsedData.personal?.location) {
      latex = latex.replace(
        /\\(location|address){[^}]*}/,
        (match, command) => `\\${command}{${parsedData.personal.location}}`
      );
    }

    // Update summary/objective section while preserving section title
    if (parsedData.summary) {
      const summarySectionRegex = /\\section{(Summary|Objective)}[\s\S]*?(?=\\section|\\end{document}|$)/;
      latex = latex.replace(summarySectionRegex, (match, heading) => {
        return `\\section{${heading}}\n${parsedData.summary}\n\n`;
      });
    }

    // Update experience entries - preserve original formatting, update values in-place
    if (parsedData.experience && parsedData.experience.length > 0) {
      const expSectionRegex = /(\\section{(?:Experience|Work)[^}]*})([\s\S]*?)(?=\\section|\\end{document}|$)/;
      latex = latex.replace(expSectionRegex, (fullMatch, heading, contentPart) => {
        // For each experience entry in original, find and update its corresponding entry from new data
        let updatedContent = contentPart;
        
        // Find all cventry blocks in the original
        const cventryRegex = /\\cventry{([^}]*)}{([^}]*)}{([^}]*)}{([^}]*)}{([^}]*)}{([^}]*)}/g;
        let cventryMatch;
        let expIndex = 0;
        
        updatedContent = updatedContent.replace(cventryRegex, (match) => {
          if (expIndex < parsedData.experience.length) {
            const exp = parsedData.experience[expIndex];
            const bullets = exp.bullets?.map(b => `\\item ${b}`).join('\n') || '';
            expIndex++;
            return `\\cventry{${exp.date}}{${exp.title}}{${exp.companyOrInst}}{${exp.location}}{${bullets}}{}`;
          }
          return match; // Return original if no matching data
        });
        
        return `${heading}${updatedContent}`;
      });
    }

    // Update education entries similarly
    if (parsedData.education && parsedData.education.length > 0) {
      const eduSectionRegex = /(\\section{Education|Academic[^}]*})([\s\S]*?)(?=\\section|\\end{document}|$)/;
      latex = latex.replace(eduSectionRegex, (fullMatch, heading, contentPart) => {
        let updatedContent = contentPart;
        
        const cventryRegex = /\\cventry{([^}]*)}{([^}]*)}{([^}]*)}{([^}]*)}{([^}]*)}{([^}]*)}/g;
        let eduIndex = 0;
        
        updatedContent = updatedContent.replace(cventryRegex, (match) => {
          if (eduIndex < parsedData.education.length) {
            const edu = parsedData.education[eduIndex];
            eduIndex++;
            return `\\cventry{${edu.date}}{${edu.title}}{${edu.companyOrInst}}{${edu.location}}{${edu.details}}{}`;
          }
          return match;
        });
        
        return `${heading}${updatedContent}`;
      });
    }

    // Update projects similarly
    if (parsedData.projects && parsedData.projects.length > 0) {
      const projSectionRegex = /(\\section{Projects?[^}]*})([\s\S]*?)(?=\\section|\\end{document}|$)/;
      latex = latex.replace(projSectionRegex, (fullMatch, heading, contentPart) => {
        let updatedContent = contentPart;
        
        const cventryRegex = /\\cventry{([^}]*)}{([^}]*)}{([^}]*)}{([^}]*)}{([^}]*)}{([^}]*)}/g;
        let projIndex = 0;
        
        updatedContent = updatedContent.replace(cventryRegex, (match) => {
          if (projIndex < parsedData.projects.length) {
            const proj = parsedData.projects[projIndex];
            const bullets = proj.bullets?.map(b => `\\item ${b}`).join('\n') || '';
            projIndex++;
            return `\\cventry{}{${proj.title}}{${proj.techStack}}{}{${bullets}}{}`;
          }
          return match;
        });
        
        return `${heading}${updatedContent}`;
      });
    }

    // Update skills similarly
    if (parsedData.skills && parsedData.skills.length > 0) {
      const skillSectionRegex = /(\\section{Skills[^}]*})([\s\S]*?)(?=\\section|\\end{document}|$)/;
      latex = latex.replace(skillSectionRegex, (fullMatch, heading, contentPart) => {
        let updatedContent = contentPart;
        
        const cvitemRegex = /\\cvitem{([^}]*)}{([^}]*)}/g;
        let skillIndex = 0;
        
        updatedContent = updatedContent.replace(cvitemRegex, (match) => {
          if (skillIndex < parsedData.skills.length) {
            const skill = parsedData.skills[skillIndex];
            skillIndex++;
            const items = skill.items?.join(', ') || '';
            return `\\cvitem{${skill.category}}{${items}}`;
          }
          return match;
        });
        
        return `${heading}${updatedContent}`;
      });
    }

    logger.info('LaTeX regenerated with preserved structure');
    return latex;
  }

  /**
   * Generate default LaTeX if no structure was stored
   */
  static generateDefault(parsedData) {
    let latex = `\\documentclass[11pt,a4paper,sans]{moderncv}
\\moderncvstyle{classic}
\\moderncvcolor{blue}
\\usepackage[scale=0.75]{geometry}
\\usepackage{enumitem}

`;

    if (parsedData.personal?.name) {
      const nameParts = parsedData.personal.name.split(/\s+/);
      const firstName = nameParts[0] || 'Professional';
      const lastName = nameParts.slice(1).join(' ') || 'Candidate';
      latex += `\\name{${firstName}}{${lastName}}\\n`;
    }

    if (parsedData.personal?.phone) {
      latex += `\\phone[mobile]{${parsedData.personal.phone}}\\n`;
    }

    if (parsedData.personal?.email) {
      latex += `\\email{${parsedData.personal.email}}\\n`;
    }

    latex += `\\n\\begin{document}\\n\\makecvtitle\\n\\n`;

    if (parsedData.summary) {
      latex += `\\section{Summary}\\n${parsedData.summary}\\n\\n`;
    }

    latex += `\\end{document}`;
    return latex;
  }
}

module.exports = StructurePreservingParser;
