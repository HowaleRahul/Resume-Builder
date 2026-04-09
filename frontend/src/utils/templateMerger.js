/**
 * templateMerger.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Merges visual editor data into a real LaTeX template.
 * The preamble (everything before \begin{document}) is preserved EXACTLY.
 * Only the document body is rebuilt from the user's data.
 *
 * Strategy per template type:
 *   jitin-nair   → tabularx header, joblong/jobshort environments, tabularx skills
 *   anubhav-singh → tabular* header, \resumeSubheading environments, \resumeSubItem skills
 *   fallback     → simple generic article layout
 */

/* ── helpers ─────────────────────────────────────────────────────────────── */
const esc = (str = '') =>
  String(str)
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/\^/g, '\\^{}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}');

/** Extract the preamble (everything up to AND INCLUDING \begin{document}) */
function extractPreamble(templateCode) {
  const idx = templateCode.indexOf('\\begin{document}');
  if (idx === -1) return null;
  return templateCode.slice(0, idx + '\\begin{document}'.length);
}

/* ── Generic body builder ───────────────────────────────────────────────── */
function buildGenericBody(data) {
  const p = data.personal || {};
  const name = esc(p.name || 'Your Name');
  const email = esc(p.email || 'email@example.com');
  const phone = esc(p.phone || '+00 000 000 0000');

  let body = `\\begin{document}

\\begin{center}
  {\\Huge \\scshape ${name}} \\\\[1.5ex]
  \\href{mailto:${email}}{${email}} $\\cdot$ ${phone}
\\end{center}

\\section{Experience}
`;

  if (data.experience && data.experience.length > 0) {
    data.experience.forEach(exp => {
      body += `\\textbf{${esc(exp.position || 'Position')}} at \\textbf{${esc(exp.company || 'Company')}} \\\\
${esc(exp.location || '')} \\hfill ${esc(exp.startDate || '')} -- ${esc(exp.endDate || 'Present')} \\\\
\\begin{itemize}
  \\item ${esc(exp.description || 'Description')}
\\end{itemize}

`;
    });
  }

  body += `\\section{Education}
\\textbf{Degree} at \\textbf{University} \\hfill Graduation Year

\\end{document}`;

  return body;
}

