import React, { useEffect, useState } from 'react';
import { Spinner } from '../../ui/Spinner';

interface AnalysisLoaderProps {
  status: 'uploading' | 'analyzing';
  progress: number;
}

export const AnalysisLoader: React.FC<AnalysisLoaderProps> = ({ status, progress }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { text: 'Visual media processed & resized', active: progress >= 10, done: progress >= 30 },
    { text: 'Player stance and alignment detected', active: progress >= 30 && progress < 60, done: progress >= 60 },
    { text: 'Gemini Vision AI evaluating techniques', active: progress >= 60 && progress < 85, done: progress >= 85 },
    { text: 'Compiling structured scouting report', active: progress >= 85, done: progress >= 100 },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6 max-w-md mx-auto bg-bg-surface border border-border-subtle rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.5)] animate-fade-in-up">
      <Spinner />
      
      <div className="w-full text-center space-y-2">
        <h3 className="text-xl font-bold font-display text-text-primary uppercase tracking-wider">
          {status === 'uploading' ? 'Uploading & Processing' : 'Analyzing Form'}{dots}
        </h3>
        
        {/* Progress Bar Container */}
        <div className="w-full bg-bg-primary h-2 rounded-full overflow-hidden border border-border-subtle">
          <div
            className="bg-brand-green h-full transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-sm font-mono text-brand-green font-bold">
          {progress}% Complete
        </p>
      </div>

      <div className="w-full space-y-3 pt-4 border-t border-border-subtle text-left">
        <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2 font-display">
          Scouting pipeline status:
        </p>
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center space-x-3 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                step.done
                  ? 'bg-brand-green shadow-[0_0_8px_rgba(57,255,20,0.8)]'
                  : step.active
                  ? 'bg-brand-amber animate-pulse'
                  : 'bg-text-disabled'
              }`}
            />
            <span
              className={`${
                step.done
                  ? 'text-text-primary font-medium'
                  : step.active
                  ? 'text-brand-amber font-semibold'
                  : 'text-text-disabled'
              }`}
            >
              {step.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
