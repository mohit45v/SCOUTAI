import React, { useState, useEffect } from 'react';
import { Star, Eye, Trash2 } from 'lucide-react';
import { Player } from '@/types';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { formatRating } from '@/utils/formatters';
import { useFirestore } from '@/hooks/useFirestore';

interface PlayerCardProps {
  player: Player;
  onViewReport: (player: Player) => void;
  index: number;
}

export const PlayerCard: React.FC<PlayerCardProps> = React.memo(({ player, onViewReport, index }) => {
  const { toggleWatchlist, deletePlayer } = useFirestore();
  const [isWatchlisted, setIsWatchlisted] = useState(player.watchlisted);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Keep internal state synced with Firestore data
    setIsWatchlisted(player.watchlisted);
  }, [player.watchlisted]);

  useEffect(() => {
    // Staggered trigger for progress bar width transitions
    const t = setTimeout(() => setAnimate(true), index * 60 + 100);
    return () => clearTimeout(t);
  }, [index]);

  const handleWatchlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const newState = !isWatchlisted;
      setIsWatchlisted(newState);
      await toggleWatchlist(player.id, newState);
    } catch (err) {
      console.error(err);
      setIsWatchlisted(player.watchlisted); // revert on error
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete the profile of ${player.name}?`)) {
      try {
        await deletePlayer(player.id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Generate initials for avatar
  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Generate unique background color from name hash
  const getAvatarBg = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash) % 360;
    // Keep it in stadium dark palette (saturated, mid-darkness)
    return `hsl(${h}, 50%, 30%)`;
  };

  const overallRating = player.report?.overallRating ?? 0;
  const technicalScore = player.report?.technicalScore ?? 0;
  const potentialScore = player.report?.potentialScore ?? 0;

  return (
    <Card 
      className={`flex flex-col justify-between space-y-5 animate-fade-in-up opacity-0 stagger-card-${index % 10}`}
      style={{ animationFillMode: 'forwards' }}
    >
      {/* Top Section: Avatar & Role */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-text-primary text-sm shadow border border-white/10"
            style={{ backgroundColor: getAvatarBg(player.name) }}
          >
            {getInitials(player.name)}
          </div>
          <div>
            <h3 className="text-lg font-bold font-display text-text-primary tracking-wide leading-snug">
              {player.name}
            </h3>
            <p className="text-xs text-text-secondary">
              Age {player.age} · {player.city}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge role={player.role} />
          {overallRating > 0 && <Badge rating={overallRating} />}
        </div>
      </div>

      {/* Middle Section: Scores and bars */}
      <div className="space-y-3 pt-3 border-t border-border-subtle/50">
        {overallRating > 0 ? (
          <>
            {/* Technical Score Row */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-text-secondary">
                <span>Technical Style</span>
                <span className="font-mono text-text-primary">{formatRating(technicalScore)}</span>
              </div>
              <div className="w-full bg-bg-primary h-1.5 rounded-full overflow-hidden border border-border-subtle/30">
                <div 
                  className="bg-brand-green h-full transition-all duration-[600ms] rounded-full"
                  style={{ width: animate ? `${technicalScore * 10}%` : '0%' }}
                />
              </div>
            </div>

            {/* Potential Score Row */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-text-secondary">
                <span>Growth Potential</span>
                <span className="font-mono text-text-primary">{formatRating(potentialScore)}</span>
              </div>
              <div className="w-full bg-bg-primary h-1.5 rounded-full overflow-hidden border border-border-subtle/30">
                <div 
                  className="bg-brand-green h-full transition-all duration-[600ms] rounded-full"
                  style={{ width: animate ? `${potentialScore * 10}%` : '0%' }}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="py-4 text-center">
            <span className="text-xs text-text-disabled uppercase tracking-wider font-display font-medium">
              No Report Generated
            </span>
          </div>
        )}
      </div>

      {/* Bottom Section: CTA Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-border-subtle/50">
        <Button
          variant={overallRating > 0 ? 'primary' : 'secondary'}
          onClick={() => onViewReport(player)}
          className="text-xs px-3.5 py-1.5 flex items-center space-x-1.5 font-display uppercase tracking-wider"
          aria-label={`View scouting report for ${player.name}`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{overallRating > 0 ? 'View Report' : 'Start Scout'}</span>
        </Button>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleWatchlistToggle}
            className={`p-2 rounded border border-border-subtle bg-bg-surface hover:bg-bg-hover hover:border-text-secondary transition-all ${
              isWatchlisted ? 'text-brand-green border-brand-green/20 bg-brand-green/5' : 'text-text-secondary'
            }`}
            aria-label={isWatchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            <Star className={`w-4 h-4 ${isWatchlisted ? 'fill-brand-green text-brand-green' : ''}`} />
          </button>
          
          <button
            onClick={handleDelete}
            className="p-2 rounded border border-border-subtle bg-bg-surface text-text-secondary hover:text-brand-red hover:border-brand-red/30 hover:bg-brand-red/5 transition-all"
            aria-label={`Delete profile of ${player.name}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );
});

PlayerCard.displayName = 'PlayerCard';