/* ── Jitin Nair body builder ─────────────────────────────────────────────── */
function buildJitinBody(data) {
  const p = data.personal || {};
  const name     = esc(p.name     || 'Your Name');
  const email    = esc(p.email    || 'email@example.com');
  const phone    = esc(p.phone    || '+00 000 000 0000');
  const location = esc(p.location || '');
  const github   = esc(p.github   || '');
  const linkedin = esc(p.linkedin || '');

  /* ── Header ── */
  const contactLines = [
    `\\href{mailto:${email}}{\\raisebox{-0.05\\height}\\faEnvelope\\ ${email}}`,
    phone ? `\\href{tel:${phone.replace(/\s/g,'')}}{\\raisebox{-0.05\\height}\\faMobile\\ ${phone}}` : '',
    location ? `\\raisebox{-0.05\\height}\\faMapMarker\\ ${location}` : '',
    github   ? `\\href{${esc(p.github)}}{\\raisebox{-0.05\\height}\\faGithub\\ ${esc(p.github).replace('https://','')}}` : '',
    linkedin ? `\\href{${esc(p.linkedin)}}{\\raisebox{-0.05\\height}\\faLinkedin\\ ${esc(p.linkedin).replace('https://','')}}` : '',
  ].filter(Boolean).join(' \\ $|$ \\\\\n');

  const header = `
\\pagestyle{empty}

\\begin{tabularx}{\\linewidth}{@{} C @{}}
\\Huge{${name}} \\\\[7.5pt]
${contactLines} \\\\
\\end{tabularx}`;

  /* ── Experience ── */
  let experienceSection = '';
  const exp = data.experience || [];
  if (exp.length) {
    const entries = exp.map(e => {
      const bullets = (e.bullets || []).filter(Boolean);
      const titleLabel = e.url ? `\\href{${esc(e.url)}}{\\underline{${esc(e.title || '')}}}` : esc(e.title || '');
      if (bullets.length === 0) {
        return `\\begin{jobshort}{${titleLabel}, ${esc(e.companyOrInst)}}{${esc(e.date)}}
\\end{jobshort}`;
      }
      return `\\begin{joblong}{${titleLabel}, ${esc(e.companyOrInst || '')}}{${esc(e.date || '')}}
${bullets.map(b => `  \\item ${esc(b)}`).join('\n')}
\\end{joblong}`;
    }).join('\n\\vspace{-2pt}\n');
    experienceSection = `
\\section{Work Experience}
${entries}`;
  }

  /* ── Education ── */
  let educationSection = '';
  const edu = data.education || [];
  if (edu.length) {
    const entries = edu.map(e => {
      const titleLabel = e.url ? `\\href{${esc(e.url)}}{\\underline{${esc(e.title || e.companyOrInst)}}}` : esc(e.title || e.companyOrInst);
      return `\\begin{tabularx}{\\linewidth}{@{}X X@{} }
{\\textbf{${titleLabel}}} & \\hfill \\normalsize{${esc(e.date)}} \\\\
${e.companyOrInst ? `${esc(e.companyOrInst)} ` : ''}${e.location ? `— ${esc(e.location)}` : ''} & \\hfill ${esc(e.details || '')} \\\\
\\end{tabularx}`;
    }).join('\n\\vspace{4pt}\n');
    educationSection = `
\\section{Education}
${entries}`;
  }

  /* ── Projects ── */
  let projectsSection = '';
  const proj = data.projects || [];
  if (proj.length) {
    const entries = proj.map(p => {
      const bullets = (p.bullets || []).filter(Boolean);
      const titleLabel = p.url ? `\\href{${esc(p.url)}}{\\underline{${esc(p.title)}}}` : esc(p.title);
      return `\\begin{joblong}{${titleLabel}}{${esc(p.date || '')}}
${bullets.map(b => `  \\item ${esc(b)}`).join('\n')}
\\end{joblong}`;
    }).join('\n\\vspace{-2pt}\n');
    projectsSection = `
\\section{Projects}
${entries}`;
  }

  /* ── Skills ── */
  let skillsSection = '';
  const rawSkills = data.skills || [];
  // Support both [{category, items[]}] and legacy [{text}]
  const normalizedSkills = rawSkills.length > 0 && rawSkills[0].category !== undefined
    ? rawSkills
    : [{ category: 'Technical Skills', items: rawSkills.map(s => s.text || String(s)) }];

  if (normalizedSkills.length) {
    const rows = normalizedSkills.map(cat =>
      `${esc(cat.category)} & ${(cat.items || []).map(esc).join(', ')} \\\\`
    ).join('\n');
    skillsSection = `
\\section{Skills}
\\begin{tabularx}{\\linewidth}{@{}l X@{}}
${rows}
\\end{tabularx}`;
  }

  return `
${header}
${experienceSection}
${educationSection}
${projectsSection}
${skillsSection}

\\vfill
\\center{\\footnotesize Last updated: \\today}

\\end{document}`;
}

