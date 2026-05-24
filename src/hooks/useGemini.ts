import { useState, useCallback } from 'react';
import { UploadState, ScoutingReport, Player } from '@/types';
import { validateFile } from '@/lib/validators';
import { resizeImage, extractVideoFrame } from '@/utils/imageProcessor';
import { analyzePlayerMedia } from '@/lib/gemini';
import { parseGeminiReport } from '@/utils/reportParser';
import { updatePlayerReport } from '@/lib/firestore';

export const useGemini = () => {
  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'idle',
    progress: 0
  });
  const [report, setReport] = useState<ScoutingReport | null>(null);

  const reset = useCallback(() => {
    setUploadState({ status: 'idle', progress: 0 });
    setReport(null);
  }, []);

  const analyzePlayer = useCallback(async (file: File, player: Player) => {
    try {
      // 1. Validation
      setUploadState({ status: 'uploading', progress: 10 });
      const validation = await validateFile(file);
      if (!validation.valid) {
        throw new Error(validation.error || 'File validation failed.');
      }

      // 2. Image Processing (Resize or extract frame)
      setUploadState({ status: 'uploading', progress: 30 });
      let processed;
      if (file.type.startsWith('video/')) {
        processed = await extractVideoFrame(file);
      } else {
        processed = await resizeImage(file);
      }

      // 3. Gemini Vision API call
      setUploadState({ status: 'analyzing', progress: 60 });
      const rawText = await analyzePlayerMedia(processed.base64, processed.mimeType, player.role);

      // 4. Parse Report Output
      setUploadState({ status: 'analyzing', progress: 85 });
      const scoutingReport = parseGeminiReport(rawText, player.id, player.role);

      // 5. Persist to Firestore
      await updatePlayerReport(player.id, scoutingReport);

      setReport(scoutingReport);
      setUploadState({ status: 'complete', progress: 100 });
      return scoutingReport;
    } catch (err: any) {
      console.error('Scouting analysis error:', err);
      const errorMessage = err.message || 'An unknown error occurred during visual analysis.';
      setUploadState({
        status: 'error',
        progress: 0,
        error: errorMessage
      });
      throw err;
    }
  }, []);

  return {
    uploadState,
    report,
    analyzePlayer,
    reset
  };
};
