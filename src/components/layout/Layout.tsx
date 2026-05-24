import React from 'react';
import { Navbar } from './Navbar';
import { SkipLink } from '../ui/SkipLink';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-bg-primary">
      <SkipLink />
      <Navbar />
      
      {/* main-content is focused by SkipLink */}
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 pb-24 md:pb-8 focus:outline-none"
      >
        {children}
      </main>

      <footer className="w-full bg-bg-surface/30 border-t border-border-subtle py-6 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs text-text-secondary">
          <p>© {new Date().getFullYear()} ScoutAI. GDG Cloud Mumbai - Agentic Premier League.</p>
          <p>Stadium-lit Dark Theme. Authorized Scouting Tool.</p>
        </div>
      </footer>
    </div>
  );
};
