const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../utils/logger');

// Ensure to add your Google Gemini API Key in .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy-key-for-now");

exports.enhanceResumeText = async (req, res) => {
  try {
    const { textToImprove } = req.body;
    if (!textToImprove) return res.status(400).json({ error: 'Text to improve is required' });

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Rewrite the following resume bullet point to be more professional, impactful, and use strong action verbs. Return ONLY 3 rewritten options as a JSON array of strings: "${textToImprove}"`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const suggestions = JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, '').trim());

    res.json({ success: true, suggestions });
  } catch (err) {
    logger.error('AI enhance failed', { handler: 'enhanceResumeText', error: err.message });
    res.status(500).json({ error: 'AI Improvement failed', details: err.message });
  }
};

exports.calculateAtsScore = async (req, res) => {
  try {
    const { parsedResumeData, jobDescription } = req.body;
    if (!parsedResumeData || !jobDescription) return res.status(400).json({ error: 'Missing parameters' });

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
      You are an expert ATS (Applicant Tracking System) algorithm.
      Compare the following resume data to the job description.
      Resume Data: ${JSON.stringify(parsedResumeData)}
      Job Description: ${jobDescription}
      
      Output a valid JSON containing:
      {
         "score": (a number between 0 and 100),
         "matchedKeywords": ["keyword1", "keyword2"],
         "missingKeywords": ["keyword3", "keyword4"],
         "feedback": ["actionable advice 1", "actionable advice 2"]
      }
    `;

    const result = await model.generateContent(prompt);
    let outputText = result.response.text();
    outputText = outputText.replace(/```json/g, '').replace(/```/g, '').trim();

    res.json({ success: true, ...JSON.parse(outputText) });
  } catch (err) {
    logger.error('ATS score calculation failed', { handler: 'calculateAtsScore', error: err.message });
    res.status(500).json({ error: 'ATS analysis failed', details: err.message });
  }
};

exports.compareResumes = async (req, res) => {
  try {
    const { resumeA, resumeB } = req.body;
    if (!resumeA || !resumeB) return res.status(400).json({ error: 'Provide two resumes to compare' });

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
      Compare these two resumes.
      Resume A: ${JSON.stringify(resumeA)}
      Resume B: ${JSON.stringify(resumeB)}

      Output a strict JSON analyzing the differences:
      {
        "winner": "A or B (based on overall structure and content)",
        "differences": ["diff 1", "diff 2"],
        "resumeAScore": 85,
        "resumeBScore": 90
      }
    `;

    const result = await model.generateContent(prompt);
    let outputText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    res.json({ success: true, data: JSON.parse(outputText) });
  } catch (err) {
    res.status(500).json({ error: 'Comparison failed', details: err.message });
  }
};

exports.translateResume = async (req, res) => {
  try {
    const { resumeData, targetLanguage } = req.body;
    if (!resumeData || !targetLanguage) return res.status(400).json({ error: 'Missing arguments' });

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
      Translate the following resume JSON into strictly ${targetLanguage}. 
      Keep the EXACT JSON schema structure. Only translate the textual values.
      ${JSON.stringify(resumeData)}
    `;

    const result = await model.generateContent(prompt);
    let outputText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    res.json({ success: true, translatedData: JSON.parse(outputText) });
  } catch (err) {
    res.status(500).json({ error: 'Translation failed', details: err.message });
  }
};

