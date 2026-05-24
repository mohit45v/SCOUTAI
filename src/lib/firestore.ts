import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  deleteDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { Player, ScoutingReport } from '@/types';

const PLAYERS_COLLECTION = 'players';

/**
 * Creates a new player profile document in Firestore.
 * Automatically handles generating a document reference or using a specified ID.
 */
export const createPlayerProfile = async (
  playerData: Omit<Player, 'id' | 'createdAt' | 'watchlisted'>
): Promise<string> => {
  const playersRef = collection(db, PLAYERS_COLLECTION);
  const docRef = await addDoc(playersRef, {
    ...playerData,
    watchlisted: false,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
};

/**
 * Subscribes to real-time updates for all players, sorted by creation date descending.
 */
export const subscribeToPlayers = (
  onUpdate: (players: Player[]) => void,
  onError?: (error: any) => void
) => {
  const playersRef = collection(db, PLAYERS_COLLECTION);
  const q = query(playersRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const players: Player[] = [];
      snapshot.forEach((docSnap) => {
        players.push({
          id: docSnap.id,
          ...docSnap.data()
        } as Player);
      });
      onUpdate(players);
    },
    (err) => {
      console.error('Error fetching players real-time snapshot:', err);
      if (onError) onError(err);
    }
  );
};

/**
 * Updates a player's watchlist state.
 */
export const togglePlayerWatchlist = async (
  playerId: string,
  watchlisted: boolean
): Promise<void> => {
  const playerRef = doc(db, PLAYERS_COLLECTION, playerId);
  await updateDoc(playerRef, { watchlisted });
};

/**
 * Attaches/Updates a Scouting Report for a player.
 */
export const updatePlayerReport = async (
  playerId: string,
  report: ScoutingReport
): Promise<void> => {
  const playerRef = doc(db, PLAYERS_COLLECTION, playerId);
  await updateDoc(playerRef, { report });
};

/**
 * Deletes a player profile.
 */
export const deletePlayerProfile = async (playerId: string): Promise<void> => {
  const playerRef = doc(db, PLAYERS_COLLECTION, playerId);
  await deleteDoc(playerRef);
};
