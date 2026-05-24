import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  Dumbbell, 
  Star, 
  Share2, 
  Calendar, 
  User, 
  Award,
  TrendingUp,
  Activity,
  ArrowRight
} from 'lucide-react';
import { Player, ScoutingReport } from '@/types';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { formatDate } from '@/utils/formatters';
import { useDriveExport } from '@/hooks/useDriveExport';
import { useFirestore } from '@/hooks/useFirestore';

interface ReportViewProps {
  player: Player;
  report: ScoutingReport;
}

export const ReportView: React.FC<ReportViewProps> = ({ player, report }) => {
  const { toggleWatchlist } = useFirestore();
  const { exporting, error: exportError, viewLink, exportReport } = useDriveExport();
  const [isWatchlisted, setIsWatchlisted] = useState(player.watchlisted);
  const [animateWidths, setAnimateWidths] = useState(false);

  // Trigger progress bar animations on mount
  useEffect(() => {
    const t = setTimeout(() => setAnimateWidths(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleWatchlistToggle = async () => {
    try {
      const newState = !isWatchlisted;
      setIsWatchlisted(newState);
      await toggleWatchlist(player.id, newState);
    } catch (err) {
      console.error(err);
      setIsWatchlisted(player.watchlisted); // revert
    }
  };

  const handleExport = async () => {
    // Generate clean self-contained HTML layout for Drive conversion
    const reportHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>ScoutAI report - ${player.name}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.5; margin: 40px; }
          .header { border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
          .title { font-size: 28px; font-weight: bold; color: #0f172a; margin: 0; }
          .meta { font-size: 14px; color: #64748b; margin-top: 5px; }
          .grid { display: table; width: 100%; margin-bottom: 30px; }
          .col { display: table-cell; width: 33.3%; background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 6px; text-align: center; }
          .score-val { font-size: 32px; font-weight: bold; color: #3b82f6; margin: 5px 0; }
          .section { margin-bottom: 25px; }
          .section-title { font-size: 18px; font-weight: bold; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 12px; }
          ul { padding-left: 20px; margin: 0; }
          li { margin-bottom: 8px; }
          .note { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 4px; font-style: italic; }
          .warning { background: #fef2f2; border-left: 4px solid #ef4444; color: #991b1b; padding: 12px; border-radius: 4px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">ScoutAI Player Scouting Report</div>
          <div class="meta">
            <strong>Player Name:</strong> ${player.name} &nbsp;|&nbsp; 
            <strong>Age:</strong> ${player.age} &nbsp;|&nbsp; 
            <strong>Role:</strong> ${player.role} &nbsp;|&nbsp; 
            <strong>Academy:</strong> ${player.academy} &nbsp;|&nbsp; 
            <strong>City:</strong> ${player.city}
          </div>
        </div>

        <div class="grid">
          <div class="col" style="border-right: 0;">
            <strong>Overall Rating</strong>
            <div class="score-val">${report.overallRating.toFixed(1)} / 10</div>
          </div>
          <div class="col" style="border-right: 0;">
            <strong>Technical Skill</strong>
            <div class="score-val">${report.technicalScore.toFixed(1)} / 10</div>
          </div>
          <div class="col">
            <strong>Potential Grade</strong>
            <div class="score-val">${report.potentialScore.toFixed(1)} / 10</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Strengths</div>
          <ul>
            ${report.strengths.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>

        <div class="section">
          <div class="section-title">Areas to Improve</div>
          <ul>
            ${report.weaknesses.map(w => `<li>${w}</li>`).join('')}
          </ul>
        </div>

        <div class="section">
          <div class="section-title">Recommended Drills</div>
          <ul>
            ${report.drillRecommendations.map(d => `<li>${d}</li>`).join('')}
          </ul>
        </div>

        <div class="section">
          <div class="section-title">Scout Notes</div>
          <div class="note">${report.scoutNote}</div>
        </div>

        ${report.injuryRiskFlag ? `
          <div class="warning">
            <strong>⚠️ Injury Risk Warning:</strong> Technical assessment indicates possible loading issues or alignment flaws that could increase injury risk if uncorrected.
          </div>
        ` : ''}
      </body>
      </html>
    `;

    await exportReport(player.id, player.name, reportHtml);
  };

  return (
    <Card hoverGlow={false} className="max-w-3xl mx-auto border border-border-subtle bg-bg-surface p-6 md:p-8 space-y-8 animate-fade-in-up">
      {/* Report Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold font-display text-text-primary tracking-wide leading-none">
              {player.name}
            </h1>
            <Badge role={player.role} />
            {report.injuryRiskFlag && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-display bg-brand-red/10 text-brand-red border border-brand-red/30 animate-pulse">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Injury Risk
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm text-text-secondary">
            <span className="flex items-center">
              <User className="w-4 h-4 mr-1 text-brand-green" />
              Age {player.age} · {player.academy}, {player.city}
            </span>
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1 text-brand-green" />
              Scouted {formatDate(report.analysisTimestamp)}
            </span>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            onClick={handleWatchlistToggle}
            className={`px-4 py-2 flex items-center space-x-2 text-sm ${
              isWatchlisted ? 'text-brand-green border-brand-green/30 bg-brand-green/5' : ''
            }`}
            aria-label={isWatchlisted ? 'Remove player from watchlist' : 'Add player to watchlist'}
          >
            <Star className={`w-4 h-4 ${isWatchlisted ? 'fill-brand-green text-brand-green' : ''}`} />
            <span>{isWatchlisted ? 'Watchlisted' : 'Watchlist'}</span>
          </Button>

          <Button
            variant="primary"
            onClick={handleExport}
            isLoading={exporting}
            className="text-sm px-4 py-2 flex items-center space-x-2"
            aria-label="Export report to Google Drive"
          >
            <Share2 className="w-4 h-4" />
            <span>{exporting ? 'Exporting...' : 'Export to Drive'}</span>
          </Button>
        </div>
      </div>

      {/* Export Success/Error Banner */}
      {viewLink && (
        <div className="p-4 bg-brand-green/10 border border-brand-green/20 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in-up">
          <div className="text-sm text-text-primary">
            <p className="font-semibold text-brand-green">✓ Export Successful!</p>
            <p className="text-text-secondary text-xs">Scouting report uploaded to &quot;ScoutAI Reports&quot; folder in Drive.</p>
          </div>
          <a
            href={viewLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs font-bold text-bg-primary bg-brand-green px-3 py-1.5 rounded hover:bg-brand-green/90 transition-colors font-display tracking-wider uppercase"
          >
            View Document
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </a>
        </div>
      )}

      {exportError && (
        <div className="p-4 bg-brand-red/10 border border-brand-red/20 rounded text-sm text-brand-red">
          <p className="font-semibold">⚠️ Export Failed</p>
          <p className="text-xs text-text-secondary">{exportError}</p>
        </div>
      )}

      {/* Ratings Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Overall Rating', score: report.overallRating, icon: Award },
          { label: 'Technical Score', score: report.technicalScore, icon: Activity },
          { label: 'Potential Score', score: report.potentialScore, icon: TrendingUp },
        ].map((item, idx) => {
          const Icon = item.icon;
          const scorePercent = item.score * 10;
          let barColor = 'bg-brand-green';
          let textColor = 'text-brand-green';
          if (item.score < 5) {
            barColor = 'bg-brand-red';
            textColor = 'text-brand-red';
          } else if (item.score < 7.5) {
            barColor = 'bg-brand-amber';
            textColor = 'text-brand-amber';
          }

          return (
            <div key={idx} className="bg-bg-elevated border border-border-subtle p-5 rounded-lg flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider font-display">
                  {item.label}
                </span>
                <Icon className={`w-4 h-4 ${textColor}`} />
              </div>
              <div className="mt-4 space-y-1">
                <span className={`text-4xl font-bold font-mono ${textColor}`}>
                  {item.score.toFixed(1)}
                </span>
                <span className="text-xs text-text-disabled"> / 10.0</span>
                
                {/* Score bar */}
                <div className="w-full bg-bg-primary h-1.5 rounded-full overflow-hidden border border-border-subtle/50 mt-2">
                  <div
                    className={`${barColor} h-full transition-all duration-[800ms] ease-out rounded-full`}
                    style={{ width: animateWidths ? `${scorePercent}%` : '0%' }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-bg-elevated border border-border-subtle p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-bold font-display text-text-primary border-b border-border-subtle pb-2 flex items-center tracking-wide">
            <CheckCircle className="w-5 h-5 text-brand-green mr-2" />
            Key Technical Strengths
          </h3>
          <ul className="space-y-3">
            {report.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start text-sm text-text-primary">
                <span className="text-brand-green mr-2 font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-bg-elevated border border-border-subtle p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-bold font-display text-text-primary border-b border-border-subtle pb-2 flex items-center tracking-wide">
            <AlertTriangle className="w-5 h-5 text-brand-amber mr-2" />
            Areas for Improvement
          </h3>
          <ul className="space-y-3">
            {report.weaknesses.map((weak, idx) => (
              <li key={idx} className="flex items-start text-sm text-text-primary">
                <span className="text-brand-amber mr-2 font-bold">•</span>
                <span>{weak}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Drill Recommendations */}
      <div className="bg-bg-elevated border border-border-subtle p-6 rounded-lg space-y-4">
        <h3 className="text-lg font-bold font-display text-text-primary border-b border-border-subtle pb-2 flex items-center tracking-wide">
          <Dumbbell className="w-5 h-5 text-brand-green mr-2" />
          Recommended Development Drills
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {report.drillRecommendations.map((drill, idx) => (
            <div key={idx} className="flex items-start bg-bg-surface border border-border-subtle p-3 rounded text-sm">
              <span className="w-5 h-5 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center text-xs font-mono font-bold mr-3 mt-0.5 shrink-0">
                {idx + 1}
              </span>
              <span className="text-text-primary font-medium">{drill}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scout Note Commentary */}
      <div className="bg-bg-elevated border border-border-subtle p-6 rounded-lg space-y-3">
        <h3 className="text-lg font-bold font-display text-text-primary border-b border-border-subtle pb-2 tracking-wide">
          Scout Commentary Note
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed italic">
          &quot;{report.scoutNote}&quot;
        </p>
      </div>
    </Card>
  );
};