exports.checkSyntax = (req, res) => {
  const { latexCode } = req.body;
  const errors = [];
  
  if (!latexCode) return res.json({ success: true, valid: false, errors: ['No code provided'] });

  // 1. Mismatched Braces
  const openBraces = (latexCode.match(/\{/g) || []).length;
  const closeBraces = (latexCode.match(/\}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push(`Mismatched braces: Found ${openBraces} '{' and ${closeBraces} '}'. Close all environments.`);
  }

  // 2. Document Structure
  if (!latexCode.includes('\\begin{document}') || !latexCode.includes('\\end{document}')) {
    errors.push("Missing core structure: Every LaTeX file must have \\begin{document} and \\end{document}.");
  }

  // 3. Unescaped Special Characters (Common source of failure)
  // Check for & or % or $ or _ without a preceding backslash (simplified check)
  const unescapedSpecial = Array.from(latexCode.matchAll(/(?<!\\)[&%$#_]/g));
  if (unescapedSpecial.length > 5) { // Threshold to avoid false positives in preamble
    // Only check document body for these
    const bodyMatch = latexCode.match(/\\begin\{document\}([\s\S]*)\\end\{document\}/);
    if (bodyMatch) {
      const body = bodyMatch[1];
      const unescapedInBody = Array.from(body.matchAll(/(?<!\\)[&%$#_]/g));
      if (unescapedInBody.length > 0) {
        errors.push(`Unescaped characters found: ${unescapedInBody.length} instances of &, %, $, #, or _ without a backslash. These will break compilation.`);
      }
    }
  }

  // 4. Missing required packages for our templates
  const commonMacros = [
    { macro: '\\faEnvelope', pkg: 'fontawesome5' },
    { macro: '\\tabularx', pkg: 'tabularx' },
    { macro: '\\hypersetup', pkg: 'hyperref' },
    { macro: '\\titleformat', pkg: 'titlesec' }
  ];

  commonMacros.forEach(({ macro, pkg }) => {
    if (latexCode.includes(macro) && !latexCode.includes(`{${pkg}}`)) {
      errors.push(`Missing package: Your code uses ${macro} but doesn't seem to include \\usepackage{${pkg}} in the preamble.`);
    }
  });

  res.json({ success: true, valid: errors.length === 0, errors });
};

exports.matchJobDescription = async (req, res) => {
  try {
    const { jobDescription, resumeText } = req.body;
    if (!jobDescription || !resumeText) return res.status(400).json({ error: 'jobDescription and resumeText are required' });

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
      You are an expert ATS resume coach. Analyze how well the resume matches the job description.
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      RESUME:
      ${resumeText}
      
      Respond with ONLY a valid JSON object (no markdown, no comments) in this exact format:
      {
        "score": (integer 0-100 representing match percentage),
        "summary": "One sentence summary of match quality",
        "matchedKeywords": ["keyword1", "keyword2"],
        "missingKeywords": ["keyword3", "keyword4"],
        "suggestions": ["Actionable suggestion 1", "Actionable suggestion 2", "Actionable suggestion 3"]
      }
    `;

    const result = await model.generateContent(prompt);
    let outputText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(outputText);
    res.json({ success: true, ...parsed });
  } catch (err) {
    logger.error('JD matching failed', { handler: 'matchJobDescription', error: err.message });
    res.status(500).json({ error: 'JD matching failed', details: err.message });
  }
};

exports.compareResumesByText = async (req, res) => {
  try {
    const { resumeAText, resumeBText, resumeALabel = 'Resume A', resumeBLabel = 'Resume B', inputMode = 'text' } = req.body;
    if (!resumeAText || !resumeBText) return res.status(400).json({ error: 'Both resume texts are required' });

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const formatNote = inputMode === 'latex'
      ? 'Both resumes are provided as LaTeX source code. Analyze the LaTeX structure, macro quality, section depth, and the textual content.'
      : 'Both resumes are provided as plain text. Analyze keyword quality, experience depth, action verbs, and overall presentation.';

    const prompt = `
      You are an expert resume evaluator.
      ${formatNote}

      ${resumeALabel}:
      ${resumeAText}

      ${resumeBLabel}:
      ${resumeBText}

      Compare them and output ONLY a valid JSON object in this exact format:
      {
        "winner": "${resumeALabel} or ${resumeBLabel} (the label of the stronger resume)",
        "resumeAScore": (integer 0-100),
        "resumeBScore": (integer 0-100),
        "differences": ["difference 1", "difference 2", "difference 3", "difference 4"]
      }
    `;

    const result = await model.generateContent(prompt);
    let outputText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    res.json({ success: true, data: JSON.parse(outputText) });
  } catch (err) {
    logger.error('Resume text comparison failed', { handler: 'compareResumesByText', error: err.message });
    res.status(500).json({ error: 'Text comparison failed', details: err.message });
  }
};

exports.tailorResume = async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;
    if (!resumeData || !jobDescription) return res.status(400).json({ error: 'resumeData and jobDescription are required' });
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Tailor this resume JSON to match the JD. Focus on experience/projects bullets and skills. Keep structure identical. JSON: ${JSON.stringify(resumeData)} JD: ${jobDescription}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g,'').replace(/```/g,'').trim();
    res.json({ success: true, tailoredData: JSON.parse(text) });
  } catch (err) { res.status(500).json({ error: 'Tailoring failed' }); }
};

exports.generateCoverLetter = async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Generate LaTeX code for a professional cover letter body (no preamble) for this resume and JD. RESUME: ${JSON.stringify(resumeData)} JD: ${jobDescription}`;
    const result = await model.generateContent(prompt);
    res.json({ success: true, coverLetterLatex: result.response.text() });
  } catch (err) { res.status(500).json({ error: 'Cover letter failed' }); }
};

exports.getSkillGap = async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Identify missing skills and provide advice based on resume and JD. Return JSON: { "missingSkills":[], "advice":[] }. RESUME: ${JSON.stringify(resumeData)} JD: ${jobDescription}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g,'').replace(/```/g,'').trim();
    res.json({ success: true, ...JSON.parse(text) });
  } catch (err) { res.status(500).json({ error: 'Skill gap failed' }); }
};

exports.getInterviewPrep = async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Generate 10 interview questions and answers for this resume/JD. Return JSON: { "qa": [{"q":"","a":""}] }. RESUME: ${JSON.stringify(resumeData)} JD: ${jobDescription}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g,'').replace(/```/g,'').trim();
    res.json({ success: true, ...JSON.parse(text) });
  } catch (err) { res.status(500).json({ error: 'Interview prep failed' }); }
};

const axios = require('axios');
exports.analyzePortfolio = async (req, res) => {
  try {
    const { url } = req.body;
    const webRes = await axios.get(url, { timeout: 8000 });
    const snippet = webRes.data.substring(0, 8000);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Extract professional experience/projects from this text. Return JSON: { "projects": [{"title":"", "bullets":[], "date":"", "url": "${url}"}] }. TEXT: ${snippet}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g,'').replace(/```/g,'').trim();
    res.json({ success: true, extractedData: JSON.parse(text) });
  } catch (err) { res.status(500).json({ error: 'Portfolio analysis failed' }); }
};
