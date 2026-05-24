import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

/**
 * Analyzes player technique using the gemini-2.0-flash vision model.
 * Sends the image as inline base64 and forces a JSON-only response schema.
 */
export const analyzePlayerMedia = async (
  imageBase64: string,
  mimeType: string,
  role: 'Batsman' | 'Bowler' | 'All-rounder' | 'WK'
): Promise<string> => {
  if (!apiKey || apiKey.startsWith('PLACEHOLDER_')) {
    throw new Error('Gemini API key is not configured. Please define VITE_GEMINI_API_KEY in your .env.local file.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Use gemini-2.0-flash model and enforce JSON output
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });

  const prompt = `You are an expert cricket scout with 20+ years of experience.
Analyze the provided image of a cricket player who plays as a ${role} and return ONLY a valid JSON object matching the schema below.
Evaluate their stance, grip, alignment, and execution. Be technical, constructive, and highly detailed.

No markdown syntax, no explanation, no preamble. Return just the raw JSON.

JSON schema:
{
  "overallRating": number between 1-10,
  "technicalScore": number between 1-10,
  "potentialScore": number between 1-10,
  "strengths": array of 2-4 specific technical strengths observed,
  "weaknesses": array of 1-3 areas for improvement,
  "drillRecommendations": array of 2-3 specific actionable drills to fix weaknesses,
  "scoutNote": "one paragraph professional scout commentary",
  "watchlistRecommended": boolean,
  "injuryRiskFlag": boolean based on visible technique risks (e.g. hyper-extended front knee, falling head, cross bat stroke)
}`;

  const imagePart = {
    inlineData: {
      data: imageBase64,
      mimeType,
    },
  };

  const result = await model.generateContent([prompt, imagePart]);
  return result.response.text();
};
