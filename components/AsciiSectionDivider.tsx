import React, { useRef, useEffect } from 'react';

export type ChipColorStyle = 'standard' | 'hover-multicolor' | 'vertical-blocks';
export type SeamActivation = 'off' | 'on-hover' | 'on-click' | 'both';

interface AsciiSectionDividerProps {
  sectionNumber?: string;
  sectionTitle?: string;
  className?: string;
  chipColorStyle?: ChipColorStyle;
  seamActivation?: SeamActivation;
}

// ── Website Brand Colors Palette ─────────────────────────────────────────────
const BRAND_COLORS = [
  '#FFDE59', // Neo-Yellow
  '#FF66C4', // Neo-Pink
  '#7ED957', // Neo-Green
  '#5CE1E6', // Neo-Cyan / Blue
  '#8C52FF', // Neo-Purple
  '#FF914D', // Neo-Orange
];

const INTERACTIVE_CHARS = ['┼', '═', '─', '░', '▒', '▓', 'λ', '0', '1', '§', 'θ', 'σ', '#', '+', '★', '▲'];

/**
 * AsciiSectionDivider
 *
 * Edge-to-edge 16px interactive ASCII canvas seam that scrambles in brand colors on cursor proximity,
 * combined with a centered Neo-Brutalist sticker chip with selectable website color styles and
 * seam activation triggers (on-hover adjacent scramble, on-click propagation wave).
 */
