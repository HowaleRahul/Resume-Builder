const { GoogleGenerativeAI } = require("@google/generative-ai");
const logger = require("../utils/logger");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * AI Service for Gemini interactions
 */
class AiService {
  async runPrompt(prompt, json = false) {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      if (json) {
        try {
          // 1. Basic markdown cleaning
          let cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
          
          // 2. Find the bounds of the JSON object or array
          const firstBrace = cleaned.indexOf('{');
          const firstBracket = cleaned.indexOf('[');
          const startIdx = (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) ? firstBrace : firstBracket;
          
          const lastBrace = cleaned.lastIndexOf('}');
          const lastBracket = cleaned.lastIndexOf(']');
          const endIdx = (lastBrace !== -1 && (lastBracket === -1 || lastBrace > lastBracket)) ? lastBrace : lastBracket;

          if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
            cleaned = cleaned.substring(startIdx, endIdx + 1);
          }

          // 3. Sanitise potential invisible characters or common AI-specific JSON breaks
          cleaned = cleaned.replace(/[\u201C\u201D]/g, '"'); // Smart quotes to standard

          return JSON.parse(cleaned);
        } catch (e) {
          logger.error("Failed to parse JSON from AI response", { 
            error: e.message,
            originalText: text.substring(0, 500) + "..." 
          });
          throw new Error(`Invalid JSON from AI: ${e.message}`);
        }
      }
      return text;
    } catch (err) {
      logger.error("AI Generation Error", { error: err.message });
      throw err;
    }
  }

  async enhanceText(text) {
    const prompt = `Rewrite the following resume bullet point to be more professional, impactful, and use strong action verbs. Return ONLY 3 rewritten options as a JSON array of strings: "${text}"`;
    return await this.runPrompt(prompt, true);
  }

  async matchJobDescription(jobDescription, resumeText) {
    const prompt = `Analyze this resume against the JD. 
    1. Score it 0-100.
    2. List missing keywords.
    3. List matched keywords.
    4. 3 improvement suggestions.
    Return JSON only.
    JD: ${jobDescription}
    Resume: ${resumeText}`;

    return await this.runPrompt(prompt, true);
  }

  async compareResumes(resumeA, resumeB, labels = ['Resume A', 'Resume B']) {
    const prompt = `Compare these two resumes.
    ${labels[0]}: ${JSON.stringify(resumeA)}
    ${labels[1]}: ${JSON.stringify(resumeB)}
    Output strict JSON: { "winner": "label", "differences": [], "resumeAScore": 0, "resumeBScore": 0 }`;
    return await this.runPrompt(prompt, true);
  }

  async translate(resumeData, targetLanguage) {
    const prompt = `Translate this resume JSON into strictly ${targetLanguage}. Keep identical structure. JSON: ${JSON.stringify(resumeData)}`;
    return await this.runPrompt(prompt, true);
  }

  async tailorResume(resumeData, jobDescription) {
    const prompt = `Tailor the bullet points of this resume (JSON) to match the Job Description below. 
    Focus on dynamic action verbs and quantify results where possible.
    Maintain the same JSON structure.
    JD: ${jobDescription}
    Resume JSON: ${JSON.stringify(resumeData)}`;
    return await this.runPrompt(prompt, true);
  }

  async generateCoverLetter(resumeData, jobDescription) {
    const prompt = `Generate a professional cover letter based on this resume and JD.
    Format the output as a LaTeX body (between \\begin{document} and \\end{document}).
    JD: ${jobDescription}
    Resume: ${JSON.stringify(resumeData)}`;
    return await this.runPrompt(prompt);
  }

  async getSkillGap(resumeData, jobDescription) {
    const prompt = `Identify missing skills and provide advice based on resume and JD. Return JSON: { "missingSkills":[], "advice":[] }. RESUME: ${JSON.stringify(resumeData)} JD: ${jobDescription}`;
    return await this.runPrompt(prompt, true);
  }

  async getInterviewPrep(resumeData, jobDescription) {
    const prompt = `Generate 10 interview questions and answers for this resume/JD. Return JSON: { "qa": [{"q":"","a":""}] }. RESUME: ${JSON.stringify(resumeData)} JD: ${jobDescription}`;
    return await this.runPrompt(prompt, true);
  }

  async checkLatexSyntax(latexCode) {
    const prompt = `Check this LaTeX code for syntax errors. Return JSON with 'valid' (boolean) and 'errors' (array of strings). 
    LaTeX Code: ${latexCode}`;
    return await this.runPrompt(prompt, true);
  }
}

module.exports = new AiService();
