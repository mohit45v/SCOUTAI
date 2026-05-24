import React from 'react';
import { Player } from '@/types';
import { PlayerCard } from './PlayerCard';

interface PlayerGridProps {
  players: Player[];
  onViewReport: (player: Player) => void;
  emptyMessage?: string;
}

export const PlayerGrid: React.FC<PlayerGridProps> = ({ 
  players, 
  onViewReport,
  emptyMessage = "No player profiles found. Add a new player using the 'New Scout' page to start analyzing."
}) => {
  if (players.length === 0) {
    return (
      <div className="text-center py-12 px-6 border border-dashed border-border-subtle rounded-lg bg-bg-surface/10 max-w-lg mx-auto">
        <p className="text-text-secondary text-sm font-medium leading-relaxed font-body">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {players.map((player, idx) => (
        <PlayerCard
          key={player.id}
          player={player}
          onViewReport={onViewReport}
          index={idx}
        />
      ))}
    </div>
  );
};
