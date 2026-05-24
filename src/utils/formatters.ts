/**
 * Formats an ISO date string into a readable format (e.g., "24 May 2026").
 */
export const formatDate = (isoString: string): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';
  
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Formats a rating value to one decimal place.
 */
export const formatRating = (rating: number): string => {
  if (rating === undefined || rating === null) return '0.0';
  return rating.toFixed(1);
};

/**
 * Returns the CSS variable color representing a rating range:
 * - >= 7.5: Neon Lime Green (High potential / performance)
 * - >= 5.0: Amber Orange (Developing)
 * - < 5.0: Red (Needs major improvement / risk)
 */
export const getRatingColorClass = (rating: number): string => {
  if (rating >= 7.5) return 'text-brand-green';
  if (rating >= 5.0) return 'text-brand-amber';
  return 'text-brand-red';
};

/**
 * Returns background opacity colors for rating badges
 */
export const getRatingBgClass = (rating: number): string => {
  if (rating >= 7.5) return 'bg-brand-green/10 border-brand-green/20';
  if (rating >= 5.0) return 'bg-brand-amber/10 border-brand-amber/20';
  return 'bg-brand-red/10 border-brand-red/20';
};
