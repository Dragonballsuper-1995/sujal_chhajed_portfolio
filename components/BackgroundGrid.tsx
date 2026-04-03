
import React, { useEffect, useRef } from 'react';

interface BackgroundGridProps {
  theme: 'light' | 'dark';
}

const BackgroundGrid: React.FC<BackgroundGridProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Avoid heavy canvas animation on touch devices (mobile scrolling jank)
    // Must adapt when DevTools toggles device mode.
    const coarseMql = window.matchMedia('(pointer: coarse)');
    let isCoarsePointer = coarseMql.matches;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let mouse = { x: -1000, y: -1000 };

    let rafId: number | null = null;
    let frameRequested = false;

    let handleMouseMove: ((e: MouseEvent) => void) | null = null;
    let handleMouseLeave: (() => void) | null = null;

    const init = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Prevent cumulative scaling on repeated init() calls.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      frameRequested = false;
      ctx.clearRect(0, 0, width, height);

      const space = 40; // Grid spacing
      // Center the grid slightly
      const offsetX = (width % space) / 2;
      const offsetY = (height % space) / 2;

      const cols = Math.floor(width / space);
      const rows = Math.floor(height / space);

      const baseRadius = 1.5;
      // Theme-aware base color (low opacity)
      const baseColor = theme === 'light' ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)';

      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const x = offsetX + c * space;
          const y = offsetY + r * space;

          // Distance from mouse
          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const hoverRadius = 200;

          let radius = baseRadius;
          // Keep color consistent (monochrome low opacity)
          const color = baseColor;

          if (dist < hoverRadius) {
            // Interactive effect
            const intensity = 1 - (dist / hoverRadius);

            // Scale up based on proximity
            radius = baseRadius + (intensity * 4); // Grows up to ~5.5px
          }

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }
      }
    };

    const requestDraw = () => {
      if (isCoarsePointer) {
        // Mobile: draw immediately (no RAF loop)
        draw();
        return;
      }
      if (frameRequested) return;
      frameRequested = true;
      rafId = window.requestAnimationFrame(draw);
    };

    init();

    const handleResize = () => {
      init();
      requestDraw();
    };

    // Always render at least once
    requestDraw();

    window.addEventListener('resize', handleResize);

    // Throttle helper for mousemove (16ms = ~60fps cap)
    let lastMoveTime = 0;
    const THROTTLE_MS = 16;

    const bindPointerListeners = () => {
      // Remove any existing listeners first.
      if (handleMouseMove) window.removeEventListener('mousemove', handleMouseMove);
      if (handleMouseLeave) document.removeEventListener('mouseleave', handleMouseLeave);
      handleMouseMove = null;
      handleMouseLeave = null;

      if (isCoarsePointer) return;

      handleMouseMove = (e: MouseEvent) => {
        const now = performance.now();
        if (now - lastMoveTime < THROTTLE_MS) return; // Skip if within throttle window
        lastMoveTime = now;

        mouse.x = e.clientX;
        mouse.y = e.clientY;
        requestDraw();
      };

      handleMouseLeave = () => {
        mouse.x = -1000;
        mouse.y = -1000;
        requestDraw();
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      document.addEventListener('mouseleave', handleMouseLeave);
    };

    bindPointerListeners();

    const handlePointerModeChange = () => {
      isCoarsePointer = coarseMql.matches;
      mouse = { x: -1000, y: -1000 };
      init();
      requestDraw();
      bindPointerListeners();
    };

    coarseMql.addEventListener('change', handlePointerModeChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (handleMouseMove) window.removeEventListener('mousemove', handleMouseMove);
      if (handleMouseLeave) document.removeEventListener('mouseleave', handleMouseLeave);

      coarseMql.removeEventListener('change', handlePointerModeChange);

      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ willChange: 'transform' }}
      aria-hidden="true"
    />
  );
};

export default React.memo(BackgroundGrid);
