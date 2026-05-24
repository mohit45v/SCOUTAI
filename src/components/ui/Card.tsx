import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverGlow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverGlow = true,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-bg-surface border border-border-subtle rounded-lg p-5 transition-all duration-300 ${
        hoverGlow
          ? 'hover:border-brand-green hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(57,255,20,0.15)]'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
