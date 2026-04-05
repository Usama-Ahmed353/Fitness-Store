const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/';
const ENDPOINT = 'chat/completions';
const MODEL = 'gemini-2.5-flash';

function normalizeContent(content) {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === 'string') return item;
        return item?.text || item?.content || '';
      })
      .join(' ')
      .trim();
  }
  return '';
}

function extractJson(text) {
  if (!text || typeof text !== 'string') return null;

  const cleaned = text
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // Continue to fallback extraction
  }

  const objectMatch = cleaned.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    try {
      return JSON.parse(objectMatch[0]);
    } catch {
      // Continue to array match
    }
  }

  const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    try {
      return JSON.parse(arrayMatch[0]);
    } catch {
      return null;
    }
  }

  return null;
}

async function callGeminiChat(messages) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing in environment variables');
  }

  const response = await fetch(`${BASE_URL}${ENDPOINT}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
    }),
  });

  const responseText = await response.text();
  let data = {};

  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch {
    data = {};
  }

  if (!response.ok) {
    const errorMessage = data?.error?.message || responseText || 'Gemini API request failed';
    throw new Error(errorMessage);
  }

  const content = normalizeContent(data?.choices?.[0]?.message?.content);

  return {
    raw: data,
    content,
    parsedJson: extractJson(content),
  };
}

module.exports = {
  BASE_URL,
  ENDPOINT,
  MODEL,
  callGeminiChat,
  extractJson,
};