/* ── Anubhav Singh body builder ─────────────────────────────────────────── */
function buildAnubhavBody(data) {
  const p = data.personal || {};
  const name     = esc(p.name     || 'Your Name');
  const email    = p.email    || 'you@email.com';
  const phone    = p.phone    || '+91-XXXX-XXXX-XXX';
  const github   = p.github   || 'github.com/yourusername';
  const linkedin = p.linkedin || 'yoursite.com';

  /* ── Header ── */
  const header = `
\\begin{tabular*}{\\textwidth}{l@{\\extracolsep{\\fill}}r}
  \\textbf{{\\LARGE ${name}}} & Email: \\href{mailto:${esc(email)}}{${esc(email)}}\\\\
  \\href{${esc(linkedin)}}{Portfolio: ${esc(linkedin.replace('https://',''))}} & Mobile:~~~${esc(phone)} \\\\
  \\href{https://${esc(github)}}{Github: ${esc(github.replace('https://',''))}} \\\\
\\end{tabular*}`;

  /* ── Education ── */
  let educationSection = '';
  const edu = data.education || [];
  if (edu.length) {
    const entries = edu.map(e => {
        const titleLink = e.url ? `\\href{${esc(e.url)}}{\\underline{${esc(e.title)}}}` : esc(e.title);
        return `    \\resumeSubheading\n      {${esc(e.companyOrInst)}}{${esc(e.location || '')}}\n      {${titleLink}}{${esc(e.date)}}`;
    }).join('\n');
    educationSection = `
%-----------EDUCATION-----------------
\\section{Education}
  \\resumeSubHeadingListStart
${entries}
    \\resumeSubHeadingListEnd`;
  }

  /* ── Skills ── */
  let skillsSection = '';
  const rawSkills = data.skills || [];
  const normalizedSkills = rawSkills.length > 0 && rawSkills[0].category !== undefined
    ? rawSkills
    : [{ category: 'Technical Skills', items: rawSkills.map(s => s.text || String(s)) }];
  if (normalizedSkills.length) {
    const items = normalizedSkills.map(cat =>
      `  \\resumeSubItem{${esc(cat.category)}}{${(cat.items || []).map(esc).join(', ')}}`
    ).join('\n');
    skillsSection = `
\\vspace{-5pt}
\\section{Skills Summary}
  \\resumeSubHeadingListStart
${items}
  \\resumeSubHeadingListEnd`;
  }

  /* ── Experience ── */
  let experienceSection = '';
  const exp = data.experience || [];
  if (exp.length) {
    const entries = exp.map(e => {
      const bullets = (e.bullets || []).filter(Boolean);
      const companyLink = e.url ? `\\href{${esc(e.url)}}{\\underline{${esc(e.companyOrInst || '')}}}` : esc(e.companyOrInst || '');
      return `    \\resumeSubheading{${companyLink}}{${esc(e.location || '')}}
    {${esc(e.title || '')}}{${esc(e.date || '')}}
    \\resumeItemListStart
${bullets.map(b => `        \\resumeItem{Achievement}{${esc(b)}}`).join('\n')}
      \\resumeItemListEnd`;
    }).join('\n');
    experienceSection = `
\\vspace{-5pt}
\\section{Experience}
  \\resumeSubHeadingListStart
${entries}
  \\resumeSubHeadingListEnd`;
  }

  /* ── Projects ── */
  let projectsSection = '';
  const proj = data.projects || [];
  if (proj.length) {
    const items = proj.map(pr => {
      const stack = pr.location || '';
      const desc  = (pr.bullets || []).filter(Boolean).join(' ');
      const titleLink = pr.url ? `\\href{${esc(pr.url)}}{\\underline{${esc(pr.title)}}}` : esc(pr.title);
      return `\\resumeSubItem{${titleLink}${stack ? ` (${esc(stack)})` : ''}}{${esc(desc)} (${esc(pr.date || '')})}`;
    }).join('\n');
    projectsSection = `
%-----------PROJECTS-----------------
\\vspace{-5pt}
\\section{Projects}
\\resumeSubHeadingListStart
${items}
\\resumeSubHeadingListEnd`;
  }

  return `
${header}
${educationSection}
${skillsSection}
${experienceSection}
${projectsSection}

\\end{document}`;
}

