import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-display tracking-wide font-semibold rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-brand-green text-bg-primary hover:bg-brand-green/90 px-6 py-2.5 shadow-[0_0_10px_rgba(57,255,20,0.15)] hover:shadow-[0_0_15px_rgba(57,255,20,0.3)]',
    secondary: 'border border-border-subtle bg-bg-surface text-text-primary hover:bg-bg-hover hover:border-text-secondary px-6 py-2.5',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-bg-hover/50 px-4 py-2',
    danger: 'bg-brand-red text-text-primary hover:bg-brand-red/90 px-6 py-2.5'
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Analyzing...
        </>
      ) : (
        children
      )}
    </button>
  );
};
