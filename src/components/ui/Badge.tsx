import React from 'react';
import { Player } from '@/types';

interface BadgeProps {
  role?: Player['role'];
  rating?: number;
  className?: string;
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ role, rating, className = '', children }) => {
  if (role) {
    const roleStyles = {
      Batsman: 'bg-chip-bat text-text-primary border border-blue-500/30',
      Bowler: 'bg-chip-bowl text-text-primary border border-orange-500/30',
      'All-rounder': 'bg-chip-all text-text-primary border border-emerald-500/30',
      WK: 'bg-chip-wk text-text-primary border border-purple-500/30',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wider uppercase font-display ${roleStyles[role]} ${className}`}>
        {role}
      </span>
    );
  }

  if (rating !== undefined) {
    const getRatingStyles = (val: number) => {
      if (val >= 7.5) return 'bg-brand-green/10 text-brand-green border border-brand-green/20';
      if (val >= 5.0) return 'bg-brand-amber/10 text-brand-amber border border-brand-amber/20';
      return 'bg-brand-red/10 text-brand-red border border-brand-red/20';
    };

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-sm font-bold font-mono border ${getRatingStyles(rating)} ${className}`}>
        ★ {rating.toFixed(1)}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-bg-hover text-text-secondary border border-border-subtle ${className}`}>
      {children}
    </span>
  );
};
