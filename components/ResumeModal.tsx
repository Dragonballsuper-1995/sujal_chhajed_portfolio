import React, { useEffect, useState } from 'react';
import { X, Download, ExternalLink, FileText, Loader2 } from 'lucide-react';
import { PERSONAL_INFO } from '../constants';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GOOGLE_DRIVE_FILE_ID = '1IZu6KY1qTSuwFVJevxrT5JkJPtKgP54t';
const PREVIEW_URL = `https://drive.google.com/file/d/${GOOGLE_DRIVE_FILE_ID}/preview`;
const DIRECT_DOWNLOAD_URL = `https://drive.google.com/uc?export=download&id=${GOOGLE_DRIVE_FILE_ID}`;

const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const [isIframeLoading, setIsIframeLoading] = useState(true);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-8 animate-fadeIn"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] flex flex-col max-h-[92vh] z-10 overflow-hidden animate-scaleIn">
        {/* Header Bar */}
        <div className="bg-neo-yellow px-4 sm:px-6 py-3.5 border-b-4 border-black flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 bg-black text-white border-2 border-black">
              <FileText size={18} />
            </div>
            <div className="min-w-0">
              <div className="inline-block px-2 py-0.2 bg-neo-pink text-white font-mono text-[10px] font-black uppercase tracking-wider border border-black shadow-[1px_1px_0px_0px_#000]">
                LIVE PREVIEW
              </div>
              <h2
                id="resume-modal-title"
                className="font-sans text-base sm:text-lg md:text-xl font-black text-black uppercase tracking-tight truncate leading-tight mt-0.5"
              >
                Sujal_Chhajed_Resume.pdf
              </h2>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Direct Download Button */}
            <a
              href={DIRECT_DOWNLOAD_URL}
              download="Sujal_Chhajed_Resume.pdf"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold px-3 py-1.5
                bg-neo-green text-black border-2 border-black shadow-neo-sm
                hover:bg-white hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              title="Download PDF directly to your device"
            >
              <Download size={13} />
              <span className="hidden sm:inline">Download PDF</span>
              <span className="sm:hidden">PDF</span>
            </a>

            {/* Open in Drive Button */}
            <a
              href={PERSONAL_INFO.resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold px-3 py-1.5
                bg-white text-black border-2 border-black shadow-neo-sm
                hover:bg-neo-yellow hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              title="Open in Google Drive"
            >
              <ExternalLink size={13} />
              <span className="hidden sm:inline">Google Drive</span>
              <span className="sm:hidden">Drive</span>
            </a>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 bg-black text-white hover:bg-neo-pink hover:text-black border-2 border-black transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body: Google Drive PDF Viewer Embed */}
        <div className="relative flex-1 w-full bg-[#202124] min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden">
          {/* Loading Indicator */}
          {isIframeLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-canvas text-black z-10 font-mono">
              <Loader2 size={32} className="animate-spin text-black" />
              <p className="text-xs font-bold uppercase tracking-wider">Loading Resume Document...</p>
              <a
                href={DIRECT_DOWNLOAD_URL}
                className="text-xs underline text-neo-pink font-bold mt-2"
              >
                Slow connection? Download PDF directly ➔
              </a>
            </div>
          )}

          <iframe
            src={PREVIEW_URL}
            title="Sujal Chhajed Resume"
            className="w-full h-full border-0"
            style={{ minHeight: '68vh' }}
            onLoad={() => setIsIframeLoading(false)}
            allow="autoplay"
          />
        </div>

        {/* Footer Note */}
        <div className="bg-canvas px-4 py-2 border-t-2 border-black font-mono text-[11px] text-gray-700 flex flex-col sm:flex-row items-center justify-between gap-1 shrink-0">
          <span>Synced directly with Google Drive • Always current</span>
          <span className="text-black font-bold">Press ESC or click outside to exit</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ResumeModal);
