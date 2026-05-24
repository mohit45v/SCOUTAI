import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useFirestore } from '@/hooks/useFirestore';
import { useGemini } from '@/hooks/useGemini';
import { PlayerForm } from '@/components/features/scout/PlayerForm';
import { UploadZone } from '@/components/features/scout/UploadZone';
import { AnalysisLoader } from '@/components/features/scout/AnalysisLoader';
import { ReportView } from '@/components/features/scout/ReportView';
import { Button } from '@/components/ui/Button';
import { UserPlus, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { Player } from '@/types';

export const ScoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetPlayerId = searchParams.get('playerId');
  
  const { players, addPlayer } = useFirestore();
  const { uploadState, report, analyzePlayer, reset: resetGemini } = useGemini();

  const [step, setStep] = useState<'register' | 'upload' | 'analyzing' | 'report'>('register');
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);

  // If a playerId query param is present, locate the player and skip registration
  useEffect(() => {
    if (targetPlayerId && players.length > 0) {
      const match = players.find((p) => p.id === targetPlayerId);
      if (match) {
        setActivePlayer(match);
        // If they already have a report, view it, else go to upload
        if (match.report) {
          setStep('report');
        } else {
          setStep('upload');
        }
      }
    }
  }, [targetPlayerId, players]);

  // Handle Player registration form submission
  const handleRegisterPlayer = async (playerInput: Omit<Player, 'id' | 'createdAt' | 'watchlisted'>) => {
    try {
      const newId = await addPlayer(playerInput);
      const newPlayer: Player = {
        id: newId,
        createdAt: new Date().toISOString(),
        watchlisted: false,
        ...playerInput
      };
      setActivePlayer(newPlayer);
      setStep('upload');
    } catch (err) {
      console.error(err);
    }
  };

  // Handle File selection and trigger analysis
  const handleFileSelected = async (file: File) => {
    if (!activePlayer) return;
    setStep('analyzing');
    try {
      await analyzePlayer(file, activePlayer);
      setStep('report');
    } catch (err) {
      console.error('Scouting analysis failed:', err);
      setStep('upload');
    }
  };

  const handleStartOver = () => {
    resetGemini();
    setActivePlayer(null);
    setStep('register');
    navigate('/scout');
  };

  return (
    <div className="space-y-6">
      {/* Back Button / Navigation Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
        <div className="flex items-center space-x-3">
          <UserPlus className="w-8 h-8 text-brand-green" />
          <div>
            <h1 className="text-3xl font-bold font-display text-text-primary tracking-wide">
              Scouting Assistant
            </h1>
            <p className="text-sm text-text-secondary">
              Register a cricketer and evaluate their batting or bowling form using Gemini Vision.
            </p>
          </div>
        </div>

        {step !== 'register' && step !== 'analyzing' && (
          <Button
            variant="ghost"
            onClick={handleStartOver}
            className="flex items-center space-x-2 text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>New Scout</span>
          </Button>
        )}
      </div>

      {/* Workflow Steps Switch */}
      <div className="py-4">
        {step === 'register' && (
          <PlayerForm onSubmit={handleRegisterPlayer} />
        )}

        {step === 'upload' && activePlayer && (
          <div className="space-y-4">
            <div className="text-center bg-bg-surface/50 border border-border-subtle/50 py-3 rounded-lg max-w-xl mx-auto text-sm text-text-secondary font-display font-medium">
              Registered Scout Target: <span className="text-brand-green font-bold">{activePlayer.name}</span> ({activePlayer.role})
            </div>
            <UploadZone onFileSelected={handleFileSelected} />
          </div>
        )}

        {step === 'analyzing' && (
          <AnalysisLoader
            status={uploadState.status === 'uploading' ? 'uploading' : 'analyzing'}
            progress={uploadState.progress}
          />
        )}

        {step === 'report' && activePlayer && (
          <div className="space-y-6">
            {report ? (
              <ReportView player={activePlayer} report={report} />
            ) : activePlayer.report ? (
              <ReportView player={activePlayer} report={activePlayer.report} />
            ) : (
              <div className="p-4 bg-brand-red/10 border border-brand-red/20 rounded-lg text-brand-red text-center">
                Report data missing.
              </div>
            )}
            
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="secondary"
                onClick={() => navigate('/')}
                className="px-6 py-2"
              >
                Back to Dashboard
              </Button>
              <Button
                variant="primary"
                onClick={handleStartOver}
                className="px-6 py-2 flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Evaluate Another Player</span>
              </Button>
            </div>
          </div>
        )}

        {/* Global Error Banner */}
        {uploadState.error && step === 'upload' && (
          <div className="p-4 bg-brand-red/10 border border-brand-red/20 rounded-lg text-brand-red flex items-center space-x-3 max-w-xl mx-auto mt-4">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-xs font-semibold">{uploadState.error}</span>
          </div>
        )}
      </div>
    </div>
  );
};
