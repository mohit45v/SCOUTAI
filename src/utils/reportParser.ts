import { ScoutingReport } from '@/types';

/**
 * Safely parses the raw text response from Gemini into a ScoutingReport object.
 * Applies schema validation and fallback values for malformed JSON or missing fields.
 */
export const parseGeminiReport = (
  rawText: string,
  playerId: string,
  playerRole: ScoutingReport['role']
): ScoutingReport => {
  let cleaned = rawText.trim();

  // Strip markdown code block wrappers if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();

  let parsed: any = {};
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    // Attempt regex extraction for a JSON object block
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch (err2) {
        console.error('Failed to parse extracted JSON block. Fallback will be used.', err2);
      }
    } else {
      console.error('No JSON block found in response. Fallback will be used.', err);
    }
  }

  // Safe numeric parser helper (forces integer 1-10)
  const parseScore = (val: any, def: number): number => {
    const num = Number(val);
    if (isNaN(num)) return def;
    return Math.max(1, Math.min(10, Math.round(num)));
  };

  // Enforce types and map to ScoutingReport schema
  const strengths = Array.isArray(parsed.strengths) && parsed.strengths.length > 0
    ? parsed.strengths.map((s: any) => String(s).trim()).filter(Boolean)
    : ['Solid fundamental setup'];

  const weaknesses = Array.isArray(parsed.weaknesses) && parsed.weaknesses.length > 0
    ? parsed.weaknesses.map((w: any) => String(w).trim()).filter(Boolean)
    : ['Technique requires refinement'];

  const drillRecommendations = Array.isArray(parsed.drillRecommendations) && parsed.drillRecommendations.length > 0
    ? parsed.drillRecommendations.map((d: any) => String(d).trim()).filter(Boolean)
    : ['Repetitive shadow practice', 'Basic net sessions'];

  const scoutNote = typeof parsed.scoutNote === 'string' && parsed.scoutNote.trim().length > 0
    ? parsed.scoutNote.trim()
    : 'Player technique was analyzed. Standard feedback was generated based on the uploaded visual data.';

  const watchlistRecommended = typeof parsed.watchlistRecommended === 'boolean'
    ? parsed.watchlistRecommended
    : false;

  const injuryRiskFlag = typeof parsed.injuryRiskFlag === 'boolean'
    ? parsed.injuryRiskFlag
    : false;

  return {
    playerId,
    analysisTimestamp: new Date().toISOString(),
    role: playerRole,
    overallRating: parseScore(parsed.overallRating, 5),
    technicalScore: parseScore(parsed.technicalScore, 5),
    potentialScore: parseScore(parsed.potentialScore, 5),
    strengths,
    weaknesses,
    drillRecommendations,
    scoutNote,
    watchlistRecommended,
    injuryRiskFlag,
  };
};
