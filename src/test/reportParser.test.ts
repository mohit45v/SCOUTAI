import { describe, it, expect } from 'vitest';
import { parseGeminiReport } from '../utils/reportParser';

describe('parseGeminiReport', () => {
  const playerId = 'player123';
  const role = 'Batsman';

  it('should successfully parse a valid JSON string matching the schema', () => {
    const raw = JSON.stringify({
      overallRating: 8.5,
      technicalScore: 8,
      potentialScore: 9,
      strengths: ['High elbow', 'Good balance'],
      weaknesses: ['Vulnerable outside off'],
      drillRecommendations: ['Underarm feed drills'],
      scoutNote: 'Very promising batsman.',
      watchlistRecommended: true,
      injuryRiskFlag: false
    });

    const report = parseGeminiReport(raw, playerId, role);
    expect(report.playerId).toBe(playerId);
    expect(report.role).toBe(role);
    expect(report.overallRating).toBe(9); // clamps 8.5 to nearest int (9)
    expect(report.technicalScore).toBe(8);
    expect(report.potentialScore).toBe(9);
    expect(report.strengths).toContain('High elbow');
    expect(report.watchlistRecommended).toBe(true);
    expect(report.injuryRiskFlag).toBe(false);
  });

  it('should parse JSON wrapped in markdown code blocks', () => {
    const raw = '```json\n{\n  "overallRating": 7.2,\n  "technicalScore": 7,\n  "potentialScore": 8,\n  "strengths": ["Quick wrists"],\n  "weaknesses": ["Slow footwork"],\n  "drillRecommendations": ["Footwork ladders"],\n  "scoutNote": "Good footwork required.",\n  "watchlistRecommended": false,\n  "injuryRiskFlag": true\n}\n```';

    const report = parseGeminiReport(raw, playerId, role);
    expect(report.overallRating).toBe(7);
    expect(report.injuryRiskFlag).toBe(true);
    expect(report.strengths).toContain('Quick wrists');
  });

  it('should fallback gracefully for malformed JSON', () => {
    const raw = '{ overallRating: 8, strengths: ["test", // syntax error';
    const report = parseGeminiReport(raw, playerId, role);
    expect(report.overallRating).toBe(5); // default fallback
    expect(report.strengths).toContain('Solid fundamental setup'); // default fallback
    expect(report.scoutNote).toContain('technique was analyzed'); // default fallback
  });

  it('should clamp scores to 1-10 range and handle invalid values', () => {
    const raw = JSON.stringify({
      overallRating: 15,
      technicalScore: 0,
      potentialScore: 'not-a-number'
    });

    const report = parseGeminiReport(raw, playerId, role);
    expect(report.overallRating).toBe(10); // clamps 15 to 10
    expect(report.technicalScore).toBe(1); // clamps 0 to 1
    expect(report.potentialScore).toBe(5); // converts non-number string to default (5)
  });
});
