import React, { useState } from 'react';
import { ChipColorStyle } from './AsciiSectionDivider';
import { Palette, Minimize2, Maximize2 } from 'lucide-react';

interface ChipColourTesterDockProps {
  chipColorStyle: ChipColorStyle;
  onChangeChipColorStyle: (style: ChipColorStyle) => void;
}

export const ChipColourTesterDock: React.FC<ChipColourTesterDockProps> = ({
  chipColorStyle,
  onChangeChipColorStyle,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const OPTIONS: { id: ChipColorStyle; label: string; desc: string; colors: string[] }[] = [
    {
      id: 'calibration-strip',
      label: '1. Calibration Strip (Vertical Blocks)',
      desc: 'Punchy Yellow & Black plate with a permanent 6-color SMPTE vertical calibration strip',
      colors: ['#FFDE59', '#FF66C4', '#7ED957', '#5CE1E6', '#8C52FF', '#FF914D'],
    },
    {
      id: 'chromatic-prism',
      label: '2. Chromatic Prism (Spectrum on Hover)',
      desc: 'Classic sticker at rest; on hover explodes with a 3-layer chromatic shadow & top prism rail',
      colors: ['#FFDE59', '#FF66C4', '#5CE1E6', '#8C52FF'],
    },
    {
      id: 'cyber-industrial',
      label: '3. Cyber Industrial Telemetry',
      desc: 'Cyan #0X badge + crisp ivory title + yellow SYS.OK diode + bottom 6-color rail',
      colors: ['#5CE1E6', '#FAF8F5', '#FFDE59', '#7ED957'],
    },
    {
      id: 'punchy-sticker-pure',
      label: '4. Original Punchy Sticker (Baseline)',
      desc: 'The original iconic Cyber Yellow & Black punchy sticker badge (no extra color bands)',
      colors: ['#000000', '#FFDE59'],
    },
  ];

  return (
    <aside
      aria-label="Chip Colour Style Tester Dock"
      className="fixed bottom-5 right-5 z-[99998] select-none font-mono text-xs max-w-[calc(100vw-2.5rem)] sm:max-w-sm transition-all duration-200"
    >
      <div className="bg-[#0A0A10] text-white border-2 border-black shadow-[5px_5px_0px_0px_#000000] overflow-hidden">
        {/* ── Dock Header ────────────────────────────────────────────── */}
        <header className="bg-neo-yellow text-black px-3 py-1.5 border-b-2 border-black flex items-center justify-between font-black tracking-wider">
          <div className="flex items-center gap-1.5">
            <Palette size={13} className="text-black" />
            <span className="text-[11px] uppercase">CHIP_REDESIGN_STUDIO.SYS</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 hover:bg-black hover:text-neo-yellow transition-colors border border-black/40 rounded-[2px]"
              title={isCollapsed ? 'Expand Dock' : 'Collapse Dock'}
              aria-label={isCollapsed ? 'Expand Dock' : 'Collapse Dock'}
            >
              {isCollapsed ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
            </button>
          </div>
        </header>

        {/* ── Expanded Options ────────────────────────────────────────── */}
        {!isCollapsed && (
          <div className="p-2.5 space-y-2">
            <div className="text-[10px] text-gray-400 font-bold px-0.5">
              TEST NEW CENTERED CHIP CONCEPTS:
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {OPTIONS.map((opt) => {
                const isActive = chipColorStyle === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => onChangeChipColorStyle(opt.id)}
                    className={`p-2 text-left border transition-all rounded-[1px] ${
                      isActive
                        ? 'bg-neo-yellow text-black border-black font-black shadow-[2px_2px_0px_0px_#000]'
                        : 'bg-[#14141E] text-gray-300 border-white/10 hover:border-white/40 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[11px]">{opt.label}</span>
                      <div className="flex items-center gap-0.5" aria-hidden="true">
                        {opt.colors.map((c, i) => (
                          <span
                            key={i}
                            className="w-2.5 h-2.5 rounded-[1px] border border-black/30"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                    <div
                      className={`text-[9.5px] leading-snug ${
                        isActive ? 'text-black/85' : 'text-gray-400'
                      }`}
                    >
                      {opt.desc}
                    </div>
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

export default ChipColourTesterDock;
