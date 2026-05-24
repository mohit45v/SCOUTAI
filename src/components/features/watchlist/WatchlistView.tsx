import React, { useMemo } from 'react';
import { Player } from '@/types';
import { PlayerGrid } from '../dashboard/PlayerGrid';
import { Star } from 'lucide-react';

interface WatchlistViewProps {
  players: Player[];
  onViewReport: (player: Player) => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({ players, onViewReport }) => {
  // Filter for watchlisted players and sort them descending by potentialScore
  const watchlistedPlayers = useMemo(() => {
    return players
      .filter((p) => p.watchlisted)
      .sort((a, b) => {
        const potentialA = a.report?.potentialScore ?? 0;
        const potentialB = b.report?.potentialScore ?? 0;
        return potentialB - potentialA;
      });
  }, [players]);

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex items-center space-x-3 pb-4 border-b border-border-subtle">
        <Star className="w-7 h-7 text-brand-green fill-brand-green" />
        <div>
          <h2 className="text-2xl font-bold font-display text-text-primary tracking-wide">
            Watchlist Database
          </h2>
          <p className="text-xs text-text-secondary">
            Profiles bookmarked for select lists, sorted descending by their AI-calculated potential score.
          </p>
        </div>
      </div>

      {/* Render Grid */}
      <PlayerGrid
        players={watchlistedPlayers}
        onViewReport={onViewReport}
        emptyMessage="Your watchlist is empty. Go to the Dashboard and toggle the star icon on any cricketer card to bookmark them here."
      />
    </div>
  );
};
