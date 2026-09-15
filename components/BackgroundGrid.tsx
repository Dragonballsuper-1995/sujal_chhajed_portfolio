import React, { useEffect, useRef } from 'react';

interface BackgroundGridProps {
  theme?: 'light' | 'dark';
}

interface BoundingBox {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

const SOLID_BOX_SELECTOR =
  '[data-boundary], .boundary-plate, button, input, textarea, select, footer, [role="article"], .project-card, [role="dialog"]';

const TEXT_SELECTOR =
  'h1, h2, h3, h4, h5, h6, p, blockquote, li, label, pre, code';

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

    let rafId: number | null = null;
    let frameRequested = false;

    let handleMouseMove: ((e: MouseEvent) => void) | null = null;
    let handleMouseLeave: (() => void) | null = null;

    let visibleRects: BoundingBox[] = [];
    let lastRectsUpdateTime = 0;
    const RECTS_REFRESH_INTERVAL_MS = 100;

    const updateVisibleRects = () => {
      const rects: BoundingBox[] = [];
      const vh = window.innerHeight;
      const vw = window.innerWidth;

      // 1. Solid physical boxes (cards, buttons, plates, header, footer)
      const solidBoxes = document.querySelectorAll(SOLID_BOX_SELECTOR);
      for (let i = 0; i < solidBoxes.length; i++) {
        const el = solidBoxes[i];
        const style = window.getComputedStyle(el);
        if (
          style.display === 'none' ||
          style.visibility === 'hidden' ||
          parseFloat(style.opacity) < 0.05
        ) {
          continue;
        }

        const r = el.getBoundingClientRect();
        if (
          r.width > 0 &&
          r.height > 0 &&
          r.bottom >= 0 &&
          r.top <= vh &&
          r.right >= 0 &&
          r.left <= vw
        ) {
          rects.push({
            left: r.left - 2,
            top: r.top - 2,
            right: r.right + 2,
            bottom: r.bottom + 2,
          });
        }
      }

      // 2. Pure typography: get line-by-line bounding rects so empty space inside text divs is NOT suppressed
      const textElements = document.querySelectorAll(TEXT_SELECTOR);
      const range = document.createRange();
      for (let i = 0; i < textElements.length; i++) {
        const el = textElements[i];
        // Skip text inside solid boxes since the box already covers them
        if (el.closest(SOLID_BOX_SELECTOR)) {
          continue;
        }

        const style = window.getComputedStyle(el);
        if (
          style.display === 'none' ||
          style.visibility === 'hidden' ||
          parseFloat(style.opacity) < 0.05
        ) {
          continue;
        }

        try {
          range.selectNodeContents(el);
          const clientRects = range.getClientRects();
          for (let j = 0; j < clientRects.length; j++) {
            const r = clientRects[j];
            if (
              r.width > 0 &&
              r.height > 0 &&
              r.bottom >= 0 &&
              r.top <= vh &&
              r.right >= 0 &&
              r.left <= vw
            ) {
              rects.push({
                left: r.left - 2,
                top: r.top - 2,
                right: r.right + 2,
                bottom: r.bottom + 2,
              });
            }
          }
        } catch (_) {
          // Ignore any range selection issues
        }
      }

      visibleRects = rects;
      lastRectsUpdateTime = performance.now();
    };

    const init = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      updateVisibleRects();
    };

    const draw = () => {
      frameRequested = false;
      ctx.clearRect(0, 0, width, height);

      const space = 36; // Crisp neo-brutalist dot spacing
      const offsetX = (width % space) / 2;
      const offsetY = (height % space) / 2;

      const cols = Math.floor(width / space);
      const rows = Math.floor(height / space);

      const baseRadius = 1.5;
      const hoverRadius = 180;

      // Pre-filter rects in proximity to mouse to keep dot-in-box lookups near-zero cost
      const cursorMinX = mouse.x - hoverRadius;
      const cursorMaxX = mouse.x + hoverRadius;
      const cursorMinY = mouse.y - hoverRadius;
      const cursorMaxY = mouse.y + hoverRadius;

      const activeRects = visibleRects.filter(
        (r) =>
          r.right >= cursorMinX &&
          r.left <= cursorMaxX &&
          r.bottom >= cursorMinY &&
          r.top <= cursorMaxY
      );
      const activeCount = activeRects.length;

      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const x = offsetX + c * space;
          const y = offsetY + r * space;

          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let radius = baseRadius;
          let alpha = 0.12;

          if (dist < hoverRadius) {
            // Check if this specific dot is positioned over any text or box element
            let isOverTextOrBox = false;
            for (let i = 0; i < activeCount; i++) {
              const box = activeRects[i];
              if (x >= box.left && x <= box.right && y >= box.top && y <= box.bottom) {
                isOverTextOrBox = true;
                break;
              }
            }

            // Only dots NOT over text or boxes get big; dots over text/boxes stay small
            if (!isOverTextOrBox) {
              const intensity = 1 - dist / hoverRadius;
              radius = baseRadius + intensity * 3.7;
              alpha = 0.12 + intensity * 0.45;
            }
          }

          ctx.fillStyle = `rgba(5, 5, 5, ${alpha})`;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const requestDraw = () => {
      if (isCoarsePointer) {
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

    const handleScroll = () => {
      updateVisibleRects();
      if (mouse.x !== -1000 || mouse.y !== -1000) {
        requestDraw();
      }
    };

    requestDraw();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    let lastMoveTime = 0;
    const THROTTLE_MS = 16;

    const bindPointerListeners = () => {
      if (handleMouseMove) window.removeEventListener('mousemove', handleMouseMove);
      if (handleMouseLeave) document.removeEventListener('mouseleave', handleMouseLeave);
      handleMouseMove = null;
      handleMouseLeave = null;

      if (isCoarsePointer) return;

      handleMouseMove = (e: MouseEvent) => {
        const now = performance.now();
        if (now - lastMoveTime < THROTTLE_MS) return;
        lastMoveTime = now;

        // Refresh rects periodically during movement if elements shift
        if (now - lastRectsUpdateTime > RECTS_REFRESH_INTERVAL_MS) {
          updateVisibleRects();
        }

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
      window.removeEventListener('scroll', handleScroll);
      if (handleMouseMove) window.removeEventListener('mousemove', handleMouseMove);
      if (handleMouseLeave) document.removeEventListener('mouseleave', handleMouseLeave);
      coarseMql.removeEventListener('change', handlePointerModeChange);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);

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
