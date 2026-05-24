import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirestore } from '@/hooks/useFirestore';
import { FilterBar } from '@/components/features/dashboard/FilterBar';
import { PlayerGrid } from '@/components/features/dashboard/PlayerGrid';
import { Modal } from '@/components/ui/Modal';
import { ReportView } from '@/components/features/scout/ReportView';
import { Spinner } from '@/components/ui/Spinner';
import { Player } from '@/types';
import { Trophy, AlertCircle } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { players, loading, error } = useFirestore();
  const [filters, setFilters] = useState({
    search: '',
    role: 'All',
    minRating: 0,
    watchlistOnly: false
  });
  
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      // 1. Search filter
      if (filters.search && !player.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      // 2. Role filter
      if (filters.role !== 'All' && player.role !== filters.role) {
        return false;
      }
      // 3. Min Rating filter
      const overall = player.report?.overallRating ?? 0;
      if (filters.minRating > 0 && overall < filters.minRating) {
        return false;
      }
      // 4. Watchlist filter
      if (filters.watchlistOnly && !player.watchlisted) {
        return false;
      }
      return true;
    });
  }, [players, filters]);

  const handleViewReport = (player: Player) => {
    if (player.report) {
      setSelectedPlayer(player);
      setIsModalOpen(true);
    } else {
      // Redirect to scout flow for players with no reports
      navigate(`/scout?playerId=${player.id}`);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlayer(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-3 pb-4 border-b border-border-subtle">
        <Trophy className="w-8 h-8 text-brand-green" />
        <div>
          <h1 className="text-3xl font-bold font-display text-text-primary tracking-wide">
            Scouting Dashboard
          </h1>
          <p className="text-sm text-text-secondary">
            Real-time talent directory. View technical ratings and request detailed reports.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar onFilterChange={setFilters} />

      {/* Main Grid / Loader / Error */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Spinner />
          <p className="text-sm text-text-secondary mt-4">Syncing grassroots player profiles...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-brand-red/10 border border-brand-red/20 rounded-lg text-brand-red flex items-center space-x-3 max-w-lg mx-auto">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      ) : (
        <PlayerGrid players={filteredPlayers} onViewReport={handleViewReport} />
      )}

      {/* Scouting Report Viewer Modal */}
      {selectedPlayer && selectedPlayer.report && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={`Scouting Evaluation — ${selectedPlayer.name}`}
        >
          <ReportView player={selectedPlayer} report={selectedPlayer.report} />
        </Modal>
      )}
    </div>
  );
};
