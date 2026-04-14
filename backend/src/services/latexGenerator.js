/**
 * Generates standard LaTeX code from JSON resume data.
 */
function generateLatex(json, template = 'moderncv') {
  if (template === 'standard') return generateStandard(json);
  if (template === 'awesome-cv') return generateAwesomeCV(json);

  // Default: Base preamble for a moderncv template
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
    json.skills.forEach(skillCat => {
        const items = (skillCat.items || []).join(', ');
        if (items) {
            latex += `\\cvitem{${escapeLatex(skillCat.category)}}{${escapeLatex(items)}}\n`;
        }
    });
    latex += `\n`;
  }

  latex += `\\end{document}\n`;
  return latex;
}


/**
 * Escapes characters that are special in LaTeX.
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

/**
 * Generates Standard Article style LaTeX code.
 */
function generateStandard(json) {
  let latex = `\\documentclass[10pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\geometry{a4paper, margin=1in}
\\usepackage{titlesec}
\\titleformat{\\section}{\\large\\bfseries}{}{0em}{}[\\titlerule]
\\begin{document}
\\begin{center}
`;
  if (json.personal) {
     if (json.personal.name) latex += `{\\huge \\textbf{${escapeLatex(json.personal.name)}}} \\\\[0.5em]\n`;
     latex += `${escapeLatex(json.personal.email || '')} | ${escapeLatex(json.personal.phone || '')} | ${escapeLatex(json.personal.location || '')}\n`;
  }
  latex += `\\end{center}\n\n`;

  if (json.education && json.education.length > 0) {
    latex += `\\section*{Education}\n\\begin{itemize}\n`;
    json.education.forEach(edu => {
      latex += `\\item \\textbf{${escapeLatex(edu.title || '')}}, ${escapeLatex(edu.companyOrInst || '')} \\hfill ${escapeLatex(edu.date || '')}\n`;
    });
    latex += `\\end{itemize}\n\n`;
  }

  if (json.experience && json.experience.length > 0) {
    latex += `\\section*{Experience}\n`;
    json.experience.forEach(exp => {
      latex += `\\noindent \\textbf{${escapeLatex(exp.title || '')}} \\hfill ${escapeLatex(exp.date || '')} \\\\
\\textit{${escapeLatex(exp.companyOrInst || '')}} \\hfill ${escapeLatex(exp.location || '')}
`;
      if (exp.bullets && exp.bullets.length > 0) {
        latex += `\\begin{itemize} \n`;
        exp.bullets.forEach(b => {
           if (b.trim()) latex += `\\item ${escapeLatex(b.trim())}\n`;
        });
        latex += `\\end{itemize}\n`;
      } else if (exp.description) {
         // legacy support
         latex += `${escapeLatex(exp.description)}\n`;
      }
      latex += `\\vspace{0.5em}\n`;
    });
  }

  latex += `\\end{document}\n`;
  return latex;
}

/**
 * Generates Awesome-CV style LaTeX code.
 */
function generateAwesomeCV(json) {
  let latex = `\\documentclass[11pt, a4paper]{awesome-cv}
\\geometry{left=1.4cm, top=.8cm, right=1.4cm, bottom=1.8cm, footskip=.5cm}
\\fontdir[fonts/]
\\colorlet{awesome}{awesome-red}
\\setbool{acvSectionColorHighlight}{true}
`;
  if (json.personal) {
     const parts = (json.personal.name || '').split(' ');
     latex += `\\name{${parts[0] || ''}}{${parts.slice(1).join(' ') || ''}}\n`;
     if (json.personal.phone) latex += `\\mobile{${escapeLatex(json.personal.phone)}}\n`;
     if (json.personal.email) latex += `\\email{${escapeLatex(json.personal.email)}}\n`;
     if (json.personal.location) latex += `\\position{${escapeLatex(json.personal.location)}}\n`;
  }
  latex += `\\begin{document}\n\\makecvheader\n\\makecvfooter{\\today}{${escapeLatex(json.personal?.name || '')}~~~·~~~Resume}{\\thepage}\n\n`;

  if (json.experience && json.experience.length > 0) {
    latex += `\\cvsection{Work Experience}\n\\begin{cventries}\n`;
    json.experience.forEach(exp => {
      latex += `  \\cventry\n    {${escapeLatex(exp.title || '')}}\n    {${escapeLatex(exp.companyOrInst || '')}}\n    {${escapeLatex(exp.location || '')}}\n    {${escapeLatex(exp.date || '')}}\n    {`;
      if (exp.bullets && exp.bullets.length > 0) {
         latex += `\n      \\begin{cvitems}\n`;
         exp.bullets.forEach(b => {
             if (b.trim()) latex += `        \\item {${escapeLatex(b.trim())}}\n`;
         });
         latex += `      \\end{cvitems}\n    }\n`;
      } else if (exp.description) {
         latex += `\n      \\begin{cvitems}\n        \\item {${escapeLatex(exp.description)}}\n      \\end{cvitems}\n    }\n`;
      } else {
         latex += `}\n`;
      }
    });
    latex += `\\end{cventries}\n\n`;
  }

  latex += `\\end{document}\n`;
  return latex;
}

module.exports = { generateLatex };