/* ── Jake Gutierrez body builder ─────────────────────────────────────────── */
function buildJakeBody(data) {
  const p = data.personal || {};
  const name = esc(p.name || 'Your Name');
  const email = esc(p.email || 'x@x.com');
  const phone = esc(p.phone || '123-456-7890');
  const linkedin = esc(p.linkedin || 'linkedin.com/in/yourprofile');
  const github = esc(p.github || 'github.com/yourgithub');

  const header = `
\\begin{center}
    \\textbf{\\Huge \\scshape ${name}} \\\\ \\vspace{1pt}
    \\small ${phone} $|$ \\href{mailto:${email}}{\\underline{${email}}} $|$
    \\href{${linkedin}}{\\underline{${linkedin.replace('https://','')}}} $|$
    \\href{${github}}{\\underline{${github.replace('https://','')}}}
\\end{center}`;

  let sections = [];

  // Education
  const edu = data.education || [];
  if (edu.length) {
    const entries = edu.map(e => {
        const companyLabel = e.url ? `\\href{${esc(e.url)}}{\\underline{${esc(e.companyOrInst)}}}` : esc(e.companyOrInst);
        return `    \\resumeSubheading\n      {${companyLabel}}{${esc(e.location||'')}}\n      {${esc(e.title)}}{${esc(e.date)}}`;
    }).join('\n');
    sections.push(`\\section{Education}\n  \\resumeSubHeadingListStart\n${entries}\n  \\resumeSubHeadingListEnd`);
  }

  const exp = data.experience || [];
  if (exp.length) {
    const entries = exp.map(e => {
      const bullets = (e.bullets || []).filter(Boolean);
      const companyLabel = e.url ? `\\href{${esc(e.url)}}{\\underline{${esc(e.companyOrInst)}}}` : esc(e.companyOrInst);
      return `    \\resumeSubheading\n      {${esc(e.title)}}{${esc(e.date)}}\n      {${companyLabel}}{${esc(e.location||'')}}\n      \\resumeItemListStart\n${bullets.map(b => `        \\resumeItem{${esc(b)}}`).join('\n')}\n      \\resumeItemListEnd`;
    }).join('\n');
    sections.push(`\\section{Experience}\n  \\resumeSubHeadingListStart\n${entries}\n  \\resumeSubHeadingListEnd`);
  }

  const proj = data.projects || [];
  if (proj.length) {
    const entries = proj.map(pr => {
      const bullets = (pr.bullets || []).filter(Boolean);
      const titleLabel = pr.url ? `\\href{${esc(pr.url)}}{\\underline{${esc(pr.title)}}}` : esc(pr.title);
      return `      \\resumeProjectHeading\n          {\\textbf{${titleLabel}} $|$ \\emph{${esc(pr.location||'')}}}{${esc(pr.date)}}\n          \\resumeItemListStart\n${bullets.map(b => `            \\resumeItem{${esc(b)}}`).join('\n')}\n          \\resumeItemListEnd`;
    }).join('\n');
    sections.push(`\\section{Projects}\n    \\resumeSubHeadingListStart\n${entries}\n    \\resumeSubHeadingListEnd`);
  }

  // Skills
  const rawSkills = data.skills || [];
  if (rawSkills.length) {
    const skillLines = rawSkills.map(s => `     \\textbf{${esc(s.category)}}{: ${(s.items || []).map(esc).join(', ')}}`).join(' \\\\\n');
    sections.push(`\\section{Technical Skills}\n \\begin{itemize}[leftmargin=0.15in, label={}]\n    \\small{\\item{\n${skillLines}\n    }}\n \\end{itemize}`);
  }

  return `\n${header}\n\n${sections.join('\n\n')}\n\n\\end{document}`;
}

