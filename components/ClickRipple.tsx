import React, { useEffect, useState, useRef, useCallback } from 'react';

export type RippleTriggerMode = 'global' | 'dead-space' | 'off';
export type RippleVisualStyle = 'neo-rings' | 'ascii-shockwave' | 'matrix-wave' | 'minimal-glow';

interface ClickRippleProps {
  triggerMode: RippleTriggerMode;
  visualStyle: RippleVisualStyle;
}

const BRAND_COLORS = [
  '#FFDE59', // Neo-Yellow
  '#FF66C4', // Neo-Pink
  '#7ED957', // Neo-Green
  '#5CE1E6', // Neo-Cyan
  '#8C52FF', // Neo-Purple
  '#FF914D', // Neo-Orange
];

const SHOCKWAVE_GLYPHS = ['λ', '★', '0', '1', '┼', '§', 'θ', '#', '▲', '◈', 'x', 'W'];

interface RippleInstance {
  id: number;
  x: number;
  y: number;
  style: RippleVisualStyle;
  color: string;
  secondaryColor: string;
}

export const ClickRipple: React.FC<ClickRippleProps> = ({ triggerMode, visualStyle }) => {
  const [ripples, setRipples] = useState<RippleInstance[]>([]);
  const nextIdRef = useRef(0);
  const colorIndexRef = useRef(0);

  const isDeadSpace = (target: HTMLElement | null): boolean => {
    if (!target) return true;
    const interactive = target.closest(
      'a, button, input, textarea, select, [role="button"], [role="link"], [data-interactive="true"], .interactive-card, pre, code'
    );
    return !interactive;
  };

  const spawnRipple = useCallback(
    (clientX: number, clientY: number) => {
      const id = ++nextIdRef.current;
      const primaryColor = BRAND_COLORS[colorIndexRef.current % BRAND_COLORS.length];
      const secondaryColor = BRAND_COLORS[(colorIndexRef.current + 2) % BRAND_COLORS.length];
      colorIndexRef.current++;

      if (visualStyle === 'matrix-wave') {
        // Dispatch event for canvas BackgroundGrid to propagate an energy wave through the matrix
        window.dispatchEvent(
          new CustomEvent('canvas-matrix-ripple', {
            detail: { x: clientX, y: clientY, color: primaryColor },
          })
        );
      }

      setRipples((prev) => [
        ...prev.slice(-12), // Keep max 12 active ripples simultaneously for silky 60fps
        {
          id,
          x: clientX,
          y: clientY,
          style: visualStyle,
          color: primaryColor,
          secondaryColor,
        },
      ]);

      // Remove after animation completes
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 750);
    },
    [visualStyle]
  );

  useEffect(() => {
    if (triggerMode === 'off') {
      setRipples([]);
      return;
    }

    const handlePointerDown = (e: MouseEvent) => {
      if (triggerMode === 'dead-space' && !isDeadSpace(e.target as HTMLElement)) {
        return;
      }
      spawnRipple(e.clientX, e.clientY);
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [triggerMode, spawnRipple]);

  if (triggerMode === 'off' || ripples.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden select-none"
    >
      {ripples.map((ripple) => (
        <React.Fragment key={ripple.id}>
          {/* ── STYLE 1: Neo-Brutalist Shockwave Rings ──────────────────── */}
          {ripple.style === 'neo-rings' && (
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: ripple.x, top: ripple.y }}
            >
              {/* Outer High-Energy Expanding Ring with Hard Shadow */}
              <div
                className="rounded-full border-2 animate-neo-ring-outer"
                style={{
                  borderColor: ripple.color,
                  boxShadow: `0 0 0 1px #000, 3px 3px 0 0 rgba(0,0,0,0.85)`,
                }}
              />
              {/* Inner Fast Expanding Contrasting Ring */}
              <div
                className="absolute inset-0 m-auto rounded-full border-2 animate-neo-ring-inner"
                style={{
                  borderColor: ripple.secondaryColor,
                }}
              />
              {/* Center Dot Impact Flash */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-black animate-ping"
                style={{ backgroundColor: ripple.color }}
              />
            </div>
          )}

          {/* ── STYLE 2: ASCII Matrix Shockwave Burst ───────────────────── */}
          {ripple.style === 'ascii-shockwave' && (
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: ripple.x, top: ripple.y }}
            >
              {/* Radial cluster of 10 floating ASCII glyphs */}
              {Array.from({ length: 10 }).map((_, i) => {
                const angle = (i * 36) * (Math.PI / 180);
                const distance = 55 + (i % 3) * 20; // 55px to 95px spread
                const targetX = Math.cos(angle) * distance;
                const targetY = Math.sin(angle) * distance;
                const glyph = SHOCKWAVE_GLYPHS[(i + ripple.id) % SHOCKWAVE_GLYPHS.length];
                const glyphColor = BRAND_COLORS[(i + ripple.id) % BRAND_COLORS.length];

                return (
                  <span
                    key={i}
                    className="absolute font-mono text-xs font-black select-none animate-ascii-particle"
                    style={
                      {
                        '--target-x': `${targetX}px`,
                        '--target-y': `${targetY}px`,
                        color: glyphColor,
                        textShadow: '1px 1px 0px #000, -1px -1px 0px #000',
                      } as React.CSSProperties
                    }
                  >
                    {glyph}
                  </span>
                );
              })}
              {/* Center Micro Crosshair */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-xs font-black animate-fadeOut"
                style={{ color: ripple.color }}
              >
                ┼
              </div>
            </div>
          )}

          {/* ── STYLE 3: Matrix Canvas Wave (Micro Pulse Marker) ─────────── */}
          {ripple.style === 'matrix-wave' && (
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: ripple.x, top: ripple.y }}
            >
              {/* Subtle click coordinate marker while BackgroundGrid canvas propagates the wave */}
              <div
                className="w-4 h-4 rounded-full border border-black/40 animate-ping opacity-80"
                style={{ backgroundColor: ripple.color }}
              />
            </div>
          )}

          {/* ── STYLE 4: Minimal Radial Glow ────────────────────────────── */}
          {ripple.style === 'minimal-glow' && (
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full pointer-events-none animate-minimal-glow"
              style={{
                left: ripple.x,
                top: ripple.y,
                background: `radial-gradient(circle, ${ripple.color} 0%, ${ripple.secondaryColor}40 40%, transparent 75%)`,
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ClickRipple;
