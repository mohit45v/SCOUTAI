export interface Player {
  id: string;
  name: string;
  age: number;
  role: 'Batsman' | 'Bowler' | 'All-rounder' | 'WK';
  academy: string;
  city: string;
  mediaUrl?: string;
  watchlisted: boolean;
  createdAt: string; // ISO8601
  report?: ScoutingReport;
}

export interface ScoutingReport {
  playerId: string;
  analysisTimestamp: string;
  role: Player['role'];
  overallRating: number;    // 1-10
  technicalScore: number;   // 1-10
  potentialScore: number;   // 1-10
  strengths: string[];
  weaknesses: string[];
  drillRecommendations: string[];
  scoutNote: string;
  watchlistRecommended: boolean;
  injuryRiskFlag: boolean;
}

export interface UploadState {
  status: 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error';
  progress: number;
  error?: string;
}
