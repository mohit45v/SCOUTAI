import React, { useState } from 'react';
import { useFirestore } from '@/hooks/useFirestore';
import { WatchlistView } from '@/components/features/watchlist/WatchlistView';
import { Modal } from '@/components/ui/Modal';
import { ReportView } from '@/components/features/scout/ReportView';
import { Spinner } from '@/components/ui/Spinner';
import { Player } from '@/types';
import { AlertCircle } from 'lucide-react';

export const WatchlistPage: React.FC = () => {
  const { players, loading, error } = useFirestore();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewReport = (player: Player) => {
    if (player.report) {
      setSelectedPlayer(player);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlayer(null);
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Spinner />
          <p className="text-sm text-text-secondary mt-4">Syncing watchlist database...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-brand-red/10 border border-brand-red/20 rounded-lg text-brand-red flex items-center space-x-3 max-w-lg mx-auto">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      ) : (
        <WatchlistView players={players} onViewReport={handleViewReport} />
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
