import React from 'react';

export const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-brand-green focus:text-bg-primary focus:px-4 focus:py-2 focus:rounded focus:z-50 focus:outline-none focus:ring-2 focus:ring-brand-green font-display font-semibold uppercase tracking-wider"
    >
      Skip to main content
    </a>
  );
};
