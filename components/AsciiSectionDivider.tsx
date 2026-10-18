import React, { useRef, useEffect } from 'react';

interface AsciiSectionDividerProps {
  sectionNumber?: string;
  sectionTitle?: string;
  targetSectionId?: string;
  onChipClick?: () => void;
  className?: string;
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
 * AsciiSectionDivider (Finalized: Original Punchy Sticker Baseline + Synchronized Seam Wave)
 *
 * Edge-to-edge 16px interactive ASCII canvas seam that scrambles in brand colors on cursor proximity,
 * with speed-synchronized outward wave on chip click (matching the background matrix wave speed)
 * and adjacent seam scramble on chip hover.
 * The centered chip is locked to the iconic Cyber Yellow & Jet Black Punchy Sticker, and clicking
 * it navigates directly to that section.
 */
export const AsciiSectionDivider: React.FC<AsciiSectionDividerProps> = ({
  sectionNumber = '01',
  sectionTitle = 'SECTION',
  targetSectionId,
  onChipClick,
  className = '',
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

  // Chip click handler: triggers synchronized seam wave AND navigates to that section
  const handleChipClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Trigger synchronized outward wave
    clickWaveRef.current = {
      active: true,
      startTime: performance.now(),
    };
    if (requestRenderRef.current) requestRenderRef.current();

    // Scroll directly to target section
    if (onChipClick) {
      onChipClick();
    } else if (targetSectionId) {
      const el = document.getElementById(targetSectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
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

      {/* ── Finalized Original Punchy Sticker Baseline ─────────────────── */}
      <div
        onClick={handleChipClick}
        onMouseEnter={handleChipMouseEnter}
        onMouseLeave={handleChipMouseLeave}
        className="absolute z-10 flex items-stretch border-2 border-black shadow-[4px_4px_0px_0px_#000000] overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000000] cursor-pointer"
        title={`Navigate to ${sectionTitle}`}
      >
        <div className="bg-black text-[#FFDE59] px-2.5 py-1 font-mono text-xs font-black flex items-center border-r-2 border-black">
          #{sectionNumber}
        </div>
        <div className="bg-[#FFDE59] text-black px-3.5 py-1 font-mono text-xs font-black uppercase tracking-wider flex items-center gap-2">
          <span>{sectionTitle}</span>
          <span className="text-black/60 text-[9px] font-mono">.SYS</span>
        </div>
      </div>
    </div>
  );
};

export default AsciiSectionDivider;
