import React, { useRef, useEffect } from 'react';

export type SectionDividerVariant = 'solid' | 'hybrid' | 'interactive' | 'hybrid-interactive';

interface AsciiSectionDividerProps {
  variant?: SectionDividerVariant;
  sectionNumber?: string;
  sectionTitle?: string;
  className?: string;
}

export const AsciiSectionDivider: React.FC<AsciiSectionDividerProps> = ({
  variant = 'solid',
  sectionNumber = '01',
  sectionTitle = 'SECTION',
  className = '',
}) => {
  // ── VARIANT: Solid Black 4px Neo-Brutalist Line ────────────────────────────
  if (variant === 'solid') {
    return <div className={`w-full h-1 bg-black ${className}`} aria-hidden="true" />;
  }

  // ── VARIANT: Hybrid Solid Line with Centered System Chip ───────────────────
  if (variant === 'hybrid') {
    return (
      <div className={`w-full relative flex items-center justify-center my-0 ${className}`} aria-hidden="true">
        {/* Heavy 4px black line backbone */}
        <div className="w-full h-1 bg-black" />

        {/* Centered Embedded Neo-Brutalist ASCII Plate */}
        <div className="absolute px-3 py-0.5 bg-white text-black border-2 border-black font-mono text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-neo-sm z-10 select-none">
          <span className="w-2 h-2 rounded-full bg-neo-green animate-pulse" />
          <span className="px-1.5 py-0.2 bg-black text-neo-yellow font-bold text-[10px]">[ 0{sectionNumber} ]</span>
          <span className="font-extrabold">{sectionTitle}</span>
          <span className="text-gray-500 text-[10px] hidden sm:inline">:: SYS.OK</span>
        </div>
      </div>
    );
  }

  // ── VARIANT: Hybrid + Interactive (Interactive Seam + Centered System Chip) ─
  if (variant === 'hybrid-interactive') {
    return (
      <InteractiveSeam
        sectionNumber={sectionNumber}
        sectionTitle={sectionTitle}
        className={className}
        withChip={true}
      />
    );
  }

  // ── VARIANT: Dynamic Interactive Canvas ASCII Seam ────────────────────────
  return (
    <InteractiveSeam
      sectionNumber={sectionNumber}
      sectionTitle={sectionTitle}
      className={className}
      withChip={false}
    />
  );
};

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

interface InteractiveSeamProps {
  sectionNumber: string;
  sectionTitle: string;
  className?: string;
  withChip?: boolean;
}

const InteractiveSeam: React.FC<InteractiveSeamProps> = ({
  sectionNumber,
  sectionTitle,
  className = '',
  withChip = false,
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
    const seamHeight = 16; // Decreased slim height for crisp neo-brutalist divider

    const resize = () => {
      if (containerRef.current && canvas) {
        const rect = containerRef.current.getBoundingClientRect();
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
          // Ambient circuit pattern
          const isTagPos = c >= 3 && c <= 17;
          if (isTagPos && c === 3 && !withChip) {
            ctx.fillStyle = 'rgba(126, 217, 87, 0.85)'; // Neo-Green brand accent
            ctx.fillText(`[ 0x${sectionNumber} // ${sectionTitle} ]`, x + 42, height / 2);
          } else if (!isTagPos || withChip) {
            const sym = (c % 4 === 0) ? '┼' : '─';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
            ctx.fillText(sym, x, height / 2);
          }
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
  }, [sectionNumber, sectionTitle, withChip]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-4 bg-[#08080C] border-y border-black overflow-hidden relative flex items-center justify-center cursor-crosshair ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Embedded Centered Chip for Hybrid + Interactive mode */}
      {withChip && (
        <div className="absolute px-2.5 py-0.5 bg-white text-black border-2 border-black font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-neo-sm z-10 select-none pointer-events-none transition-all">
          <span className="w-1.5 h-1.5 rounded-full bg-neo-green animate-pulse" />
          <span className="px-1 py-0.1 bg-black text-neo-yellow font-bold text-[9px]">[ 0{sectionNumber} ]</span>
          <span className="font-extrabold">{sectionTitle}</span>
          <span className="text-gray-500 text-[9px] hidden sm:inline">:: INTERACTIVE</span>
        </div>
      )}
    </div>
  );
};

export default AsciiSectionDivider;
