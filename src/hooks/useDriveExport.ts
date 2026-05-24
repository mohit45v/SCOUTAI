import { useState, useCallback } from 'react';
import { exportToDrive } from '@/lib/drive';

export const useDriveExport = () => {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewLink, setViewLink] = useState<string | null>(null);

  const resetExport = useCallback(() => {
    setExporting(false);
    setError(null);
    setViewLink(null);
  }, []);

  const exportReport = useCallback(async (playerId: string, playerName: string, reportHtml: string) => {
    setExporting(true);
    setError(null);
    setViewLink(null);

    try {
      const result = await exportToDrive(playerId, playerName, reportHtml);
      if (result.success && result.viewLink) {
        setViewLink(result.viewLink);
        return result.viewLink;
      } else {
        throw new Error('Google Drive API did not return a valid shareable view link.');
      }
    } catch (err: any) {
      console.error('Drive export hook error:', err);
      const msg = err.message || 'Failed to export report to Google Drive.';
      setError(msg);
      throw err;
    } finally {
      setExporting(false);
    }
  }, []);

  return {
    exporting,
    error,
    viewLink,
    exportReport,
    resetExport
  };
};
