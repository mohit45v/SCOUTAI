import React from 'react';

export const Spinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4" role="status">
      <div className="cricket-spinner" />
      <span className="sr-only">Loading...</span>
    </div>
  );
};
