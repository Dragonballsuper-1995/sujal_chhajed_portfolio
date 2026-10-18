import React, { useEffect, useState, useRef, useCallback } from 'react';

const BRAND_COLORS = [
  '#FFDE59', // Neo-Yellow
  '#FF66C4', // Neo-Pink
  '#7ED957', // Neo-Green
  '#5CE1E6', // Neo-Cyan
  '#8C52FF', // Neo-Purple
  '#FF914D', // Neo-Orange
];

interface PingInstance {
  id: number;
  x: number;
  y: number;
  color: string;
}

/**
 * ClickRipple (Finalized: Dead Space + Canvas Matrix Wave)
 *
 * Detects clicks on non-interactive dead space across the viewport, dispatches a
 * custom energy wave event to BackgroundGrid canvas to light up matrix characters,
 * and renders a subtle micro-ping coordinate impact marker.
 */
export const ClickRipple: React.FC = () => {
  const [pings, setPings] = useState<PingInstance[]>([]);
  const nextIdRef = useRef(0);
  const colorIndexRef = useRef(0);

  const isDeadSpace = (target: HTMLElement | null): boolean => {
    if (!target) return true;
    const interactive = target.closest(
      'a, button, input, textarea, select, [role="button"], [role="link"], [data-interactive="true"], .interactive-card, pre, code'
    );
    return !interactive;
  };

  const spawnPing = useCallback((clientX: number, clientY: number) => {
    const id = ++nextIdRef.current;
    const color = BRAND_COLORS[colorIndexRef.current % BRAND_COLORS.length];
    colorIndexRef.current++;

    // Propagate energy wave through the BackgroundGrid ASCII canvas matrix
    window.dispatchEvent(
      new CustomEvent('canvas-matrix-ripple', {
        detail: { x: clientX, y: clientY, color },
      })
    );

    setPings((prev) => [
      ...prev.slice(-8), // Keep max 8 active impact pings
      { id, x: clientX, y: clientY, color },
    ]);

    setTimeout(() => {
      setPings((prev) => prev.filter((p) => p.id !== id));
    }, 600);
  }, []);

  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      if (!isDeadSpace(e.target as HTMLElement)) return;
      spawnPing(e.clientX, e.clientY);
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [spawnPing]);

  if (pings.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden select-none"
    >
      {pings.map((ping) => (
        <div
          key={ping.id}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: ping.x, top: ping.y }}
        >
          {/* Subtle micro impact flash at the click origin */}
          <div
            className="w-3.5 h-3.5 rounded-full border border-black animate-ping opacity-90"
            style={{ backgroundColor: ping.color }}
          />
        </div>
      ))}
    </div>
  );
};

export default ClickRipple;
