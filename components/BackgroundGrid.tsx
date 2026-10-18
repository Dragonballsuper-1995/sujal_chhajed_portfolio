import React, { useEffect, useRef } from 'react';

interface BackgroundGridProps {
  theme?: 'light' | 'dark';
}

const BackgroundGrid: React.FC<BackgroundGridProps> = () => {
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

    const space = 36; // Crisp neo-brutalist dot spacing
    const baseRadius = 1.3;
    const hoverRadius = 140;

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

    const draw = () => {
      frameRequested = false;
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains('dark');
      const baseAlpha = isDark ? 0.08 : 0.09;
      const baseColor = isDark ? `rgba(255, 255, 255, ${baseAlpha})` : `rgba(5, 5, 5, ${baseAlpha})`;
      const hoverRgb = isDark ? '255, 255, 255' : '5, 5, 5';

      const offsetX = (width % space) / 2;
      const offsetY = (height % space) / 2;
      const cols = Math.floor(width / space);
      const rows = Math.floor(height / space);

      // Fast path: if mouse is outside the window or on touch device, draw all base dots in one single call
      if (!isMouseInWindow || mouse.x < 0 || mouse.y < 0) {
        ctx.fillStyle = baseColor;
        ctx.beginPath();
        for (let r = 0; r <= rows; r++) {
          const y = offsetY + r * space;
          for (let c = 0; c <= cols; c++) {
            const x = offsetX + c * space;
            ctx.moveTo(x + baseRadius, y);
            ctx.arc(x, y, baseRadius, 0, Math.PI * 2);
          }
        }
        ctx.fill();
        return;
      }

      // When mouse is inside window:
      // Pass 1: Draw base dots that are NOT within hover radius in a single batch
      ctx.fillStyle = baseColor;
      ctx.beginPath();

      // Collect nearby dots to render with dilation
      interface DilatedDot {
        x: number;
        y: number;
        radius: number;
        alpha: number;
      }
      const dilatedDots: DilatedDot[] = [];

      for (let r = 0; r <= rows; r++) {
        const y = offsetY + r * space;
        const dy = mouse.y - y;
        const absDy = Math.abs(dy);

        for (let c = 0; c <= cols; c++) {
          const x = offsetX + c * space;
          const dx = mouse.x - x;
          const absDx = Math.abs(dx);

          // Quick bounding box rejection before distance calculation
          if (absDx < hoverRadius && absDy < hoverRadius) {
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < hoverRadius) {
              const intensity = 1 - dist / hoverRadius;
              // Smooth quadratic falloff so edge dots fade gently and peak is soft
              const factor = intensity * intensity;
              dilatedDots.push({
                x,
                y,
                radius: baseRadius + factor * 1.5, // Subtle growth: max ~2.8px
                alpha: baseAlpha + factor * 0.16,  // Gentle illumination: max ~0.25 opacity
              });
              continue;
            }
          }

          // Base dot
          ctx.moveTo(x + baseRadius, y);
          ctx.arc(x, y, baseRadius, 0, Math.PI * 2);
        }
      }
      ctx.fill();

      // Pass 2: Draw the small subset of dilated dots near mouse (~20-40 dots max)
      const dilatedCount = dilatedDots.length;
      for (let i = 0; i < dilatedCount; i++) {
        const dot = dilatedDots[i];
        ctx.fillStyle = `rgba(${hoverRgb}, ${dot.alpha})`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const requestDraw = () => {
      if (frameRequested) return;
      frameRequested = true;
      rafId = window.requestAnimationFrame(draw);
    };

    init();
    draw(); // Initial paint

    const handleResize = () => {
      init();
      requestDraw();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    let lastMoveTime = 0;
    const THROTTLE_MS = 10; // ~100fps response cap

    const bindPointerListeners = () => {
      if (handleMouseMove) window.removeEventListener('mousemove', handleMouseMove);
      if (handleMouseLeave) document.removeEventListener('mouseleave', handleMouseLeave);
      if (handleMouseEnter) document.removeEventListener('mouseenter', handleMouseEnter);
      handleMouseMove = null;
      handleMouseLeave = null;
      handleMouseEnter = null;

      if (isCoarsePointer) return;

      handleMouseMove = (e: MouseEvent) => {
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
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default React.memo(BackgroundGrid);
