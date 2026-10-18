import React, { useState } from 'react';
import { SectionDividerVariant } from './AsciiSectionDivider';
import { ChevronDown, ChevronUp, MinusSquare, Check } from 'lucide-react';

interface AsciiTesterDockProps {
  dividerMode: SectionDividerVariant;
  onChangeDividerMode: (mode: SectionDividerVariant) => void;
}

const DIVIDER_OPTIONS: { id: SectionDividerVariant; label: string; desc: string }[] = [
  { id: 'solid', label: 'Solid Line', desc: 'Classic 4px black neo-brutalist line' },
  { id: 'hybrid', label: 'Hybrid Chip', desc: 'Solid line with centered system chip' },
  { id: 'interactive', label: 'Interactive Seam', desc: 'Slim ASCII seam in all brand colors' },
  { id: 'hybrid-interactive', label: 'Hybrid + Interactive', desc: 'Interactive brand seam + centered chip' },
];

export const AsciiTesterDock: React.FC<AsciiTesterDockProps> = ({
  dividerMode,
  onChangeDividerMode,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <aside
      aria-label="Section Divider Controls"
      className="fixed bottom-5 right-5 z-40 select-none animate-fadeIn font-mono"
    >
      <div className="bg-white border-2 border-black shadow-neo flex flex-col items-stretch overflow-hidden max-w-xs sm:max-w-sm">
        {/* Header / Minimize bar */}
        <div className="bg-black text-white px-3 py-1.5 flex items-center justify-between gap-3 text-xs border-b-2 border-black">
          <div className="flex items-center gap-1.5 font-bold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-neo-green inline-block animate-pulse" />
            <span className="text-[11px]">Section Divider Tester</span>
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
          <div className="p-3 bg-neo-white flex flex-col gap-2">
            <div className="flex items-center justify-between text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-0.5">
              <span className="flex items-center gap-1">
                <MinusSquare size={11} className="text-neo-cyan" /> Divider Style:
              </span>
              <span className="text-neo-green flex items-center gap-0.5 text-[9px]">
                <Check size={10} /> Photo: Photo RGB
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {DIVIDER_OPTIONS.map(opt => {
                const isActive = dividerMode === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onChangeDividerMode(opt.id)}
                    title={opt.desc}
                    className={`
                      px-2.5 py-1.5 text-[10px] font-bold uppercase transition-all cursor-pointer border-2 text-center
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
        )}
      </div>
    </aside>
  );
};

export default React.memo(AsciiTesterDock);
