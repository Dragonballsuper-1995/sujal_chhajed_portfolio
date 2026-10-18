import React, { useState, useEffect } from 'react';
import { BackgroundMode } from './BackgroundGrid';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface BackgroundSwitcherProps {
  mode: BackgroundMode;
  onChangeMode: (mode: BackgroundMode) => void;
}

const MODES: { id: BackgroundMode; label: string }[] = [
  { id: 'dots', label: 'Dots' },
  { id: 'crosshair', label: 'Crosshairs' },
  { id: 'ascii', label: 'ASCII' },
];

const BackgroundSwitcher: React.FC<BackgroundSwitcherProps> = ({ mode, onChangeMode }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // Expose console helper for testing
    if (typeof window !== 'undefined') {
      const sujal = (window as any).sujal || {};
      sujal.setBg = (newMode: BackgroundMode) => {
        if (['dots', 'crosshair', 'ascii'].includes(newMode)) {
          onChangeMode(newMode);
          return `✓ Background switched to "${newMode}"`;
        }
        return `Unknown mode. Use: 'dots' | 'crosshair' | 'ascii'`;
      };
      (window as any).sujal = sujal;
    }
  }, [onChangeMode]);

  return (
    <aside
      aria-label="Background Switcher"
      className="fixed bottom-5 right-5 z-40 select-none animate-fadeIn font-mono"
    >
      <div className="bg-white border-2 border-black shadow-neo flex flex-col items-stretch overflow-hidden">
        {/* Header / Minimize bar */}
        <div className="bg-black text-white px-3 py-1.5 flex items-center justify-between gap-3 text-xs border-b-2 border-black">
          <div className="flex items-center gap-1.5 font-bold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-neo-yellow inline-block animate-pulse" />
            <span className="text-[11px]">BG Grid</span>
          </div>

          <button
            type="button"
            onClick={() => setIsMinimized(prev => !prev)}
            aria-label={isMinimized ? "Expand Background Switcher" : "Minimize Background Switcher"}
            className="text-gray-300 hover:text-neo-yellow p-0.5 transition-colors cursor-pointer"
          >
            {isMinimized ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Buttons (collapsible) */}
        {!isMinimized && (
          <div className="p-2 flex items-center gap-1.5 bg-neo-white">
            {MODES.map(m => {
              const isActive = mode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onChangeMode(m.id)}
                  className={`
                    px-2.5 py-1 text-xs font-bold uppercase transition-all cursor-pointer border-2
                    ${isActive
                      ? 'bg-neo-yellow text-black border-black shadow-neo-sm -translate-y-0.5'
                      : 'bg-white text-gray-700 border-black/40 hover:border-black hover:bg-gray-100 hover:text-black'
                    }
                  `}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};

export default React.memo(BackgroundSwitcher);
