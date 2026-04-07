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
    const { name, email, phone, location } = json.personal;
    if (name) {
      const parts = name.split(' ');
      latex += `\\name{${parts[0] || ''}}{${parts.slice(1).join(' ') || ''}}\n`;
    }
    if (phone) latex += `\\phone[mobile]{${escapeLatex(phone)}}\n`;
    if (email) latex += `\\email{${escapeLatex(email)}}\n`;
    if (location) latex += `\\address{${escapeLatex(location)}}{}\n`;
  }

  latex += `\n\\begin{document}\n\\makecvtitle\n\n`;

  // Education
  if (json.education && json.education.length > 0) {
    latex += `\\section{Education}\n`;
    json.education.forEach(edu => {
      latex += `\\cventry{${escapeLatex(edu.date || '')}}{${escapeLatex(edu.title || '')}}{${escapeLatex(edu.companyOrInst || '')}}{${escapeLatex(edu.location || '')}}{${escapeLatex(edu.details || '')}}{${escapeLatex(edu.description || '')}}\n`;
    });
    latex += `\n`;
  }

  // Experience
  if (json.experience && json.experience.length > 0) {
    latex += `\\section{Experience}\n`;
    json.experience.forEach(exp => {
      latex += `\\cventry{${escapeLatex(exp.date || '')}}{${escapeLatex(exp.title || '')}}{${escapeLatex(exp.companyOrInst || '')}}{${escapeLatex(exp.location || '')}}{${escapeLatex(exp.details || '')}}{`;
      if (exp.bullets && exp.bullets.length > 0) {
         latex += `\\begin{itemize} `;
         exp.bullets.forEach(b => {
           if (b.trim()) latex += `\\item ${escapeLatex(b.trim())} `;
         });
         latex += `\\end{itemize}`;
      } else if (exp.description) {
         // Fallback legacy support
         latex += `${escapeLatex(exp.description)}`;
      }
      latex += `}\n`;
    });
    latex += `\n`;
  }

  // Projects
  if (json.projects && json.projects.length > 0) {
    latex += `\\section{Projects}\n`;
    json.projects.forEach(proj => {
      latex += `\\cventry{${escapeLatex(proj.date || '')}}{${escapeLatex(proj.title || '')}}{${escapeLatex(proj.companyOrInst || '')}}{${escapeLatex(proj.location || '')}}{${escapeLatex(proj.details || '')}}{`;
      if (proj.bullets && proj.bullets.length > 0) {
         latex += `\\begin{itemize} `;
         proj.bullets.forEach(b => {
           if (b.trim()) latex += `\\item ${escapeLatex(b.trim())} `;
         });
         latex += `\\end{itemize}`;
      } else if (proj.description) {
         latex += `${escapeLatex(proj.description)}`;
      }
      latex += `}\n`;
    });
    latex += `\n`;
  }

  // Skills
  if (json.skills && json.skills.length > 0) {
    latex += `\\section{Skills}\n`;
    const skillList = json.skills.map(s => escapeLatex(s.text)).join(', ');
    latex += `\\cvitem{}{${skillList}}\n`;
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
