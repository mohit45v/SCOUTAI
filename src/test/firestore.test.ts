import { describe, it, expect, vi } from 'vitest';
import { 
  createPlayerProfile, 
  togglePlayerWatchlist, 
  updatePlayerReport, 
  deletePlayerProfile 
} from '../lib/firestore';

// Mock firebase/firestore SDK methods
vi.mock('firebase/firestore', () => {
  return {
    collection: vi.fn(() => 'mock-collection-ref'),
    doc: vi.fn(() => 'mock-doc-ref'),
    addDoc: vi.fn(async () => ({ id: 'new-player-id' })),
    updateDoc: vi.fn(async () => {}),
    deleteDoc: vi.fn(async () => {}),
    query: vi.fn(),
    orderBy: vi.fn(),
    onSnapshot: vi.fn()
  };
});

// Mock the initialized database export
vi.mock('../lib/firebase', () => ({
  db: {}
}));

describe('Firestore Operations', () => {
  it('should invoke addDoc when creating a new player profile', async () => {
    const { addDoc } = await import('firebase/firestore');
    const playerInput = {
      name: 'Yuvraj Singh',
      age: 20,
      role: 'All-rounder' as const,
      academy: 'Punjab Academy',
      city: 'Chandigarh'
    };

    const id = await createPlayerProfile(playerInput);
    expect(addDoc).toHaveBeenCalled();
    expect(id).toBe('new-player-id');
  });

  it('should invoke updateDoc when toggling a watchlist', async () => {
    const { updateDoc } = await import('firebase/firestore');
    await togglePlayerWatchlist('player-id-123', true);
    expect(updateDoc).toHaveBeenCalled();
  });

  it('should invoke updateDoc when committing a scouting report', async () => {
    const { updateDoc } = await import('firebase/firestore');
    const mockReport = {
      playerId: 'player-id-123',
      analysisTimestamp: '2026-05-24',
      role: 'WK' as const,
      overallRating: 8,
      technicalScore: 7,
      potentialScore: 9,
      strengths: [],
      weaknesses: [],
      drillRecommendations: [],
      scoutNote: 'Very quick.',
      watchlistRecommended: false,
      injuryRiskFlag: false
    };
    await updatePlayerReport('player-id-123', mockReport);
    expect(updateDoc).toHaveBeenCalled();
  });

  it('should invoke deleteDoc when removing a player profile', async () => {
    const { deleteDoc } = await import('firebase/firestore');
    await deletePlayerProfile('player-id-123');
    expect(deleteDoc).toHaveBeenCalled();
  });
});
