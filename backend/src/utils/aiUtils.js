/**
 * Robustly extracts JSON from a string that might contain extra text or markdown blocks.
 */
function extractJson(text) {
  if (!text) return null;

  // 1. Try direct parse first
  try {
    return JSON.parse(text);
  } catch (e) {
    // Continue with cleaning
  }

  // 2. Remove markdown code blocks
  let cleaned = text.replace(/```json/gi, '').replace(/```/gi, '').trim();

  // 3. Find the first '{' or '[' and the last '}' or ']'
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');
  const startIdx = (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) ? firstBrace : firstBracket;

  const lastBrace = cleaned.lastIndexOf('}');
  const lastBracket = cleaned.lastIndexOf(']');
  const endIdx = (lastBrace !== -1 && (lastBracket === -1 || lastBrace > lastBracket)) ? lastBrace : lastBracket;

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    cleaned = cleaned.substring(startIdx, endIdx + 1);
  } else {
    return null; // No JSON structures found
  }

  // 4. Sanitize common AI JSON breakages
  try {
    const sanitized = cleaned
      .replace(/[\u201C\u201D]/g, '"') // Smart quotes
      .replace(/[\u2018\u2019]/g, "'") // Smart single quotes
      .replace(/\\n/g, ' ') // Escape newlines in strings
      .replace(/\n\s*\n/g, '\n') // Remove empty lines
      .replace(/\r?\n/g, ' '); // Newlines to spaces

    return JSON.parse(sanitized);
  } catch (e) {
    console.error("Failed to parse cleaned JSON:", cleaned.substring(0, 100));
    throw new Error(`AI generated incompatible data: ${e.message}`);
  }
}

module.exports = { extractJson };
