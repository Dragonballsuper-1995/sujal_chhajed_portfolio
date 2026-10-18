import React, { useRef, useEffect } from 'react';

export type ChipColorStyle =
  | 'calibration-strip'
  | 'chromatic-prism'
  | 'cyber-industrial'
  | 'punchy-sticker-pure';

interface AsciiSectionDividerProps {
  sectionNumber?: string;
  sectionTitle?: string;
  className?: string;
  chipColorStyle?: ChipColorStyle;
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
 * with synchronized outward wave on chip click (matching the background matrix wave speed)
 * and adjacent seam scramble on chip hover.
 *
 * Centered Chip Designs:
 * 1. Calibration Strip: High-contrast Punchy Sticker with a dedicated 6-color vertical test-pattern strip.
 * 2. Chromatic Prism: Classic punchy sticker at rest; on hover explodes into a 3-layer chromatic spectrum shadow & top rail.
 * 3. Cyber Industrial: High-tech hardware telemetry module with cyan sector, ivory title plate, and yellow status tag.
 * 4. Original Punchy Sticker: The iconic, high-contrast Cyber Yellow & Black baseline.
 */
export const AsciiSectionDivider: React.FC<AsciiSectionDividerProps> = ({
  sectionNumber = '01',
  sectionTitle = 'SECTION',
  className = '',
  chipColorStyle = 'calibration-strip',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseXRef = useRef<number>(-999);
  const isHoveredRef = useRef(false);
  const isChipHoveredRef = useRef(false);
  const clickWaveRef = useRef<{ active: boolean; startTime: number }>({
    active: false,
    startTime: 0,
  });

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

      // Match speed exactly with BackgroundGrid matrix wave:
      const viewportH = window.innerHeight || 900;
      const matrixSpeed = (Math.max(width, viewportH) * 0.95) / 900; // px per ms

      let waveRadius = 0;
      let waveProgress = 0;
      const isClickWaveActive = clickWaveRef.current.active;

      if (isClickWaveActive) {
        const elapsed = now - clickWaveRef.current.startTime;
        waveRadius = elapsed * matrixSpeed;
        waveProgress = Math.min(1, waveRadius / (width / 2));

        if (waveRadius > width / 2 + 80) {
          clickWaveRef.current.active = false;
        }
      }

      const isChipHoverActive = isChipHoveredRef.current;

      for (let c = 0; c < cols; c++) {
        const x = c * cellW + cellW / 2;
        const distToMouse = Math.abs(x - mouseX);
        const distFromCenter = Math.abs(x - centerX);

        // 1. Cursor hover directly on seam line
        let isExcited = isHoveredRef.current && distToMouse < interactionRadius;
        let excitationFactor = isExcited ? 1 - distToMouse / interactionRadius : 0;

        // 2. Chip hover proximity activation (seam close to chip scrambles)
        if (isChipHoverActive) {
          const chipActivationRadius = 150; // Adjacent seam zone on both sides of chip
          if (distFromCenter < chipActivationRadius) {
            const factor = 1 - distFromCenter / chipActivationRadius;
            if (factor > excitationFactor) {
              isExcited = true;
              excitationFactor = factor;
            }
          }
        }

        // 3. Chip click outward wave propagation (matched to matrix wave speed!)
        if (isClickWaveActive) {
          const distFromWaveFront = Math.abs(distFromCenter - waveRadius);
          const waveBand = 65; // Width of propagating wave crest
          if (distFromWaveFront < waveBand) {
            const factor = (1 - distFromWaveFront / waveBand) * (1 - waveProgress * 0.35);
            if (factor > excitationFactor) {
              isExcited = true;
              excitationFactor = factor;
            }
          }
        }

        if (isExcited) {
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
  }, []);

  // Chip hover handlers (triggers adjacent seam activation)
  const handleChipMouseEnter = () => {
    isChipHoveredRef.current = true;
    if (requestRenderRef.current) requestRenderRef.current();
  };

  const handleChipMouseLeave = () => {
    isChipHoveredRef.current = false;
    if (requestRenderRef.current) requestRenderRef.current();
  };

  // Chip click handler (triggers synchronized outward seam wave)
  const handleChipClick = () => {
    clickWaveRef.current = {
      active: true,
      startTime: performance.now(),
    };
    if (requestRenderRef.current) requestRenderRef.current();
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

      {/* ── OPTION 1: Calibration Strip (Permanent Vertical Block Pattern) ── */}
      {chipColorStyle === 'calibration-strip' && (
        <div
          onClick={handleChipClick}
          onMouseEnter={handleChipMouseEnter}
          onMouseLeave={handleChipMouseLeave}
          className="absolute z-10 flex items-stretch border-2 border-black shadow-[4px_4px_0px_0px_#000000] overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000000] cursor-pointer"
        >
          {/* Left Sector Badge: Jet Black with Cyber Yellow text */}
          <div className="bg-black text-[#FFDE59] px-3 py-1.5 font-mono text-xs font-black flex items-center border-r-2 border-black">
            #{sectionNumber}
          </div>

          {/* Integrated 6-Color Vertical Calibration Strip (Permanent without hovering) */}
          <div className="flex items-stretch border-r-2 border-black h-full" aria-hidden="true">
            <div className="w-2.5 bg-[#FFDE59]" /> {/* Yellow */}
            <div className="w-2.5 bg-[#FF66C4]" /> {/* Pink */}
            <div className="w-2.5 bg-[#7ED957]" /> {/* Green */}
            <div className="w-2.5 bg-[#5CE1E6]" /> {/* Cyan */}
            <div className="w-2.5 bg-[#8C52FF]" /> {/* Purple */}
            <div className="w-2.5 bg-[#FF914D]" /> {/* Orange */}
          </div>

          {/* Right Title Body: Cyber Yellow with Bold Black text */}
          <div className="bg-[#FFDE59] text-black px-4 py-1.5 font-mono text-xs font-black uppercase tracking-wider flex items-center gap-2.5">
            <span>{sectionTitle}</span>
            <span className="px-1.5 py-0.5 bg-black text-white text-[9px] font-mono font-bold rounded-[2px]">
              .SYS
            </span>
          </div>
        </div>
      )}

      {/* ── OPTION 2: Chromatic Prism (Multi-Color Spectrum on Hover) ──── */}
      {chipColorStyle === 'chromatic-prism' && (
        <div
          onClick={handleChipClick}
          onMouseEnter={handleChipMouseEnter}
          onMouseLeave={handleChipMouseLeave}
          className="group absolute z-10 flex flex-col border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[3px_3px_0px_0px_#FF66C4,6px_6px_0px_0px_#5CE1E6,9px_9px_0px_0px_#000000] overflow-hidden transition-all duration-200 hover:-translate-y-1 cursor-pointer bg-[#FFDE59]"
        >
          {/* Top Multi-Color Prism Rail (Reveals full intensity on hover) */}
          <div
            className="h-1 w-full bg-gradient-to-r from-[#FFDE59] via-[#FF66C4] via-[#7ED957] via-[#5CE1E6] via-[#8C52FF] to-[#FF914D] border-b border-black/40"
            aria-hidden="true"
          />

          <div className="flex items-stretch">
            {/* Left Sector Badge: Jet Black with Cyber Yellow text */}
            <div className="bg-black text-[#FFDE59] px-3 py-1.5 font-mono text-xs font-black flex items-center border-r-2 border-black">
              #{sectionNumber}
            </div>

            {/* Right Title Body: Cyber Yellow with Bold Black typography */}
            <div className="bg-[#FFDE59] text-black px-4 py-1.5 font-mono text-xs font-black uppercase tracking-wider flex items-center gap-2.5">
              <span>{sectionTitle}</span>
              <span className="px-1.5 py-0.5 bg-black text-white group-hover:bg-[#FF66C4] group-hover:text-black text-[9px] font-mono font-bold rounded-[2px] transition-colors duration-200">
                .SYS
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── OPTION 3: Cyber Industrial Telemetry Module ────────────────── */}
      {chipColorStyle === 'cyber-industrial' && (
        <div
          onClick={handleChipClick}
          onMouseEnter={handleChipMouseEnter}
          onMouseLeave={handleChipMouseLeave}
          className="absolute z-10 flex flex-col border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] overflow-hidden transition-all duration-200 hover:-translate-y-0.5 cursor-pointer bg-white"
        >
          <div className="flex items-stretch">
            {/* Left Sector Badge: Cyber Cyan with Black text */}
            <div className="bg-[#5CE1E6] text-black px-3 py-1.5 font-mono text-xs font-black flex items-center border-r-2 border-black">
              #{sectionNumber}
            </div>

            {/* Center Section Title: High-Contrast Ivory Plate */}
            <div className="bg-[#FAF8F5] text-black px-4 py-1.5 font-mono text-xs font-black uppercase tracking-wider flex items-center border-r-2 border-black">
              {sectionTitle}
            </div>

            {/* Right Telemetry Block: Cyber Yellow with Flashing Status LED */}
            <div className="bg-[#FFDE59] text-black px-2.5 py-1.5 font-mono text-[10px] font-black tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7ED957] animate-pulse border border-black/40" />
              <span>SYS.OK</span>
            </div>
          </div>

          {/* Bottom Continuous Color Grounding Strip */}
          <div className="grid grid-cols-6 h-1 w-full border-t border-black" aria-hidden="true">
            <div className="bg-[#FFDE59]" />
            <div className="bg-[#FF66C4]" />
            <div className="bg-[#7ED957]" />
            <div className="bg-[#5CE1E6]" />
            <div className="bg-[#8C52FF]" />
            <div className="bg-[#FF914D]" />
          </div>
        </div>
      )}

      {/* ── OPTION 4: Original Punchy Sticker (Baseline) ───────────────── */}
      {chipColorStyle === 'punchy-sticker-pure' && (
        <div
          onClick={handleChipClick}
          onMouseEnter={handleChipMouseEnter}
          onMouseLeave={handleChipMouseLeave}
          className="absolute z-10 flex items-stretch border-2 border-black shadow-[4px_4px_0px_0px_#000000] overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000000] cursor-pointer"
        >
          <div className="bg-black text-[#FFDE59] px-3 py-1.5 font-mono text-xs font-black flex items-center border-r-2 border-black">
            #{sectionNumber}
          </div>
          <div className="bg-[#FFDE59] text-black px-4 py-1.5 font-mono text-xs font-black uppercase tracking-wider flex items-center gap-2.5">
            <span>{sectionTitle}</span>
            <span className="text-black/60 text-[9px] font-mono">.SYS</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AsciiSectionDivider;
