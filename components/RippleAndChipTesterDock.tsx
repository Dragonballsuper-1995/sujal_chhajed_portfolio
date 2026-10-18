import React, { useState } from 'react';
import { RippleTriggerMode, RippleVisualStyle } from './ClickRipple';
import { ChipColorStyle, SeamActivation } from './AsciiSectionDivider';
import { Sparkles, MousePointer, Cpu, Minimize2, Maximize2 } from 'lucide-react';

interface RippleAndChipTesterDockProps {
  rippleTrigger: RippleTriggerMode;
  onChangeRippleTrigger: (mode: RippleTriggerMode) => void;
  rippleVisual: RippleVisualStyle;
  onChangeRippleVisual: (style: RippleVisualStyle) => void;
  chipColorStyle: ChipColorStyle;
  onChangeChipColorStyle: (style: ChipColorStyle) => void;
  seamActivation: SeamActivation;
  onChangeSeamActivation: (activation: SeamActivation) => void;
}

export const RippleAndChipTesterDock: React.FC<RippleAndChipTesterDockProps> = ({
  rippleTrigger,
  onChangeRippleTrigger,
  rippleVisual,
  onChangeRippleVisual,
  chipColorStyle,
  onChangeChipColorStyle,
  seamActivation,
  onChangeSeamActivation,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'ripple' | 'chip'>('ripple');

  return (
    <aside
      aria-label="Interactive FX Tester Dock"
      className="fixed bottom-5 right-5 z-[99998] select-none font-mono text-xs max-w-[calc(100vw-2.5rem)] sm:max-w-sm transition-all duration-200"
    >
      <div className="bg-[#0A0A10] text-white border-2 border-black shadow-[5px_5px_0px_0px_#000000] overflow-hidden">
        {/* ── Dock Header ────────────────────────────────────────────── */}
        <header className="bg-neo-yellow text-black px-3 py-1.5 border-b-2 border-black flex items-center justify-between font-black tracking-wider">
          <div className="flex items-center gap-1.5">
            <Sparkles size={13} className="text-black" />
            <span className="text-[11px] uppercase">FX_TESTER.SYS</span>
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

        {/* ── Expanded Content ────────────────────────────────────────── */}
        {!isCollapsed && (
          <div className="p-3 space-y-3">
            {/* Top Navigation Switch between RIPPLE and CHIP controls */}
            <nav className="grid grid-cols-2 gap-1.5 p-1 bg-black/60 border border-white/20">
              <button
                onClick={() => setActiveTab('ripple')}
                className={`py-1 px-2 flex items-center justify-center gap-1.5 font-bold text-[10px] uppercase transition-all ${
                  activeTab === 'ripple'
                    ? 'bg-neo-yellow text-black shadow-[2px_2px_0px_0px_#000]'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <MousePointer size={11} />
                <span>1. Click Ripple</span>
              </button>
              <button
                onClick={() => setActiveTab('chip')}
                className={`py-1 px-2 flex items-center justify-center gap-1.5 font-bold text-[10px] uppercase transition-all ${
                  activeTab === 'chip'
                    ? 'bg-neo-cyan text-black shadow-[2px_2px_0px_0px_#000]'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Cpu size={11} />
                <span>2. Chip & Seam</span>
              </button>
            </nav>

            {/* ── TAB 1: CLICK RIPPLE CONTROLS ──────────────────────────── */}
            {activeTab === 'ripple' && (
              <div className="space-y-3">
                {/* 1A. Trigger Mode */}
                <div>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold mb-1.5">
                    <span>A) TRIGGER TRIGGER_MODE:</span>
                    <span className="text-neo-yellow">{rippleTrigger.toUpperCase()}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {(
                      [
                        { id: 'global', label: 'Global' },
                        { id: 'dead-space', label: 'Dead Space' },
                        { id: 'off', label: 'Off' },
                      ] as const
                    ).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onChangeRippleTrigger(item.id)}
                        className={`py-1 px-1.5 text-[10px] font-bold border transition-all ${
                          rippleTrigger === item.id
                            ? 'bg-neo-yellow text-black border-black font-black shadow-[2px_2px_0px_0px_#000]'
                            : 'bg-[#14141E] text-gray-300 border-white/10 hover:border-white/40'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 1B. Visual Style */}
                <div>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold mb-1.5">
                    <span>B) VISUAL SHOCKWAVE STYLE:</span>
                    <span className="text-neo-pink">{rippleVisual.toUpperCase()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(
                      [
                        { id: 'neo-rings', label: 'Neo Rings' },
                        { id: 'ascii-shockwave', label: 'ASCII Glyphs' },
                        { id: 'matrix-wave', label: 'Matrix Wave' },
                        { id: 'minimal-glow', label: 'Minimal Glow' },
                      ] as const
                    ).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onChangeRippleVisual(item.id)}
                        className={`py-1 px-2 text-[10px] font-bold border text-left transition-all ${
                          rippleVisual === item.id
                            ? 'bg-neo-pink text-black border-black font-black shadow-[2px_2px_0px_0px_#000]'
                            : 'bg-[#14141E] text-gray-300 border-white/10 hover:border-white/40'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 2: CHIP & SEAM CONTROLS ───────────────────────────── */}
            {activeTab === 'chip' && (
              <div className="space-y-3">
                {/* 2A. Chip Color Style */}
                <div>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold mb-1.5">
                    <span>A) CHIP COLOUR STYLE:</span>
                    <span className="text-neo-cyan">{chipColorStyle.toUpperCase()}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {(
                      [
                        { id: 'standard', label: 'Standard Punchy Sticker' },
                        { id: 'hover-multicolor', label: 'Hover Multi-Color Rainbow' },
                        { id: 'vertical-blocks', label: 'Vertical Blocks Pattern' },
                      ] as const
                    ).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onChangeChipColorStyle(item.id)}
                        className={`py-1 px-2 text-[10px] font-bold border text-left transition-all ${
                          chipColorStyle === item.id
                            ? 'bg-neo-cyan text-black border-black font-black shadow-[2px_2px_0px_0px_#000]'
                            : 'bg-[#14141E] text-gray-300 border-white/10 hover:border-white/40'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2B. Seam Activation */}
                <div>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold mb-1.5">
                    <span>B) SEAM ACTIVATION:</span>
                    <span className="text-neo-green">{seamActivation.toUpperCase()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(
                      [
                        { id: 'off', label: 'Off' },
                        { id: 'on-hover', label: 'On Hover (Nearby)' },
                        { id: 'on-click', label: 'On Click (Wave)' },
                        { id: 'both', label: 'Both (Hover + Click)' },
                      ] as const
                    ).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onChangeSeamActivation(item.id)}
                        className={`py-1 px-2 text-[10px] font-bold border text-left transition-all ${
                          seamActivation === item.id
                            ? 'bg-neo-green text-black border-black font-black shadow-[2px_2px_0px_0px_#000]'
                            : 'bg-[#14141E] text-gray-300 border-white/10 hover:border-white/40'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default RippleAndChipTesterDock;
