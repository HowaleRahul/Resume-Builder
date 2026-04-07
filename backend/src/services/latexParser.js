const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../utils/logger');

/**
 * Helper to detect the latex template based on documentclass and packages.
 */
function detectTemplate(latexString) {
  if (latexString.includes('\\documentclass') && latexString.includes('{moderncv}')) {
    return 'moderncv';
  }
  if (latexString.includes('\\documentclass') && latexString.includes('{awesome-cv}')) {
    return 'awesome-cv';
  }
  // Standard article class might be used generically
  if (latexString.includes('\\documentclass{article}')) {
     return 'standard-resume';
  }
  return 'unknown';
}

/**
 * Parses raw LaTeX code into structured JSON data.
 */
async function parseLatex(latexString) {
  const result = {
    personal: { name: '', email: '', phone: '', location: '', links: [] },
    education: [],
    experience: [],
    projects: [],
    skills: [],
    customSections: [],
  };

  if (!latexString || typeof latexString !== 'string') return result;

  // 1. PRIMARY PARSER: Intelligent Gemini AI Extraction
  if (process.env.GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `
        You are an intelligent LaTeX resume parser. Extract the following LaTeX resume into structured JSON. 
        Adhere strictly to this schema:
        {
           "personal": { "name": "", "email": "", "phone": "", "location": "" },
           "education": [ { "date": "", "title": "", "companyOrInst": "", "location": "", "description": "" } ],
           "experience": [ { "date": "", "title": "", "companyOrInst": "", "location": "", "description": "" } ],
           "projects": [ { "date": "", "title": "", "description": "" } ],
           "skills": [ { "text": "" } ]
        }
        Extract as much detailed data as possible from this LaTeX source code:
        ${latexString}
        
        Return ONLY valid JSON format. Start with { and end with }. Do not include markdown codeblocks.
      `;
      const aiResult = await model.generateContent(prompt);
      let outputText = aiResult.response.text();
      outputText = outputText.replace(/```json/g, '').replace(/```/g, '').trim();
      const aiParsedData = JSON.parse(outputText);
      return { ...result, ...aiParsedData };
    } catch (e) {
      logger.warn('AI primary parser failed, falling back to regex', { error: e.message });
    }
  }

  // 2. FALLBACK PARSER: Basic Regex Extraction
  // Personal Info Parsing
  const nameMatch = latexString.match(/\\name{([^}]*)}{([^}]*)}/) || latexString.match(/\\(?:author|name){([^}]*)}/);
  if (nameMatch) {
    result.personal.name = nameMatch[1] + (nameMatch[2] ? ' ' + nameMatch[2] : '');
  }

  const emailMatch = latexString.match(/\\email{([^}]*)}/);
  if (emailMatch) result.personal.email = emailMatch[1];

  const phoneMatch = latexString.match(/\\(?:phone|mobile|phone|TEL){([^}]*)}/);
  if (phoneMatch) result.personal.phone = phoneMatch[1];
  
  const locationMatch = latexString.match(/\\(?:location|address){([^}]*)}/);
  if (locationMatch) result.personal.location = locationMatch[1];

  // Section Extraction
  const sectionRegex = /\\section(?:\[.*?\])?{([^}]+)}([\s\S]*?)(?=\\section(?:\[.*?\])?{|\Z)/gi;
  let sectionMatch;

  while ((sectionMatch = sectionRegex.exec(latexString)) !== null) {
    const secTitle = sectionMatch[1].trim().toLowerCase();
    const secContent = sectionMatch[2].trim();

    if (secTitle.includes('education')) {
      result.education = extractListItems(secContent, 'education');
    } else if (secTitle.includes('experience') || secTitle.includes('work')) {
      result.experience = extractListItems(secContent, 'experience');
    } else if (secTitle.includes('project')) {
      result.projects = extractListItems(secContent, 'project');
    } else if (secTitle.includes('skill')) {
      result.skills = extractListItems(secContent, 'skill');
    } else {
      result.customSections.push({ title: sectionMatch[1], content: secContent });
    }
  }

  return result;
}

/**
 * Extracts elements like \cventry or \resumeItem from a section chunk.
 */
function extractListItems(content, type) {
  const items = [];
  
  if (type === 'skill') {
    // Skills often just comma separated or in simple bullet points
    const lines = content.split('\n');
    lines.forEach(line => {
      const clean = line.replace(/\\(?:cvitem|item)(?:\[.*?\])?|(?:&)/g, '').trim();
      if (clean && clean.length > 2) {
        items.push({ text: clean.replace(/[{}]/g, '').trim() });
      }
    });
    return items;
  }

  // Look for command based entries e.g., \cventry{year}{Degree}{Institution}{City}{}{description}
  const entryRegex = /\\(?:cventry|resumeSubheading){([^}]*)}{([^}]*)}{([^}]*)}{([^}]*)}(?:{([^}]*)})?(?:{([^}]*)})?/g;
  let entryMatch;
  let matchedEntries = false;

  while ((entryMatch = entryRegex.exec(content)) !== null) {
    matchedEntries = true;
    items.push({
      date: entryMatch[1] || '',
      title: entryMatch[2] || '', // degree or role
      companyOrInst: entryMatch[3] || '',
      location: entryMatch[4] || '',
      details: entryMatch[5] || '',
      description: entryMatch[6] || ''
    });
  }

  if (!matchedEntries) {
    // Fallback: extract generic itemize for the section
    const fallbackItemsRegex = /\\item\s+(.*?)(?=\\item|\\end|\Z)/gs;
    let fbMatch;
    while ((fbMatch = fallbackItemsRegex.exec(content)) !== null) {
      items.push({
        title: fbMatch[1].replace(/[{}]/g, '').trim(),
        description: ''
      });
    }
  }

  return items;
}

module.exports = { parseLatex };
