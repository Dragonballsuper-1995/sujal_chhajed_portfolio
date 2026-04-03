import React, { useEffect, useRef, useState } from 'react';

interface CustomCursorProps {
  /**
   * Forces a high-contrast cursor style (no blend mode).
   * Useful on semi-transparent backdrops where `mix-blend-difference` can vanish.
   */
  highContrast?: boolean;
}

const CustomCursor: React.FC<CustomCursorProps> = ({ highContrast = false }) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  const blendModeClass = highContrast ? 'mix-blend-normal' : 'mix-blend-difference';
  const strokeClass = highContrast ? 'bg-neo-black' : 'bg-white';
  const ringBorderClass = highContrast ? 'border-neo-black' : 'border-white';
  const ringHoverBgClass = highContrast ? 'bg-neo-black/10' : 'bg-white/10';

  // React to DevTools device toggles / pointer changes.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mql = window.matchMedia('(hover: hover) and (pointer: fine)');
    const apply = () => setIsEnabled(mql.matches);
    apply();

    const onChange = () => apply();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Toggle native cursor hiding only when the custom cursor is active.
    document.body.classList.toggle('has-custom-cursor', isEnabled);

    if (!isEnabled) {
      setIsVisible(false);
      setIsHovering(false);
      setIsClicked(false);
      return;
    }

    // Use direct DOM manipulation for position updates (no React re-renders)
    const moveCursor = (e: MouseEvent) => {
      setIsVisible(true);

      const { clientX, clientY } = e;

      // Direct style manipulation - bypasses React state updates
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
      }

      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.matches('a, button, input, textarea, [role="button"], select') ||
        target.closest('a, button, input, textarea, [role="button"], select');

      setIsHovering(!!isInteractive);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Use passive listeners for better scroll performance
    window.addEventListener('mousemove', moveCursor, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.body.classList.remove('has-custom-cursor');
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <>
      {/* Inner Crosshair Cursor */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 z-[10000] pointer-events-none ${blendModeClass}`}
      >
        {/* Visual Crosshair Element */}
        <div className={`
          w-6 h-6 -ml-3 -mt-3 relative
          transition-all duration-300 ease-out
          ${!isVisible ? 'opacity-0' : 'opacity-100'}
          ${isHovering ? 'scale-150 rotate-90' : 'scale-100'}
          ${isClicked ? 'scale-75' : ''}
        `}>
          <div className={`absolute top-1/2 left-0 w-full h-[2px] -translate-y-1/2 ${strokeClass}`} />
          <div className={`absolute top-1/2 left-0 w-full h-[2px] -translate-y-1/2 rotate-90 ${strokeClass}`} />
        </div>
      </div>

      {/* Outer Ring Follower */}
      <div
        ref={followerRef}
        aria-hidden="true"
        className={`
          fixed top-0 left-0 z-[9999] pointer-events-none
          border-2 ${ringBorderClass}
          ${blendModeClass}
          rounded-full
          flex items-center justify-center
          transition-all duration-150 ease-out
          -ml-6 -mt-6
          ${!isVisible ? 'opacity-0' : 'opacity-100'}
          ${isHovering ? `w-16 h-16 ${ringHoverBgClass} -ml-8 -mt-8` : 'w-12 h-12'}
          ${isClicked ? 'scale-75' : 'scale-100'}
        `}
      />
    </>
  );
};

export default React.memo(CustomCursor);