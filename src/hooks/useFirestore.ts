import { useEffect, useState, useCallback } from 'react';
import { Player } from '@/types';
import { 
  subscribeToPlayers, 
  createPlayerProfile, 
  togglePlayerWatchlist, 
  deletePlayerProfile 
} from '@/lib/firestore';

export const useFirestore = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToPlayers(
      (updatedPlayers) => {
        setPlayers(updatedPlayers);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message || 'Failed to sync player directory from Firestore.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addPlayer = useCallback(async (playerData: Omit<Player, 'id' | 'createdAt' | 'watchlisted'>) => {
    try {
      const newId = await createPlayerProfile(playerData);
      return newId;
    } catch (err: any) {
      console.error('Failed to create player:', err);
      throw new Error(err.message || 'Failed to create player profile.');
    }
  }, []);

  const toggleWatchlist = useCallback(async (playerId: string, watchlisted: boolean) => {
    try {
      await togglePlayerWatchlist(playerId, watchlisted);
    } catch (err: any) {
      console.error('Failed to update watchlist status:', err);
      throw new Error(err.message || 'Failed to update watchlist status.');
    }
  }, []);

  const deletePlayer = useCallback(async (playerId: string) => {
    try {
      await deletePlayerProfile(playerId);
    } catch (err: any) {
      console.error('Failed to delete player:', err);
      throw new Error(err.message || 'Failed to remove player profile.');
    }
  }, []);

  return {
    players,
    loading,
    error,
    addPlayer,
    toggleWatchlist,
    deletePlayer,
  };
};
