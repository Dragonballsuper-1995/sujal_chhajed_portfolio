import React, { useRef, useEffect } from 'react';

interface AsciiSectionDividerProps {
  sectionNumber?: string;
  sectionTitle?: string;
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
 * AsciiSectionDivider (Finalized: Hybrid + Interactive with Punchy Sticker Plate)
 *
 * Combines an edge-to-edge 16px interactive ASCII canvas seam that scrambles across all
 * website brand colors on cursor proximity, with a prominent centered two-tone
 * Neo-Brutalist sticker chip (#0X | SECTION.SYS) that stands proud above and below the seam.
 */
export const AsciiSectionDivider: React.FC<AsciiSectionDividerProps> = ({
  sectionNumber = '01',
  sectionTitle = 'SECTION',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseXRef = useRef<number>(-999);
  const isHoveredRef = useRef(false);

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

      for (let c = 0; c < cols; c++) {
        const x = c * cellW + cellW / 2;
        const distToMouse = Math.abs(x - mouseX);

        if (distToMouse < interactionRadius) {
          // Cursor proximity: vibrant ASCII scramble cycling through ALL website brand colors!
          const proximity = 1 - distToMouse / interactionRadius;
          const charIdx = (c + Math.floor(now * 0.045)) % INTERACTIVE_CHARS.length;
          const char = INTERACTIVE_CHARS[charIdx];

          // Distribute across all 6 website brand colors
          const colorIdx = (c * 2 + Math.floor(now * 0.007) + Math.floor(proximity * 4)) % BRAND_COLORS.length;
          ctx.fillStyle = BRAND_COLORS[colorIdx];
          ctx.fillText(char, x, height / 2);
        } else {
          // Ambient circuit pattern behind the chip
          const sym = (c % 4 === 0) ? '┼' : '─';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
          ctx.fillText(sym, x, height / 2);
        }
      }

      if (isHoveredRef.current) {
        rafId = requestAnimationFrame(render);
      } else {
        rafId = null;
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
      // Re-draw one final rest frame
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

      {/* Finalized Centered Two-Tone Punchy Neo-Brutalist Sticker Plate */}
      <div className="absolute z-10 flex items-stretch border-2 border-black shadow-[4px_4px_0px_0px_#000000] overflow-hidden transition-transform hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000000]">
        <div className="bg-black text-neo-yellow px-2.5 py-1 font-mono text-xs font-black flex items-center border-r-2 border-black">
          #{sectionNumber}
        </div>
        <div className="bg-neo-yellow text-black px-3.5 py-1 font-mono text-xs font-black uppercase tracking-wider flex items-center gap-2">
          <span>{sectionTitle}</span>
          <span className="text-black/60 text-[9px]">.SYS</span>
        </div>
      </div>
    </div>
  );
};

export default AsciiSectionDivider;
