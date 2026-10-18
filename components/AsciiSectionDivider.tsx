import React, { useRef, useEffect } from 'react';

export type SectionDividerVariant = 'solid' | 'telemetry' | 'pattern' | 'hybrid' | 'interactive';

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

  // ── VARIANT: Monospace ASCII Telemetry & Ticker Strip ─────────────────────
  if (variant === 'telemetry') {
    return (
      <div
        className={`w-full bg-white border-y-2 border-black font-mono text-[11px] font-bold select-none overflow-hidden py-1 px-4 flex items-center justify-between text-black transition-colors hover:bg-neo-yellow/10 ${className}`}
        aria-hidden="true"
      >
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-neo-green font-black">┌──</span>
          <span className="px-1.5 py-0.5 bg-black text-white text-[10px] tracking-wider uppercase font-black shadow-sm">
            SEC.{sectionNumber}
          </span>
          <span className="text-black uppercase tracking-wider font-extrabold">{sectionTitle}.sys</span>
          <span className="text-gray-400 hidden sm:inline">├─── 0x{sectionNumber}FF ───</span>
        </div>

        <div className="font-mono text-[10px] text-gray-500 hidden md:flex items-center gap-3">
          <span>[ BUFFER: 1024K ]</span>
          <span>[ LATENCY: &lt;1.2ms ]</span>
          <span className="text-neo-green font-bold">[ STATUS: NOMINAL ]</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-gray-400 hidden sm:inline">───┤</span>
          <span className="px-1.5 py-0.5 bg-neo-yellow text-black border border-black text-[10px] uppercase font-black shadow-sm">
            SYSTEM_OK
          </span>
          <span className="text-neo-pink font-black">──┐</span>
        </div>
      </div>
    );
  }

  // ── VARIANT: Dense Repeating ASCII Density Block Pattern ──────────────────
  if (variant === 'pattern') {
    return (
      <div
        className={`w-full bg-black text-white border-y-2 border-black font-mono text-[11px] font-bold select-none overflow-hidden py-1.5 px-3 flex items-center justify-between tracking-wider ${className}`}
        aria-hidden="true"
      >
        <div className="flex items-center gap-1.5 overflow-hidden whitespace-nowrap text-white/90">
          <span className="text-neo-pink font-black">░▒▓█</span>
          <span className="text-white">┼──[ SEC.{sectionNumber} // {sectionTitle} ]──┼</span>
          <span className="text-neo-yellow font-black">01010101</span>
          <span className="text-gray-400">░▒▓█▓▒░</span>
          <span className="text-neo-cyan hidden md:inline">┼── λ_TENSOR_FLOW ──┼</span>
          <span className="text-neo-green hidden lg:inline">░▒▓█ [ 0x{sectionNumber}A_RUN ] █▓▒░</span>
          <span className="text-gray-500 hidden xl:inline">┼── RESILIENT_PIPELINE ──┼</span>
        </div>

        <span className="text-neo-yellow text-[10px] shrink-0 font-mono font-black ml-2 px-1.5 py-0.5 bg-black border border-neo-yellow">
          [ 0x{sectionNumber} ]
        </span>
      </div>
    );
  }

  // ── VARIANT: Hybrid Solid 4px Line with Embedded System Chip ───────────────
  if (variant === 'hybrid') {
    return (
      <div className={`w-full relative flex items-center justify-center my-0 ${className}`} aria-hidden="true">
        {/* Heavy 4px black line backbone */}
        <div className="w-full h-1 bg-black" />

        {/* Centered Embedded Neo-Brutalist ASCII Plate */}
        <div className="absolute px-3 py-1 bg-white text-black border-2 border-black font-mono text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-neo-sm z-10">
          <span className="w-2 h-2 rounded-full bg-neo-green animate-pulse" />
          <span className="px-1.5 py-0.2 bg-black text-neo-yellow font-bold text-[10px]">[ 0{sectionNumber} ]</span>
          <span className="font-extrabold">{sectionTitle}</span>
          <span className="text-gray-500 text-[10px] hidden sm:inline">:: SYS.OK</span>
        </div>
      </div>
    );
  }

  // ── VARIANT: Dynamic Interactive Canvas ASCII Seam ────────────────────────
  return (
    <InteractiveSeam
      sectionNumber={sectionNumber}
      sectionTitle={sectionTitle}
      className={className}
    />
  );
};

// ── Interactive Seam Canvas Subcomponent ─────────────────────────────────────
const INTERACTIVE_CHARS = ['┼', '═', '─', '░', '▒', '▓', 'λ', '0', '1', '§', 'θ', 'σ', '#', '+'];

const InteractiveSeam: React.FC<{ sectionNumber: string; sectionTitle: string; className?: string }> = ({
  sectionNumber,
  sectionTitle,
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

    const resize = () => {
      if (containerRef.current && canvas) {
        const rect = containerRef.current.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = 26;
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      if (width === 0 || height === 0) return;

      ctx.fillStyle = '#08080C';
      ctx.fillRect(0, 0, width, height);

      const cellW = 14;
      const cols = Math.floor(width / cellW);
      ctx.font = 'bold 11px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const now = performance.now();
      const mouseX = mouseXRef.current;

      for (let c = 0; c < cols; c++) {
        const x = c * cellW + cellW / 2;
        const distToMouse = Math.abs(x - mouseX);

        if (distToMouse < 90) {
          // Cursor proximity: high-energy scramble with brand colors!
          const proximity = 1 - distToMouse / 90;
          const charIdx = (c + Math.floor(now * 0.05)) % INTERACTIVE_CHARS.length;
          const char = INTERACTIVE_CHARS[charIdx];

          if (proximity > 0.6) {
            ctx.fillStyle = '#FFE600'; // Neo-Yellow
          } else if (proximity > 0.3) {
            ctx.fillStyle = '#00FF7F'; // Neo-Green
          } else {
            ctx.fillStyle = '#00E5FF'; // Neo-Cyan
          }
          ctx.fillText(char, x, height / 2);
        } else {
          // Ambient circuit pattern
          const isTagPos = c >= 3 && c <= 18;
          if (isTagPos && c === 3) {
            ctx.fillStyle = '#00FF7F';
            ctx.fillText(`[ 0x${sectionNumber} // ${sectionTitle} ]`, x + 50, height / 2);
          } else if (!isTagPos) {
            const sym = (c % 6 === 0) ? '┼' : '─';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
            ctx.fillText(sym, x, height / 2);
          }
        }
      }

      if (isHoveredRef.current) {
        rafId = requestAnimationFrame(render);
      } else {
        // Draw one clean rest frame and stop
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
  }, [sectionNumber, sectionTitle]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-[26px] bg-[#08080C] border-y-2 border-black overflow-hidden relative cursor-crosshair ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export default AsciiSectionDivider;
