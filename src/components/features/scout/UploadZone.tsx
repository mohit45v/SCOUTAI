import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertTriangle } from 'lucide-react';
import { validateFile } from '@/lib/validators';

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelected }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const processFile = async (file: File) => {
    setError(null);
    setSelectedFile(null);

    const validation = await validateFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file selected.');
      return;
    }

    setSelectedFile(file);
    onFileSelected(file);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFile(e.target.files[0]);
    }
  };

  const triggerBrowse = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold font-display text-text-primary text-center tracking-wide">
        2. Upload Technique Media
      </h2>
      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerBrowse}
        role="button"
        tabIndex={0}
        aria-label="Upload cricket media file. Drag and drop photo or video here, or press Enter to browse."
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') triggerBrowse();
        }}
        className={`w-full min-h-[220px] rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center space-y-3 ${
          isDragOver
            ? 'border-brand-green bg-brand-green/5 shadow-[0_0_15px_rgba(57,255,20,0.1)]'
            : error
            ? 'border-brand-red bg-brand-red/5'
            : selectedFile
            ? 'border-brand-green bg-brand-green/5'
            : 'border-border-subtle bg-bg-surface hover:border-text-secondary'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,video/mp4"
          className="hidden"
          onChange={handleFileChange}
        />

        {selectedFile ? (
          <>
            <CheckCircle className="w-12 h-12 text-brand-green" />
            <div className="space-y-1">
              <p className="text-text-primary font-semibold truncate max-w-[280px] font-display text-lg">
                {selectedFile.name}
              </p>
              <p className="text-xs text-text-secondary font-mono">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · {selectedFile.type}
              </p>
            </div>
            <p className="text-xs text-brand-green font-semibold">Media Verified & Ready for AI Analysis</p>
          </>
        ) : error ? (
          <>
            <AlertTriangle className="w-12 h-12 text-brand-red" />
            <div className="space-y-1">
              <p className="text-brand-red font-bold font-display text-lg">Upload Failed</p>
              <p className="text-xs text-text-secondary max-w-[320px] font-semibold">{error}</p>
            </div>
            <p className="text-xs text-text-secondary underline font-medium">Click to select another file</p>
          </>
        ) : (
          <>
            <Upload className="w-12 h-12 text-text-secondary transition-transform duration-300 hover:-translate-y-1" />
            <div className="space-y-1">
              <p className="text-text-primary font-semibold">
                Drag & Drop media here or <span className="text-brand-green hover:underline">Browse files</span>
              </p>
              <p className="text-xs text-text-secondary">
                JPEG, PNG, WEBP images, or MP4 videos
              </p>
              <p className="text-[10px] text-text-disabled font-mono">Max file size: 10MB</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
