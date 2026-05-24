import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, Star, UserPlus } from 'lucide-react';

export const Navbar: React.FC = () => {
  const activeStyle = "border-b-2 border-brand-green text-brand-green";
  const inactiveStyle = "text-text-secondary hover:text-text-primary border-b-2 border-transparent";
  
  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutGrid },
    { to: '/watchlist', label: 'Watchlist', icon: Star },
    { to: '/scout', label: 'New Scout', icon: UserPlus },
  ];

  return (
    <>
      {/* Desktop Sticky Header */}
      <header className="sticky top-0 z-40 w-full bg-bg-primary/90 border-b border-border-subtle backdrop-blur-md hidden md:block">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <NavLink to="/" className="flex items-center space-x-3 group">
            {/* Wicket SVG */}
            <svg className="w-8 h-8 text-brand-green transition-transform duration-300 group-hover:scale-110" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="25" y="15" width="6" height="70" rx="3" fill="currentColor"/>
              <rect x="47" y="15" width="6" height="70" rx="3" fill="currentColor"/>
              <rect x="69" y="15" width="6" height="70" rx="3" fill="currentColor"/>
              <rect x="20" y="8" width="60" height="6" rx="3" fill="currentColor"/>
            </svg>
            <span className="font-display text-2xl font-bold tracking-wider text-text-primary group-hover:text-brand-green transition-colors">
              Scout<span className="text-brand-green">AI</span>
            </span>
          </NavLink>
          
          <nav className="flex space-x-8 h-full">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => 
                  `font-display font-semibold text-lg uppercase tracking-wider flex items-center px-1 h-16 transition-all duration-200 ${isActive ? activeStyle : inactiveStyle}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile Sticky Header */}
      <header className="sticky top-0 z-40 w-full bg-bg-primary/95 border-b border-border-subtle backdrop-blur-md md:hidden px-4 py-3 flex items-center justify-between">
        <NavLink to="/" className="flex items-center space-x-2">
          <svg className="w-6 h-6 text-brand-green" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="25" y="15" width="6" height="70" rx="3" fill="currentColor"/>
            <rect x="47" y="15" width="6" height="70" rx="3" fill="currentColor"/>
            <rect x="69" y="15" width="6" height="70" rx="3" fill="currentColor"/>
            <rect x="20" y="8" width="60" height="6" rx="3" fill="currentColor"/>
          </svg>
          <span className="font-display text-xl font-bold tracking-wider">ScoutAI</span>
        </NavLink>
      </header>

      {/* Mobile Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-bg-surface/95 border-t border-border-subtle backdrop-blur-md md:hidden flex justify-around items-center h-16 pb-safe">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => 
              `flex flex-col items-center justify-center w-full h-full transition-colors ${isActive ? 'text-brand-green' : 'text-text-secondary hover:text-text-primary'}`
            }
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-[10px] uppercase font-display font-semibold tracking-wide">{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
};
