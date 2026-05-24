import React, { useState, useEffect } from 'react';
import { Search, Star } from 'lucide-react';

interface FilterBarProps {
  onFilterChange: (filters: {
    search: string;
    role: string;
    minRating: number;
    watchlistOnly: boolean;
  }) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [watchlistOnly, setWatchlistOnly] = useState(false);

  // Debounce search input by 300ms as required
  useEffect(() => {
    const handler = setTimeout(() => {
      onFilterChange({
        search,
        role,
        minRating,
        watchlistOnly,
      });
    }, 300);

    return () => clearTimeout(handler);
  }, [search, role, minRating, watchlistOnly, onFilterChange]);

  return (
    <div className="bg-bg-surface border border-border-subtle p-4 rounded-lg space-y-4 shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Debounced Search */}
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cricketers by name..."
            className="w-full bg-bg-primary border border-border-subtle text-text-primary pl-10 pr-4 py-2.5 rounded focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all text-sm"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Role Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-text-secondary uppercase font-display tracking-wider">Role:</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-bg-primary border border-border-subtle text-text-primary px-3 py-2 rounded text-xs focus:outline-none focus:border-brand-green transition-colors cursor-pointer"
            >
              <option value="All">All Roles</option>
              <option value="Batsman">Batsman</option>
              <option value="Bowler">Bowler</option>
              <option value="All-rounder">All-rounder</option>
              <option value="WK">Wicket Keeper (WK)</option>
            </select>
          </div>

          {/* Minimum Rating Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-text-secondary uppercase font-display tracking-wider">Min Rating:</span>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="bg-bg-primary border border-border-subtle text-text-primary px-3 py-2 rounded text-xs focus:outline-none focus:border-brand-green transition-colors cursor-pointer"
            >
              <option value={0}>Any Rating</option>
              <option value={8}>8.0+ (Elite)</option>
              <option value={7}>7.0+</option>
              <option value={5}>5.0+</option>
            </select>
          </div>

          {/* Watchlist Toggle */}
          <button
            onClick={() => setWatchlistOnly(!watchlistOnly)}
            className={`px-4 py-2 rounded border text-xs font-semibold flex items-center space-x-2 transition-all ${
              watchlistOnly
                ? 'text-brand-green border-brand-green/30 bg-brand-green/10 shadow-[0_0_10px_rgba(57,255,20,0.1)]'
                : 'text-text-secondary border-border-subtle bg-bg-primary hover:text-text-primary hover:border-text-secondary'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${watchlistOnly ? 'fill-brand-green text-brand-green' : ''}`} />
            <span>Watchlist Only</span>
          </button>
        </div>
      </div>
    </div>
  );
};
