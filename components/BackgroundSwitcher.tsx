import React, { useState, useEffect } from 'react';
import { PhotoMode } from './AsciiPhoto';
import { ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';

interface BackgroundSwitcherProps {
  photoMode: PhotoMode;
  onChangePhotoMode: (mode: PhotoMode) => void;
}

const PHOTO_MODES: { id: PhotoMode; label: string }[] = [
  { id: 'morph', label: 'Morph' },
  { id: 'morph-flip', label: 'Morph + Flip' },
  { id: 'flip', label: 'Flip' },
  { id: 'standard', label: 'Original' },
];

export const BackgroundSwitcher: React.FC<BackgroundSwitcherProps> = ({
  photoMode,
  onChangePhotoMode,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // Expose console helper for testing
    if (typeof window !== 'undefined') {
      const sujal = (window as any).sujal || {};

      sujal.setPhoto = (newMode: PhotoMode) => {
        if (['morph', 'morph-flip', 'flip', 'standard'].includes(newMode)) {
          onChangePhotoMode(newMode);
          return `✓ Photo mode switched to "${newMode}"`;
        }
        return `Unknown mode. Use: 'morph' | 'morph-flip' | 'flip' | 'standard'`;
      };

      (window as any).sujal = sujal;
    }
  }, [onChangePhotoMode]);

  return (
    <aside
      aria-label="Photo FX Controls"
      className="fixed bottom-5 right-5 z-40 select-none animate-fadeIn font-mono"
    >
      <div className="bg-white border-2 border-black shadow-neo flex flex-col items-stretch overflow-hidden">
        {/* Header / Minimize bar */}
        <div className="bg-black text-white px-3 py-1.5 flex items-center justify-between gap-3 text-xs border-b-2 border-black">
          <div className="flex items-center gap-1.5 font-bold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-neo-green inline-block animate-pulse" />
            <span className="text-[11px]">Photo FX Tester</span>
          </div>

          <button
            type="button"
            onClick={() => setIsMinimized(prev => !prev)}
            aria-label={isMinimized ? "Expand Controls" : "Minimize Controls"}
            className="text-gray-300 hover:text-neo-yellow p-0.5 transition-colors cursor-pointer"
          >
            {isMinimized ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Controls Body (collapsible) */}
        {!isMinimized && (
          <div className="p-2.5 flex items-center gap-1.5 bg-neo-white">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
              <ImageIcon size={11} /> Mode:
            </span>
            <div className="flex items-center gap-1 flex-wrap">
              {PHOTO_MODES.map(p => {
                const isActive = photoMode === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onChangePhotoMode(p.id)}
                    className={`
                      px-2.5 py-1 text-[11px] font-bold uppercase transition-all cursor-pointer border-2
                      ${isActive
                        ? 'bg-neo-yellow text-black border-black shadow-neo-sm -translate-y-0.5'
                        : 'bg-white text-gray-700 border-black/30 hover:border-black hover:bg-gray-100 hover:text-black'
                      }
                    `}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default React.memo(BackgroundSwitcher);
