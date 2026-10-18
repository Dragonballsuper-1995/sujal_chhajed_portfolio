import React, { useState, useRef, useEffect, useCallback } from 'react';

interface AsciiGlitchTextProps {
  text: string;
  className?: string;
  triggerOnMount?: boolean;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p' | 'div';
}

const GLITCH_GLYPHS = ['0', '1', 'λ', '§', '%', '&', '?', '*', '#', '/', '>', '<', ':', '~', '+', '$', 'θ', '∑', '∇'];

export const AsciiGlitchText: React.FC<AsciiGlitchTextProps> = ({
  text,
  className = '',
  triggerOnMount = false,
  as: Component = 'span',
}) => {
  const [displayText, setDisplayText] = useState(text);
  const isAnimatingRef = useRef(false);
  const frameIdRef = useRef<number | null>(null);

  const startGlitch = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const original = text;
    const length = original.length;
    const totalFrames = 14;
    let currentFrame = 0;

    const step = () => {
      currentFrame++;
      const progress = currentFrame / totalFrames;

      const scrambled = original
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' ';
          // As progress advances, lock characters from start or randomly
          const threshold = index / length;
          if (progress > threshold + 0.2) {
            return char;
          }
          const randomGlyph = GLITCH_GLYPHS[Math.floor(Math.random() * GLITCH_GLYPHS.length)];
          return randomGlyph;
        })
        .join('');

      setDisplayText(scrambled);

      if (currentFrame < totalFrames) {
        frameIdRef.current = requestAnimationFrame(step);
      } else {
        setDisplayText(original);
        isAnimatingRef.current = false;
      }
    };

    frameIdRef.current = requestAnimationFrame(step);
  }, [text]);

  useEffect(() => {
    setDisplayText(text);
    if (triggerOnMount) {
      startGlitch();
    }
    return () => {
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, [text, triggerOnMount, startGlitch]);

  return (
    <Component
      className={`inline-block font-inherit transition-colors cursor-default select-none ${className}`}
      onMouseEnter={startGlitch}
      aria-label={text}
    >
      <span aria-hidden="true">{displayText}</span>
    </Component>
  );
};

export default AsciiGlitchText;
