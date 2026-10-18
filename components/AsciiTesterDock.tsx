import React, { useState } from 'react';
import { PhotoColorMode } from './AsciiPhoto';
import { SectionDividerVariant } from './AsciiSectionDivider';
import { ChevronDown, ChevronUp, Palette, MinusSquare } from 'lucide-react';

interface AsciiTesterDockProps {
  photoColorMode: PhotoColorMode;
  onChangePhotoColorMode: (mode: PhotoColorMode) => void;
  dividerMode: SectionDividerVariant;
  onChangeDividerMode: (mode: SectionDividerVariant) => void;
}

const PHOTO_COLOR_OPTIONS: { id: PhotoColorMode; label: string }[] = [
  { id: 'classic', label: 'Classic Green' },
  { id: 'chromatic', label: 'Chromatic Luma' },
  { id: 'photo-rgb', label: 'Photo RGB' },
  { id: 'multi-glitch', label: 'Multi-Glitch' },
];

const DIVIDER_OPTIONS: { id: SectionDividerVariant; label: string }[] = [
  { id: 'solid', label: 'Solid Line' },
  { id: 'telemetry', label: 'Telemetry' },
  { id: 'pattern', label: 'Pattern' },
  { id: 'hybrid', label: 'Hybrid Chips' },
  { id: 'interactive', label: 'Interactive Seam' },
];

export const AsciiTesterDock: React.FC<AsciiTesterDockProps> = ({
  photoColorMode,
  onChangePhotoColorMode,
  dividerMode,
  onChangeDividerMode,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <aside
      aria-label="ASCII FX & Divider Controls"
      className="fixed bottom-5 right-5 z-40 select-none animate-fadeIn font-mono"
    >
      <div className="bg-white border-2 border-black shadow-neo flex flex-col items-stretch overflow-hidden max-w-sm sm:max-w-md">
        {/* Header / Minimize bar */}
        <div className="bg-black text-white px-3 py-1.5 flex items-center justify-between gap-3 text-xs border-b-2 border-black">
          <div className="flex items-center gap-1.5 font-bold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-neo-green inline-block animate-pulse" />
            <span className="text-[11px]">ASCII FX &amp; Divider Tester</span>
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
          <div className="p-3 bg-neo-white flex flex-col gap-2.5">
            {/* Row 1: Photo ASCII Color Modes */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                <Palette size={11} className="text-neo-pink" /> 1. Photo ASCII Colors:
              </span>
              <div className="flex items-center gap-1 flex-wrap">
                {PHOTO_COLOR_OPTIONS.map(opt => {
                  const isActive = photoColorMode === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onChangePhotoColorMode(opt.id)}
                      className={`
                        px-2 py-0.5 text-[10px] font-bold uppercase transition-all cursor-pointer border-2
                        ${isActive
                          ? 'bg-neo-yellow text-black border-black shadow-neo-sm font-black -translate-y-0.5'
                          : 'bg-white text-gray-700 border-black/30 hover:border-black hover:bg-gray-100 hover:text-black'
                        }
                      `}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 2: Section Break Line Styles */}
            <div className="flex flex-col gap-1 pt-2 border-t border-black/15">
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                <MinusSquare size={11} className="text-neo-cyan" /> 2. Section Break Lines:
              </span>
              <div className="flex items-center gap-1 flex-wrap">
                {DIVIDER_OPTIONS.map(opt => {
                  const isActive = dividerMode === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onChangeDividerMode(opt.id)}
                      className={`
                        px-2 py-0.5 text-[10px] font-bold uppercase transition-all cursor-pointer border-2
                        ${isActive
                          ? 'bg-neo-green text-black border-black shadow-neo-sm font-black -translate-y-0.5'
                          : 'bg-white text-gray-700 border-black/30 hover:border-black hover:bg-gray-100 hover:text-black'
                        }
                      `}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default React.memo(AsciiTesterDock);