/* ── Two-Column body builder ────────────────────────────────────────────── */
function buildTwoColumnBody(data) {
  const p = data.personal || {};
  const name = esc(p.name || 'Your Name');
  const header = `{\\centering\n  {\\LARGE\\bfseries\\color{headingcolor} ${name}}\\\\[4pt]\n  \\href{mailto:${esc(p.email)}}{${esc(p.email)}} \\quad|\\quad\n  ${esc(p.phone)} \\quad|\\quad\n  \\href{${esc(p.linkedin)}}{${esc(p.linkedin).replace('https://','')}} \\quad|\\quad\n  \\href{${esc(p.github)}}{${esc(p.github).replace('https://','')}}\\\\[2pt]\n  ${esc(p.location)}\\\\[2pt]\n  \\color{rulecolor}\\rule{\\linewidth}{1.5pt}\n\\par}\\vspace{6pt}`;

  const leftCol = [];
  const exp = data.experience || [];
  if (exp.length) {
    const entries = exp.map(e => {
        const titleLabel = e.url ? `\\href{${esc(e.url)}}{\\underline{${esc(e.title)}}}` : esc(e.title);
        return `\\entry{${titleLabel}}{${esc(e.date)}}{${esc(e.companyOrInst)}}{${esc(e.location)}}\n\\begin{itemize}\n${(e.bullets||[]).map(b => `  \\item ${esc(b)}`).join('\n')}\n\\end{itemize}`;
    }).join('\n\\vspace{6pt}\n');
    leftCol.push(`\\section{Experience}\n${entries}`);
  }
  const proj = data.projects || [];
  if (proj.length) {
    const entries = proj.map(pr => {
        const titleLabel = pr.url ? `\\href{${esc(pr.url)}}{\\underline{${esc(pr.title)}}}` : esc(pr.title);
        return `\\textbf{${titleLabel}} \\textit{(${esc(pr.location)})}\\\\\n\\begin{itemize}\n${(pr.bullets||[]).map(b => `  \\item ${esc(b)}`).join('\n')}\n\\end{itemize}`;
    }).join('\n\\vspace{4pt}\n');
    leftCol.push(`\\section{Projects}\n${entries}`);
  }

  const rightCol = [];
  const edu = data.education || [];
  if (edu.length) {
    const entries = edu.map(e => `\\textbf{${esc(e.title)}}\\\\\n${esc(e.companyOrInst)}\\\\\n\\textit{${esc(e.location)}}\\\\\n${esc(e.date)} \\quad ${esc(e.details||'')}`).join('\\\\[6pt]\n');
    rightCol.push(`\\section{Education}\n${entries}`);
  }
  const skills = data.skills || [];
  if (skills.length) {
    const entries = skills.map(s => `\\textbf{${esc(s.category)}}\\\\\n${(s.items||[]).map(esc).join(', ')}`).join('\\\\[4pt]\n');
    rightCol.push(`\\section{Skills}\n${entries}`);
  }

  return `\n${header}\n\n\\begin{minipage}[t]{0.63\\textwidth}\n\n${leftCol.join('\n\n')}\n\n\\end{minipage}\\hfill\n\\begin{minipage}[t]{0.33\\textwidth}\n\n\\colorbox{sidecolor}{\\begin{minipage}{\\linewidth}\\vspace{8pt}\n${rightCol.join('\n\n')}\n\\vspace{8pt}\n\\end{minipage}}\n\n\\end{minipage}\n\n\\end{document}`;
}

/* ── Minimalist body builder ────────────────────────────────────────────── */
function buildMinimalistBody(data) {
  const p = data.personal || {};
  const header = `{\\centering\n  {\\fontsize{22}{26}\\selectfont \\textbf{${esc(p.name)}}}\\\\[6pt]\n  {\\small\\color{light}\n    \\href{mailto:${esc(p.email)}}{${esc(p.email)}} \\enspace·\\enspace\n    ${esc(p.phone)} \\enspace·\\enspace\n    \\href{${esc(p.github)}}{${esc(p.github).replace('https://','')}} \\enspace·\\enspace\n    ${esc(p.location)}\n  }\\\\\n\\par}\\vspace{8pt}\n\\rule{\\linewidth}{1pt}\\vspace{4pt}`;

  const sections = [];
  const exp = data.experience || [];
  if (exp.length) {
    const entries = exp.map(e => `\\cventry{${esc(e.title)}}{${esc(e.companyOrInst)}, ${esc(e.location)}}{Full-time}{${esc(e.date)}}\n\\begin{itemize}\n${(e.bullets||[]).map(b => `  \\item ${esc(b)}`).join('\n')}\n\\end{itemize}`).join('\n\\vspace{6pt}\n');
    sections.push(`\\section{Experience}\n${entries}`);
  }
  const edu = data.education || [];
  if (edu.length) {
    const entries = edu.map(e => `\\cventry{${esc(e.title)}}{${esc(e.details||'')}}{${esc(e.companyOrInst)}}{${esc(e.date)}}`).join('\n');
    sections.push(`\\section{Education}\n${entries}`);
  }
  const skills = data.skills || [];
  if (skills.length) {
    const rows = skills.map(s => `${esc(s.category)} & ${(s.items||[]).map(esc).join(', ')} \\\\`).join('\n');
    sections.push(`\\section{Skills}\n\\begin{tabularx}{\\linewidth}{@{}l X@{}}\n${rows}\n\\end{tabularx}`);
  }

  return `\n${header}\n\n${sections.join('\n\n')}\n\n\\end{document}`;
}

