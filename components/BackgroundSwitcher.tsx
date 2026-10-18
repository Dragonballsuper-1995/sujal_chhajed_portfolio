import React, { useState, useEffect } from 'react';
import { BackgroundMode } from './BackgroundGrid';
import { PhotoMode } from './AsciiPhoto';
import { ChevronDown, ChevronUp, Grid, Image as ImageIcon } from 'lucide-react';

interface BackgroundSwitcherProps {
  mode: BackgroundMode;
  onChangeMode: (mode: BackgroundMode) => void;
  photoMode?: PhotoMode;
  onChangePhotoMode?: (mode: PhotoMode) => void;
}

const BG_MODES: { id: BackgroundMode; label: string }[] = [
  { id: 'dots', label: 'Dots' },
  { id: 'crosshair', label: 'Crosshairs' },
  { id: 'ascii', label: 'ASCII v1' },
  { id: 'ascii-matrix', label: 'Matrix' },
];

const PHOTO_MODES: { id: PhotoMode; label: string }[] = [
  { id: 'morph', label: 'Morph' },
  { id: 'flip', label: 'Flip' },
  { id: 'scanline', label: 'Scanline' },
  { id: 'standard', label: 'Original' },
];

const BackgroundSwitcher: React.FC<BackgroundSwitcherProps> = ({
  mode,
  onChangeMode,
  photoMode = 'morph',
  onChangePhotoMode,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // Expose console helpers for testing
    if (typeof window !== 'undefined') {
      const sujal = (window as any).sujal || {};

      sujal.setBg = (newMode: BackgroundMode) => {
        if (['dots', 'crosshair', 'ascii', 'ascii-matrix'].includes(newMode)) {
          onChangeMode(newMode);
          return `✓ Background switched to "${newMode}"`;
        }
        return `Unknown mode. Use: 'dots' | 'crosshair' | 'ascii' | 'ascii-matrix'`;
      };

      sujal.setPhoto = (newMode: PhotoMode) => {
        if (['morph', 'flip', 'scanline', 'standard'].includes(newMode)) {
          onChangePhotoMode?.(newMode);
          return `✓ Photo mode switched to "${newMode}"`;
        }
        return `Unknown mode. Use: 'morph' | 'flip' | 'scanline' | 'standard'`;
      };

      (window as any).sujal = sujal;
    }
  }, [onChangeMode, onChangePhotoMode]);

  return (
    <aside
      aria-label="Theme & FX Controls"
      className="fixed bottom-5 right-5 z-40 select-none animate-fadeIn font-mono"
    >
      <div className="bg-white border-2 border-black shadow-neo flex flex-col items-stretch overflow-hidden">
        {/* Header / Minimize bar */}
        <div className="bg-black text-white px-3 py-1.5 flex items-center justify-between gap-3 text-xs border-b-2 border-black">
          <div className="flex items-center gap-1.5 font-bold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-neo-yellow inline-block animate-pulse" />
            <span className="text-[11px]">Dev FX Dock</span>
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
          <div className="p-2.5 flex flex-col gap-2 bg-neo-white">
            {/* Row 1: Background Grid Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider w-12 flex items-center gap-1 shrink-0">
                <Grid size={11} /> Grid:
              </span>
              <div className="flex items-center gap-1 flex-wrap">
                {BG_MODES.map(m => {
                  const isActive = mode === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => onChangeMode(m.id)}
                      className={`
                        px-2 py-0.5 text-[11px] font-bold uppercase transition-all cursor-pointer border-2
                        ${isActive
                          ? 'bg-neo-yellow text-black border-black shadow-neo-sm -translate-y-0.5'
                          : 'bg-white text-gray-700 border-black/30 hover:border-black hover:bg-gray-100 hover:text-black'
                        }
                      `}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 2: Photo ASCII FX Selector */}
            {onChangePhotoMode && (
              <div className="flex items-center gap-1.5 pt-1.5 border-t border-black/10">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider w-12 flex items-center gap-1 shrink-0">
                  <ImageIcon size={11} /> Photo:
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
                          px-2 py-0.5 text-[11px] font-bold uppercase transition-all cursor-pointer border-2
                          ${isActive
                            ? 'bg-neo-green text-black border-black shadow-neo-sm -translate-y-0.5'
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
        )}
      </div>
    </aside>
  );
};

export default React.memo(BackgroundSwitcher);
