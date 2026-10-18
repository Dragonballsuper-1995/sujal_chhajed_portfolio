import React, { useRef, useEffect, useState } from 'react';
import { PERSONAL_INFO } from '../constants';

export type PhotoMode = 'morph' | 'morph-flip' | 'flip' | 'standard';

interface AsciiPhotoProps {
  src?: string;
  alt?: string;
  mode?: PhotoMode;
  isHeroFace?: boolean;
  className?: string;
  grayscaleHero?: boolean;
}

const ASCII_RAMP = ' .:-=+*#%@';
const GLITCH_SYMBOLS = ['0', '1', 'λ', '§', '%', '&', '?', '*', '#', '0x', 'FF', '7F', 'θ', '∑', '+'];

export const AsciiPhoto: React.FC<AsciiPhotoProps> = ({
  src = PERSONAL_INFO.profilePic,
  alt = PERSONAL_INFO.profilePicAlt,
  mode = 'morph',
  isHeroFace = false,
  className = '',
  grayscaleHero = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgElementRef = useRef<HTMLImageElement | null>(null);

  // Transition state for funky real-time ASCII compilation (0.0 to 1.0)
  const compileProgressRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  // Pre-load and cache the image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      imgElementRef.current = img;
      setImageLoaded(true);
    };
  }, [src]);

  // Main canvas rasterization & compilation engine
  useEffect(() => {
    if (!imageLoaded || !imgElementRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const sampleWidth = 48;
    const sampleHeight = 60;
    const offCanvas = document.createElement('canvas');
    offCanvas.width = sampleWidth;
    offCanvas.height = sampleHeight;
    const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
    if (!offCtx) return;

    let localRafId: number;

    const updateSampling = () => {
      if (!imgElementRef.current || !containerRef.current) return;
      const img = imgElementRef.current;
      const imgW = img.naturalWidth || 1841;
      const imgH = img.naturalHeight || 3273;

      const rect = containerRef.current.getBoundingClientRect();
      const containerW = rect.width > 0 ? rect.width : 340;
      const containerH = rect.height > 0 ? rect.height : 425;
      const targetAspect = containerW / containerH;
      const imgAspect = imgW / imgH;

      // ── Precise object-cover object-top source cropping ──
      // Matches the exact cropping of `className="object-cover object-top"`
      let sx = 0;
      let sy = 0;
      let sWidth = imgW;
      let sHeight = imgH;

      if (imgAspect > targetAspect) {
        // Image is wider than container: crop sides, anchor center horizontally, top vertically
        sWidth = imgH * targetAspect;
        sx = (imgW - sWidth) / 2;
        sy = 0;
      } else {
        // Image is taller than container: crop bottom, anchor to TOP (sy = 0)
        sHeight = imgW / targetAspect;
        sx = 0;
        sy = 0;
      }

      offCtx.clearRect(0, 0, sampleWidth, sampleHeight);
      offCtx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, sampleWidth, sampleHeight);
    };

    updateSampling();

    const render = () => {
      if (!canvas || !imgElementRef.current) return;
      const { width, height } = canvas;
      if (width === 0 || height === 0) return;

      const imgData = offCtx.getImageData(0, 0, sampleWidth, sampleHeight);
      const pixels = imgData.data;

      // Update funky compilation progress
      const targetProgress = isHovered ? 1.0 : 0.0;
      const stepSpeed = isHovered ? 0.075 : 0.12; // quick snappy assembly (~350ms)
      if (Math.abs(compileProgressRef.current - targetProgress) > 0.01) {
        compileProgressRef.current += (targetProgress - compileProgressRef.current) * stepSpeed;
      } else {
        compileProgressRef.current = targetProgress;
      }
      const progress = compileProgressRef.current;

      ctx.clearRect(0, 0, width, height);

      const cellW = width / sampleWidth;
      const cellH = height / sampleHeight;

      ctx.font = `bold ${Math.floor(cellH * 1.02)}px "Space Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const now = performance.now();

      if (mode === 'morph' || mode === 'morph-flip') {
        if (progress > 0.02) {
          // Dark cyberpunk plate background
          ctx.fillStyle = `rgba(5, 5, 5, ${Math.min(1, progress * 1.15)})`;
          ctx.fillRect(0, 0, width, height);

          for (let y = 0; y < sampleHeight; y++) {
            for (let x = 0; x < sampleWidth; x++) {
              const idx = (y * sampleWidth + x) * 4;
              const r = pixels[idx];
              const g = pixels[idx + 1];
              const b = pixels[idx + 2];
              const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

              if (brightness > 22) {
                // Determine character
                const charIdx = Math.floor((brightness / 255) * (ASCII_RAMP.length - 1));
                const targetChar = ASCII_RAMP[charIdx];

                // Funky real-time compilation: during transition, randomize symbols
                let activeChar = targetChar;
                let activeColor = '';

                // Transition phase: random symbol scramble
                const cellRandom = ((x * 17 + y * 31 + Math.floor(now * 0.02)) % 100) / 100;
                if (progress < 0.85 && cellRandom > progress) {
                  // Scramble stage: rapid flickering high-energy symbols
                  const symbolIdx = (x * 7 + y * 13 + Math.floor(now * 0.01)) % GLITCH_SYMBOLS.length;
                  activeChar = GLITCH_SYMBOLS[symbolIdx];
                  // Energetic cyber cyan / yellow highlight during compilation
                  activeColor = (x + y) % 2 === 0 ? 'rgba(255, 222, 89, 0.9)' : 'rgba(0, 255, 127, 0.9)';
                } else {
                  // Fully settled or settling: subtle ambient live fluctuation
                  const isLivingGlyph = progress >= 0.98 && ((x * 3 + y * 7 + Math.floor(now * 0.003)) % 43 === 0);
                  if (isLivingGlyph) {
                    const symbolIdx = (x + y) % GLITCH_SYMBOLS.length;
                    activeChar = GLITCH_SYMBOLS[symbolIdx];
                    activeColor = 'rgba(255, 222, 89, 1)';
                  } else {
                    activeChar = targetChar;
                    const green = Math.min(255, Math.floor(brightness * 1.15));
                    activeColor = `rgb(${brightness}, ${green}, ${Math.floor(brightness * 0.35)})`;
                  }
                }

                ctx.fillStyle = activeColor;
                ctx.fillText(activeChar, x * cellW + cellW / 2, y * cellH + cellH / 2);
              }
            }
          }
        }
      } else if (mode === 'flip' && isHeroFace) {
        // Pure high-contrast ASCII terminal portrait for Hero front face
        ctx.fillStyle = '#080808';
        ctx.fillRect(0, 0, width, height);

        for (let y = 0; y < sampleHeight; y++) {
          for (let x = 0; x < sampleWidth; x++) {
            const idx = (y * sampleWidth + x) * 4;
            const r = pixels[idx];
            const g = pixels[idx + 1];
            const b = pixels[idx + 2];
            const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
            const charIdx = Math.floor((brightness / 255) * (ASCII_RAMP.length - 1));
            const char = ASCII_RAMP[charIdx];

            if (brightness > 25) {
              ctx.fillStyle = `rgba(240, 240, 240, ${Math.min(1, (brightness / 255) * 1.3)})`;
              ctx.fillText(char, x * cellW + cellW / 2, y * cellH + cellH / 2);
            }
          }
        }
      }

      // Keep animation loop active while hovering or actively compiling
      if (isHovered || compileProgressRef.current > 0.01) {
        localRafId = requestAnimationFrame(render);
      }
    };

    const updateCanvasSize = () => {
      if (containerRef.current && canvas) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          canvas.width = rect.width;
          canvas.height = rect.height;
          updateSampling();
          render();
        }
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Initial render
    render();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (localRafId) cancelAnimationFrame(localRafId);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [imageLoaded, mode, isHovered, isHeroFace]);

  const isAsciiOnlyFace = mode === 'flip' && isHeroFace;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden bg-black select-none ${className}`}
      style={{
        perspective: mode === 'morph-flip' ? '1200px' : undefined,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Inner 3D Container for Morph-Flip ── */}
      <div
        className="w-full h-full relative"
        style={{
          transformStyle: mode === 'morph-flip' ? 'preserve-3d' : undefined,
          transition: mode === 'morph-flip' ? 'transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)' : undefined,
          transform: mode === 'morph-flip' && isHovered ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* ── Front Face: Clean Photograph ── */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backfaceVisibility: mode === 'morph-flip' ? 'hidden' : undefined,
            WebkitBackfaceVisibility: mode === 'morph-flip' ? 'hidden' : undefined,
          }}
        >
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-cover object-top transition-opacity duration-200 ${
              isAsciiOnlyFace
                ? 'opacity-0 pointer-events-none'
                : mode === 'morph' && isHovered
                ? 'opacity-0'
                : grayscaleHero
                ? 'filter grayscale contrast-115'
                : 'filter-none contrast-105'
            }`}
          />
        </div>

        {/* ── ASCII Canvas (Overlay for Morph, Back Face for Morph-Flip) ── */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            transform: mode === 'morph-flip' ? 'rotateY(180deg)' : undefined,
            backfaceVisibility: mode === 'morph-flip' ? 'hidden' : undefined,
            WebkitBackfaceVisibility: mode === 'morph-flip' ? 'hidden' : undefined,
          }}
        >
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className={`absolute inset-0 w-full h-full pointer-events-none ${
              mode === 'standard' ? 'opacity-0' : 'opacity-100'
            }`}
          />
        </div>
      </div>

      {/* ── Mode Indicator Pill ── */}
      <div className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 bg-black/80 text-white border border-white/30 font-mono text-[9px] uppercase tracking-wider backdrop-blur-sm pointer-events-none">
        {mode === 'morph'
          ? (isHovered ? 'ASCII Compiled' : 'Hover: ASCII Compile')
          : mode === 'morph-flip'
          ? (isHovered ? 'ASCII Flip' : 'Hover: 3D Morph Flip')
          : mode === 'flip'
          ? (isHeroFace ? 'ASCII Face' : 'Photo Face')
          : 'Standard Photo'}
      </div>
    </div>
  );
};

export default AsciiPhoto;