/* ── Academic body builder ──────────────────────────────────────────────── */
function buildAcademicBody(data) {
  const p = data.personal || {};
  const header = `{\\centering\n  {\\Large\\bfseries\\color{darkblue} ${esc(p.name)}}\\\\[4pt]\n  {\\small ${esc(p.location)}}\\\\[4pt]\n  {\\small\n    \\href{mailto:${esc(p.email)}}{${esc(p.email)}} \\quad|\\quad\n    \\href{${esc(p.linkedin)}}{LinkedIn} \\quad|\\quad\n    \\href{${esc(p.github)}}{GitHub}\n  }\n\\par}\\vspace{6pt}`;

  const sections = [];
  const edu = data.education || [];
  if (edu.length) {
    const entries = edu.map(e => `\\subsection{${esc(e.title)} \\hfill ${esc(e.date)}}\n\\textit{${esc(e.companyOrInst)}, ${esc(e.location)}}\\\\ \n${esc(e.details||'')}`).join('\n\\vspace{6pt}\n');
    sections.push(`\\section{Education}\n${entries}`);
  }
  const exp = data.experience || [];
  if (exp.length) {
    const entries = exp.map(e => {
        const titleLabel = e.url ? `\\href{${esc(e.url)}}{\\underline{${esc(e.title)}}}` : esc(e.title);
        return `\\subsection{${titleLabel} \\hfill ${esc(e.date)}}\n\\textit{${esc(e.companyOrInst)}}\n\\begin{itemize}\n${(e.bullets||[]).map(b => `  \\item ${esc(b)}`).join('\n')}\n\\end{itemize}`;
    }).join('\n');
    sections.push(`\\section{Academic Experience}\n${entries}`);
  }
  const skills = data.skills || [];
  if (skills.length) {
    const items = skills.map(s => `  \\item \\textbf{${esc(s.category)}:} ${(s.items||[]).map(esc).join(', ')}`).join('\n');
    sections.push(`\\section{Technical Skills}\n\\begin{itemize}\n${items}\n\\end{itemize}`);
  }

  return `\n${header}\n\n${sections.join('\n\n')}\n\n\\end{document}`;
}

