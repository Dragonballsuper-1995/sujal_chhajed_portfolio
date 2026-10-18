import React, { useEffect, useRef } from 'react';

export type BackgroundMode = 'dots' | 'crosshair' | 'ascii' | 'ascii-matrix';

interface BackgroundGridProps {
  mode?: BackgroundMode;
}

const ASCII_TOKENS = [
  '0x', '7F', 'λ', '01', 'AI', 'sys', '//', '[]',
  '{ }', '4K', 'ML', '00', 'FF', 'θ', '∇', 'git',
  'api', 'cpu', 'sync', 'dev', '10', 'bit', 'v7', 'lww'
];

const BackgroundGrid: React.FC<BackgroundGridProps> = ({ mode = 'dots' }) => {
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

    // ──────────────────────────────────────────────────────────────────────────
    // 1. DRAW MODE: DOTS
    // ──────────────────────────────────────────────────────────────────────────
    const drawDots = (isDark: boolean, cols: number, rows: number, offsetX: number, offsetY: number, space: number) => {
      const baseAlpha = isDark ? 0.09 : 0.11;
      const baseColor = isDark ? `rgba(255, 255, 255, ${baseAlpha})` : `rgba(5, 5, 5, ${baseAlpha})`;
      const hoverRgb = isDark ? '255, 255, 255' : '5, 5, 5';
      const baseRadius = 1.5;
      const hoverRadius = 160;

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

      ctx.fillStyle = baseColor;
      ctx.beginPath();

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

          if (absDx < hoverRadius && absDy < hoverRadius) {
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < hoverRadius) {
              const intensity = 1 - dist / hoverRadius;
              dilatedDots.push({
                x,
                y,
                radius: baseRadius + intensity * 3.3,
                alpha: baseAlpha + intensity * 0.14,
              });
              continue;
            }
          }

          ctx.moveTo(x + baseRadius, y);
          ctx.arc(x, y, baseRadius, 0, Math.PI * 2);
        }
      }
      ctx.fill();

      const dilatedCount = dilatedDots.length;
      for (let i = 0; i < dilatedCount; i++) {
        const dot = dilatedDots[i];
        ctx.fillStyle = `rgba(${hoverRgb}, ${dot.alpha})`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // ──────────────────────────────────────────────────────────────────────────
    // 2. DRAW MODE: CROSSHAIR '+' (CAD Coordinate Matrix)
    // ──────────────────────────────────────────────────────────────────────────
    const drawCrosshairs = (isDark: boolean, cols: number, rows: number, offsetX: number, offsetY: number, space: number) => {
      const baseAlpha = isDark ? 0.12 : 0.14;
      const baseColor = isDark ? `rgba(255, 255, 255, ${baseAlpha})` : `rgba(5, 5, 5, ${baseAlpha})`;
      const hoverRgb = isDark ? '255, 255, 255' : '5, 5, 5';
      const baseArm = 3.5;
      const hoverRadius = 160;

      ctx.lineWidth = 1;

      if (!isMouseInWindow || mouse.x < 0 || mouse.y < 0) {
        ctx.strokeStyle = baseColor;
        ctx.beginPath();
        for (let r = 0; r <= rows; r++) {
          const y = offsetY + r * space;
          for (let c = 0; c <= cols; c++) {
            const x = offsetX + c * space;
            ctx.moveTo(x - baseArm, y);
            ctx.lineTo(x + baseArm, y);
            ctx.moveTo(x, y - baseArm);
            ctx.lineTo(x, y + baseArm);
          }
        }
        ctx.stroke();
        return;
      }

      ctx.strokeStyle = baseColor;
      ctx.beginPath();

      interface HoverCrosshair {
        x: number;
        y: number;
        arm: number;
        alpha: number;
        angle: number;
      }
      const hoverCrosshairs: HoverCrosshair[] = [];

      for (let r = 0; r <= rows; r++) {
        const y = offsetY + r * space;
        const dy = mouse.y - y;
        const absDy = Math.abs(dy);

        for (let c = 0; c <= cols; c++) {
          const x = offsetX + c * space;
          const dx = mouse.x - x;
          const absDx = Math.abs(dx);

          if (absDx < hoverRadius && absDy < hoverRadius) {
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < hoverRadius) {
              const intensity = 1 - dist / hoverRadius;
              hoverCrosshairs.push({
                x,
                y,
                arm: baseArm + intensity * 4.5,
                alpha: baseAlpha + intensity * 0.35,
                angle: intensity * (Math.PI / 4), // Gently rotates up to 45 degrees
              });
              continue;
            }
          }

          ctx.moveTo(x - baseArm, y);
          ctx.lineTo(x + baseArm, y);
          ctx.moveTo(x, y - baseArm);
          ctx.lineTo(x, y + baseArm);
        }
      }
      ctx.stroke();

      // Render illuminated and rotated crosshairs near cursor
      const hoverCount = hoverCrosshairs.length;
      for (let i = 0; i < hoverCount; i++) {
        const ch = hoverCrosshairs[i];
        ctx.save();
        ctx.translate(ch.x, ch.y);
        if (ch.angle !== 0) ctx.rotate(ch.angle);
        ctx.strokeStyle = `rgba(${hoverRgb}, ${ch.alpha})`;
        ctx.beginPath();
        ctx.moveTo(-ch.arm, 0);
        ctx.lineTo(ch.arm, 0);
        ctx.moveTo(0, -ch.arm);
        ctx.lineTo(0, ch.arm);
        ctx.stroke();
        ctx.restore();
      }
    };

    // ──────────────────────────────────────────────────────────────────────────
    // 3. DRAW MODE: ASCII / HEX DATA STREAM
    // ──────────────────────────────────────────────────────────────────────────
    const drawAscii = (isDark: boolean, cols: number, rows: number, offsetX: number, offsetY: number, space: number) => {
      const baseAlpha = isDark ? 0.08 : 0.10;
      const baseColor = isDark ? `rgba(255, 255, 255, ${baseAlpha})` : `rgba(5, 5, 5, ${baseAlpha})`;
      const hoverRgb = isDark ? '255, 255, 255' : '5, 5, 5';
      const hoverRadius = 150;

      ctx.font = '10px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const tokenCount = ASCII_TOKENS.length;

      for (let r = 0; r <= rows; r++) {
        const y = offsetY + r * space;
        const dy = mouse.y - y;
        const absDy = Math.abs(dy);

        for (let c = 0; c <= cols; c++) {
          const x = offsetX + c * space;
          const dx = mouse.x - x;
          const absDx = Math.abs(dx);

          // Deterministic token selection based on grid coordinate (stable, no flickering)
          const tokenIndex = (c * 17 + r * 31) % tokenCount;
          const token = ASCII_TOKENS[tokenIndex];

          if (isMouseInWindow && absDx < hoverRadius && absDy < hoverRadius) {
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < hoverRadius) {
              const intensity = 1 - dist / hoverRadius;
              const alpha = baseAlpha + intensity * 0.35;
              ctx.fillStyle = `rgba(${hoverRgb}, ${alpha})`;
              ctx.fillText(token, x, y);
              continue;
            }
          }

          ctx.fillStyle = baseColor;
          ctx.fillText(token, x, y);
        }
      }
    };

    // ──────────────────────────────────────────────────────────────────────────
    // 4. DRAW MODE: ASCII MATRIX / TENSOR STREAM (Variation 2)
    // ──────────────────────────────────────────────────────────────────────────
    const MATRIX_GLYPHS = [
      '0', '1', 'λ', '∂', '∑', '∇', '∫', '≈', 'W', 'b',
      'x', 'σ', 'μ', '0x', 'FF', '7F', 'AI', '::', '->', 'θ'
    ];

    const drawAsciiMatrix = (isDark: boolean, cols: number, rows: number, offsetX: number, offsetY: number, space: number) => {
      const baseAlpha = isDark ? 0.08 : 0.09;
      const baseColor = isDark ? `rgba(255, 255, 255, ${baseAlpha})` : `rgba(5, 5, 5, ${baseAlpha})`;
      const hoverRgb = isDark ? '255, 222, 89' : '0, 0, 0';
      const hoverRadius = 150;

      ctx.font = '11px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const glyphCount = MATRIX_GLYPHS.length;
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

          if (isMouseInWindow && absDx < hoverRadius && absDy < hoverRadius) {
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < hoverRadius) {
              const intensity = 1 - dist / hoverRadius;
              const alpha = baseAlpha + intensity * 0.45;
              const dynamicIndex = Math.floor(baseIndex + (now * 0.005) + (c * 3) + (r * 7)) % glyphCount;
              const activeGlyph = MATRIX_GLYPHS[dynamicIndex];

              ctx.fillStyle = `rgba(${hoverRgb}, ${alpha})`;
              ctx.fillText(activeGlyph, x, y);
              continue;
            }
          }

          ctx.fillStyle = baseColor;
          ctx.fillText(MATRIX_GLYPHS[baseIndex], x, y);
        }
      }
    };

    const draw = () => {
      frameRequested = false;
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains('dark');
      const space = mode === 'ascii' ? 44 : mode === 'ascii-matrix' ? 32 : mode === 'crosshair' ? 40 : 36;
      const offsetX = (width % space) / 2;
      const offsetY = (height % space) / 2;
      const cols = Math.floor(width / space);
      const rows = Math.floor(height / space);

      if (mode === 'crosshair') {
        drawCrosshairs(isDark, cols, rows, offsetX, offsetY, space);
      } else if (mode === 'ascii') {
        drawAscii(isDark, cols, rows, offsetX, offsetY, space);
      } else if (mode === 'ascii-matrix') {
        drawAsciiMatrix(isDark, cols, rows, offsetX, offsetY, space);
      } else {
        drawDots(isDark, cols, rows, offsetX, offsetY, space);
      }
    };

    const requestDraw = () => {
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
    const THROTTLE_MS = 10;

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
  }, [mode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default React.memo(BackgroundGrid);