export const AsciiSectionDivider: React.FC<AsciiSectionDividerProps> = ({
  sectionNumber = '01',
  sectionTitle = 'SECTION',
  className = '',
  chipColorStyle = 'standard',
  seamActivation = 'off',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseXRef = useRef<number>(-999);
  const isHoveredRef = useRef(false);
  const isChipHoveredRef = useRef(false);
  const clickWaveRef = useRef<{ active: boolean; startTime: number; duration: number }>({
    active: false,
    startTime: 0,
    duration: 750,
  });

  // Reference to trigger canvas redraw externally
  const requestRenderRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId: number | null = null;
    const seamHeight = 16; // 16px slim seam line

    const resize = () => {
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = seamHeight;
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      if (width === 0 || height === 0) return;

      // Dark background matching site aesthetic
      ctx.fillStyle = '#08080C';
      ctx.fillRect(0, 0, width, height);

      const cellW = 12;
      const cols = Math.floor(width / cellW);
      ctx.font = 'bold 9px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const now = performance.now();
      const mouseX = mouseXRef.current;
      const interactionRadius = 75; // Focused scramble radius around cursor
      const centerX = width / 2;

      // Seam activation states
      const isChipHoverActive =
        (seamActivation === 'on-hover' || seamActivation === 'both') && isChipHoveredRef.current;
      const isClickWaveActive =
        (seamActivation === 'on-click' || seamActivation === 'both') && clickWaveRef.current.active;

      let waveProgress = 0;
      let waveRadius = 0;
      if (isClickWaveActive) {
        const elapsed = now - clickWaveRef.current.startTime;
        if (elapsed >= clickWaveRef.current.duration) {
          clickWaveRef.current.active = false;
        } else {
          waveProgress = elapsed / clickWaveRef.current.duration;
          waveRadius = waveProgress * (width / 2);
        }
      }

      for (let c = 0; c < cols; c++) {
        const x = c * cellW + cellW / 2;
        const distToMouse = Math.abs(x - mouseX);
        const distFromCenter = Math.abs(x - centerX);

        // 1. Cursor hover directly on seam line
        let isExcited = isHoveredRef.current && distToMouse < interactionRadius;
        let excitationFactor = isExcited ? 1 - distToMouse / interactionRadius : 0;

        // 2. Chip hover proximity activation (seam close to chip scrambles!)
        if (isChipHoverActive) {
          const chipActivationRadius = 140; // Adjacent seam zone on both sides of chip
          if (distFromCenter < chipActivationRadius) {
            const factor = 1 - distFromCenter / chipActivationRadius;
            if (factor > excitationFactor) {
              isExcited = true;
              excitationFactor = factor;
            }
          }
        }

        // 3. Chip click outward wave propagation across seam
        if (isClickWaveActive) {
          const distFromWaveFront = Math.abs(distFromCenter - waveRadius);
          const waveBand = 60; // Width of propagating wave crest
          if (distFromWaveFront < waveBand) {
            const factor = (1 - distFromWaveFront / waveBand) * (1 - waveProgress * 0.4);
            if (factor > excitationFactor) {
              isExcited = true;
              excitationFactor = factor;
            }
          }
        }

        if (isExcited) {
          // Cursor / Chip proximity: vibrant ASCII scramble cycling through ALL website brand colors!
          const charIdx = (c + Math.floor(now * 0.045)) % INTERACTIVE_CHARS.length;
          const char = INTERACTIVE_CHARS[charIdx];

          const colorIdx =
            (c * 2 + Math.floor(now * 0.007) + Math.floor(excitationFactor * 4)) % BRAND_COLORS.length;
          ctx.fillStyle = BRAND_COLORS[colorIdx];
          ctx.fillText(char, x, height / 2);
        } else {
          // Ambient circuit pattern behind the chip
          const sym = c % 4 === 0 ? '┼' : '─';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
          ctx.fillText(sym, x, height / 2);
        }
      }

      if (isHoveredRef.current || isChipHoveredRef.current || clickWaveRef.current.active) {
        rafId = requestAnimationFrame(render);
      } else {
        rafId = null;
      }
    };

    requestRenderRef.current = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(render);
      }
    };

    // Draw initial static state
    render();

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      if (!rafId) rafId = requestAnimationFrame(render);
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      mouseXRef.current = -999;
      render();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseXRef.current = e.clientX - rect.left;
    };

    const el = containerRef.current;
    if (el) {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
      el.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (el) {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
        el.removeEventListener('mousemove', handleMouseMove);
      }
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [seamActivation]);

  // Chip hover handlers
  const handleChipMouseEnter = () => {
    isChipHoveredRef.current = true;
    if (requestRenderRef.current) requestRenderRef.current();
  };

  const handleChipMouseLeave = () => {
    isChipHoveredRef.current = false;
    if (requestRenderRef.current) requestRenderRef.current();
  };

  // Chip click handler for outward seam wave
  const handleChipClick = () => {
    if (seamActivation === 'on-click' || seamActivation === 'both') {
      clickWaveRef.current = {
        active: true,
        startTime: performance.now(),
        duration: 800,
      };
      if (requestRenderRef.current) requestRenderRef.current();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`w-full relative flex items-center justify-center cursor-crosshair py-3.5 select-none ${className}`}
      aria-hidden="true"
    >
      {/* 16px slim interactive seam line */}
      <div className="w-full h-4 bg-[#08080C] border-y border-black overflow-hidden relative">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* ── CHIP COLOR STYLE 1: Standard Punchy Sticker ───────────────────── */}
      {chipColorStyle === 'standard' && (
        <div
          onClick={handleChipClick}
          onMouseEnter={handleChipMouseEnter}
          onMouseLeave={handleChipMouseLeave}
          className="absolute z-10 flex items-stretch border-2 border-black shadow-[4px_4px_0px_0px_#000000] overflow-hidden transition-transform hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000000] cursor-pointer"
        >
          <div className="bg-black text-neo-yellow px-2.5 py-1 font-mono text-xs font-black flex items-center border-r-2 border-black">
            #{sectionNumber}
          </div>
          <div className="bg-neo-yellow text-black px-3.5 py-1 font-mono text-xs font-black uppercase tracking-wider flex items-center gap-2">
            <span>{sectionTitle}</span>
            <span className="text-black/60 text-[9px]">.SYS</span>
          </div>
        </div>
      )}

      {/* ── CHIP COLOR STYLE 2: Hover Multi-Color Dynamic Badge ───────────── */}
      {chipColorStyle === 'hover-multicolor' && (
        <div
          onClick={handleChipClick}
          onMouseEnter={handleChipMouseEnter}
          onMouseLeave={handleChipMouseLeave}
          className="group absolute z-10 flex items-stretch border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[5px_5px_0px_0px_#FF66C4] overflow-hidden transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
        >
          {/* Left sector badge: changes to vibrant Neo-Pink on hover */}
          <div className="bg-black text-neo-yellow group-hover:bg-[#FF66C4] group-hover:text-black px-2.5 py-1 font-mono text-xs font-black flex items-center border-r-2 border-black transition-colors duration-300">
            #{sectionNumber}
          </div>
          {/* Right title plate: shifts into vibrant multi-color rainbow gradient on hover */}
          <div className="bg-neo-yellow text-black group-hover:bg-gradient-to-r group-hover:from-[#FFDE59] group-hover:via-[#5CE1E6] group-hover:to-[#FF66C4] px-3.5 py-1 font-mono text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all duration-300">
            {/* Multi-color vertical bars reveal on hover */}
            <div className="hidden group-hover:flex items-center gap-0.5 mr-1" aria-hidden="true">
              <span className="w-1 h-3 bg-[#7ED957]" />
              <span className="w-1 h-3 bg-[#8C52FF]" />
              <span className="w-1 h-3 bg-[#FF914D]" />
            </div>
            <span>{sectionTitle}</span>
            <span className="text-black/70 group-hover:text-black group-hover:bg-white/80 group-hover:px-1 text-[9px] font-mono transition-all">
              .SYS
            </span>
          </div>
        </div>
      )}

      {/* ── CHIP COLOR STYLE 3: Vertical Block Pattern Palette ────────────── */}
      {chipColorStyle === 'vertical-blocks' && (
        <div
          onClick={handleChipClick}
          onMouseEnter={handleChipMouseEnter}
          onMouseLeave={handleChipMouseLeave}
          className="absolute z-10 flex items-stretch border-2 border-black shadow-[4px_4px_0px_0px_#000000] overflow-hidden transition-transform hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000000] cursor-pointer"
        >
          {/* Left sector badge */}
          <div className="bg-black text-neo-yellow px-2.5 py-1 font-mono text-xs font-black flex items-center border-r-2 border-black">
            #{sectionNumber}
          </div>

          {/* Vertical Palette Bar: 6 vertical block stripes of the website colors */}
          <div className="flex items-stretch border-r-2 border-black" aria-hidden="true">
            <div className="w-1.5 bg-[#FFDE59]" /> {/* Yellow */}
            <div className="w-1.5 bg-[#FF66C4]" /> {/* Pink */}
            <div className="w-1.5 bg-[#7ED957]" /> {/* Green */}
            <div className="w-1.5 bg-[#5CE1E6]" /> {/* Cyan */}
            <div className="w-1.5 bg-[#8C52FF]" /> {/* Purple */}
            <div className="w-1.5 bg-[#FF914D]" /> {/* Orange */}
          </div>

          {/* Right title plate with high-contrast text and micro color indicator */}
          <div className="bg-neo-yellow text-black px-3.5 py-1 font-mono text-xs font-black uppercase tracking-wider flex items-center gap-2">
            <span>{sectionTitle}</span>
            <span className="px-1 py-0.5 bg-black text-white text-[9px] font-mono border-l-2 border-[#5CE1E6]">
              .SYS
            </span>
          </div>

          {/* Trailing vertical block end-cap */}
          <div className="flex items-stretch border-l-2 border-black" aria-hidden="true">
            <div className="w-1.5 bg-[#FF914D]" />
            <div className="w-1.5 bg-[#5CE1E6]" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AsciiSectionDivider;