/* ── Professional Modern (RenderCV style) body builder ─────────────────── */
function buildProfessionalBody(data) {
  const p = data.personal || {};
  const name = esc(p.name || 'Your Name');
  const phone = esc(p.phone || '');
  const github = esc(p.github || '');
  const linkedin = esc(p.linkedin || '');
  const location = esc(p.location || '');
  const objective = esc(p.objective || 'Software Developer specializing in full-stack systems.');

  const header = `
    \\begin{header}
        \\fontsize{20 pt}{20 pt}\\selectfont ${name}

        \\vspace{3 pt}

        \\normalsize
        \\kern 5.0 pt%
        \\mbox{\\hrefWithoutArrow{tel:${phone.replace(/\s/g,'')}}{${phone}}}%
        \\kern 5.0 pt%
         \\AND%
        \\kern 5.0 pt%
\\mbox{\\hrefWithoutArrow{https://${linkedin}}{${linkedin.replace('https://','')}}} %
        \\kern 5.0 pt%
        \\AND%
        \\kern 5.0 pt%
        \\mbox{\\hrefWithoutArrow{https://${github}}{${github.replace('https://','')}}}%
        \\kern 5.0 pt%
         \\AND%
            \\kern 5.0 pt%
            ${location}
    \\end{header}`;

  const sections = [];

  // Objective
  sections.push(`\\section{Objective}\n    \\vspace{0.2 cm}\n    \\begin{onecolentry}\n        ${objective}\n    \\end{onecolentry}`);

  // Education
  const edu = data.education || [];
  if (edu.length) {
    const entries = edu.map(e => `    \\begin{twocolentry}{${esc(e.date)}}\n    \\textbf{${esc(e.companyOrInst)}}\\end{twocolentry}\n    \\vspace{0.10 cm}\n    \\begin{onecolentry}\n        \\begin{highlights}\n            \\item ${esc(e.title)}${e.details ? `\n            \\item ${esc(e.details)}` : ''}\n        \\end{highlights}\n    \\end{onecolentry}\n    \\vspace{0.15 cm}`).join('\n');
    sections.push(`\\section{Education}\n    \\vspace{0.2 cm}\n${entries}`);
  }

  // Skills
  const rawSkills = data.skills || [];
  const normalizedSkills = rawSkills.length > 0 && rawSkills[0].category !== undefined
    ? rawSkills
    : [{ category: 'Technical Skills', items: rawSkills.map(s => s.text || String(s)) }];
  if (normalizedSkills.length) {
    const items = normalizedSkills.map(cat => `            \\item \\textbf{${esc(cat.category)}:} ${(cat.items || []).map(esc).join(', ')}`).join('\n\\vspace{0.02 cm}\n');
    sections.push(`\\section{Skills}\n    \\vspace{0.05 cm}\n    \\begin{highlightsforbulletentries}\n${items}\n    \\end{highlightsforbulletentries}`);
  }

  // Projects
  const proj = data.projects || [];
  if (proj.length) {
    const entries = proj.map(pr => `    \\begin{twocolentry}{${esc(pr.date)}}\n        \\textbf{${esc(pr.title)}}\n    \\end{twocolentry}\n    \\vspace{0.10 cm}\n    \\begin{onecolentry}\n        \\begin{highlights}\n${(pr.bullets || []).filter(Boolean).map(b => `            \\item ${esc(b)}`).join('\n')}\n        \\end{highlights}\n    \\end{onecolentry}\n    \\vspace{0.15 cm}`).join('\n');
    sections.push(`\\section{Academic Projects Experience}\n    \\vspace{0.1 cm}\n${entries}`);
  }

  // Experience
  const exp = data.experience || [];
  if (exp.length) {
    const entries = exp.map(e => `    \\begin{twocolentry}{${esc(e.date)}}\n        \\textbf{${esc(e.title)}}, ${esc(e.companyOrInst)}\n    \\end{twocolentry}\n    \\vspace{0.10 cm}\n    \\begin{onecolentry}\n        \\begin{highlights}\n${(e.bullets || []).filter(Boolean).map(b => `            \\item ${esc(b)}`).join('\n')}\n        \\end{highlights}\n    \\end{onecolentry}\n    \\vspace{0.15 cm}`).join('\n');
    sections.push(`\\section{Work Experience}\n    \\vspace{0.1 cm}\n${entries}`);
  }

  return `\n${header}\n\n\\vspace{5 pt - 0.3 cm}\n\n${sections.join('\n\n')}\n\n\\end{document}`;
}

/* ── Main export ─────────────────────────────────────────────────────────── */
/**
 * Merges resumeData into the given template LaTeX source.
 * The preamble (packages, custom commands, etc.) is preserved exactly.
 * Only the document body is replaced with user data.
 *
 * @param {string} templateCode  – The full original .tex source from TEMPLATE_REGISTRY
 * @param {object} resumeData    – The visual editor state
 * @param {string} templateType  – 'jitin-nair' | 'anubhav-singh' | fallback
 * @returns {string}             – Complete merged .tex source ready for compilation
 */
export function mergeDataIntoTemplate(templateCode, resumeData, templateType) {
  if (!templateCode) return buildGenericBody(resumeData);

  const preamble = extractPreamble(templateCode);
  if (!preamble) return buildGenericBody(resumeData);

  let body;
  if (templateType === 'jitin-nair') {
    body = buildJitinBody(resumeData);
  } else if (templateType === 'anubhav-singh') {
    body = buildAnubhavBody(resumeData);
  } else if (templateType === 'jake') {
    body = buildJakeBody(resumeData);
  } else if (templateType === 'two-column') {
    body = buildTwoColumnBody(resumeData);
  } else if (templateType === 'minimalist') {
    body = buildMinimalistBody(resumeData);
  } else if (templateType === 'academic') {
    body = buildAcademicBody(resumeData);
  } else if (templateType === 'professional-modern') {
    body = buildProfessionalBody(resumeData);
  } else {
    body = buildGenericBody(resumeData);
  }

  return preamble + body;
}
