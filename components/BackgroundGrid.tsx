import React, { useEffect, useRef } from 'react';

// Finalized background mode: Pure ASCII Matrix
export type BackgroundMode = 'ascii-matrix';

interface BackgroundGridProps {
  className?: string;
}

const MATRIX_GLYPHS = [
  '0', '1', 'λ', '∂', '∑', '∇', '∫', '≈', 'W', 'b',
  'x', 'σ', 'μ', '0x', 'FF', '7F', 'AI', '::', '->', 'θ'
];

export const BackgroundGrid: React.FC<BackgroundGridProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const coarseMql = window.matchMedia('(pointer: coarse)');
    let isCoarsePointer = coarseMql.matches;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let mouse = { x: -1000, y: -1000 };
    let isMouseInWindow = false;

    let rafId: number | null = null;
    let frameRequested = false;

    let handleMouseMove: ((e: MouseEvent) => void) | null = null;
    let handleMouseLeave: (() => void) | null = null;
    let handleMouseEnter: (() => void) | null = null;

    const init = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

const MATRIX_BRAND_COLORS = [
  '255, 222, 89',  // Neo-Yellow #FFDE59
  '255, 102, 196', // Neo-Pink #FF66C4
  '126, 217, 87',  // Neo-Green #7ED957
  '92, 225, 230',  // Neo-Cyan #5CE1E6
  '140, 82, 255',  // Neo-Purple #8C52FF
  '255, 145, 77',  // Neo-Orange #FF914D
];

    // ──────────────────────────────────────────────────────────────────────────
    // FINALIZED AIRY ASCII MATRIX RENDERER (WITH FADED WEBSITE BRAND COLORS)
    // ──────────────────────────────────────────────────────────────────────────
    const drawAsciiMatrix = (isDark: boolean, cols: number, rows: number, offsetX: number, offsetY: number, space: number) => {
      // Faded website colors with very light shade & opacity (subtle, airy)
      const baseAlpha = isDark ? 0.08 : 0.09;
      const hoverRadius = 160;

      ctx.font = '11px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const glyphCount = MATRIX_GLYPHS.length;
      const colorCount = MATRIX_BRAND_COLORS.length;
      const now = performance.now();

      for (let r = 0; r <= rows; r++) {
        const y = offsetY + r * space;
        const dy = mouse.y - y;
        const absDy = Math.abs(dy);

        for (let c = 0; c <= cols; c++) {
          const x = offsetX + c * space;
          const dx = mouse.x - x;
          const absDx = Math.abs(dx);

          const baseIndex = (c * 13 + r * 29) % glyphCount;
          // Deterministic mapping to faded brand colors across the grid:
          const colorIndex = (c * 7 + r * 11) % colorCount;
          const brandRgb = MATRIX_BRAND_COLORS[colorIndex];

          if (isMouseInWindow && absDx < hoverRadius && absDy < hoverRadius) {
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < hoverRadius) {
              const intensity = 1 - dist / hoverRadius;
              const alpha = baseAlpha + intensity * 0.45;
              const dynamicIndex = Math.floor(baseIndex + (now * 0.005) + (c * 3) + (r * 7)) % glyphCount;
              const activeGlyph = MATRIX_GLYPHS[dynamicIndex];

              // Cursor proximity: symbol illuminates in its vibrant brand color!
              ctx.fillStyle = `rgba(${brandRgb}, ${alpha})`;
              ctx.fillText(activeGlyph, x, y);
              continue;
            }
          }

          // Ambient state: very light, faded pastel shade of the brand color
          ctx.fillStyle = `rgba(${brandRgb}, ${baseAlpha})`;
          ctx.fillText(MATRIX_GLYPHS[baseIndex], x, y);
        }
      }
    };

    const draw = () => {
      frameRequested = false;
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains('dark');
      const space = 50; // Airy, spacious 50px pitch
      const offsetX = (width % space) / 2;
      const offsetY = (height % space) / 2;
      const cols = Math.floor(width / space);
      const rows = Math.floor(height / space);

      drawAsciiMatrix(isDark, cols, rows, offsetX, offsetY, space);
    };

    const requestDraw = () => {
      // Freeze redraws completely if a modal/sheet is open (document.body overflow hidden)
      if (document.body.style.overflow === 'hidden') return;
      if (frameRequested) return;
      frameRequested = true;
      rafId = window.requestAnimationFrame(draw);
    };

    init();
    draw();

    const handleResize = () => {
      init();
      requestDraw();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    let lastMoveTime = 0;
    const THROTTLE_MS = 12;

    const bindPointerListeners = () => {
      if (handleMouseMove) window.removeEventListener('mousemove', handleMouseMove);
      if (handleMouseLeave) document.removeEventListener('mouseleave', handleMouseLeave);
      if (handleMouseEnter) document.removeEventListener('mouseenter', handleMouseEnter);
      handleMouseMove = null;
      handleMouseLeave = null;
      handleMouseEnter = null;

      if (isCoarsePointer) return;

      handleMouseMove = (e: MouseEvent) => {
        // Skip processing when a modal or sheet is open
        if (document.body.style.overflow === 'hidden') return;

        const now = performance.now();
        if (now - lastMoveTime < THROTTLE_MS) return;
        lastMoveTime = now;

        mouse.x = e.clientX;
        mouse.y = e.clientY;
        isMouseInWindow = true;
        requestDraw();
      };

      handleMouseLeave = () => {
        isMouseInWindow = false;
        mouse.x = -1000;
        mouse.y = -1000;
        requestDraw();
      };

      handleMouseEnter = () => {
        isMouseInWindow = true;
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      document.addEventListener('mouseleave', handleMouseLeave);
      document.addEventListener('mouseenter', handleMouseEnter);
    };

    bindPointerListeners();

    const handlePointerModeChange = () => {
      isCoarsePointer = coarseMql.matches;
      mouse = { x: -1000, y: -1000 };
      isMouseInWindow = false;
      init();
      requestDraw();
      bindPointerListeners();
    };

    coarseMql.addEventListener('change', handlePointerModeChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (handleMouseMove) window.removeEventListener('mousemove', handleMouseMove);
      if (handleMouseLeave) document.removeEventListener('mouseleave', handleMouseLeave);
      if (handleMouseEnter) document.removeEventListener('mouseenter', handleMouseEnter);
      coarseMql.removeEventListener('change', handlePointerModeChange);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{
        width: '100vw',
        height: '100vh',
      }}
    />
  );
};

export default React.memo(BackgroundGrid);
