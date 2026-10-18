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
const GLITCH_SYMBOLS = ['0', '1', 'λ', '§', '%', '*', '?', '#', 'θ', '+'];

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

  // Raster sweep progress: 0.0 (fully photo) -> 1.0 (fully ASCII)
  const rasterProgressRef = useRef(0.0);
  const rafIdRef = useRef<number | null>(null);

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

  // Main canvas rasterization engine
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

    // Synchronize physical canvas pixel size with container
    const updateCanvasSize = () => {
      if (containerRef.current && canvas) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          canvas.width = rect.width;
          canvas.height = rect.height;
        }
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Compute exact object-cover object-top source rectangle
    const updateSampling = () => {
      if (!imgElementRef.current || !containerRef.current) return;
      const img = imgElementRef.current;
      const imgW = img.naturalWidth || 1841;
      const imgH = img.naturalHeight || 3273;

      const containerW = canvas.width || 340;
      const containerH = canvas.height || 425;
      const targetAspect = containerW / containerH;
      const imgAspect = imgW / imgH;

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

    // ── Static Render for Pure FLIP mode on Hero Front Face ──
    const renderStaticFlipFace = () => {
      const { width, height } = canvas;
      if (width === 0 || height === 0) return;

      const imgData = offCtx.getImageData(0, 0, sampleWidth, sampleHeight);
      const pixels = imgData.data;

      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, width, height);

      const cellW = width / sampleWidth;
      const cellH = height / sampleHeight;
      ctx.font = `bold ${Math.floor(cellH * 1.05)}px "Space Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let y = 0; y < sampleHeight; y++) {
        for (let x = 0; x < sampleWidth; x++) {
          const idx = (y * sampleWidth + x) * 4;
          const r = pixels[idx];
          const g = pixels[idx + 1];
          const b = pixels[idx + 2];
          const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
          const charIdx = Math.floor((brightness / 255) * (ASCII_RAMP.length - 1));
          const char = ASCII_RAMP[charIdx];

          if (brightness > 22) {
            ctx.fillStyle = `rgba(240, 240, 240, ${Math.min(1, (brightness / 255) * 1.25)})`;
            ctx.fillText(char, x * cellW + cellW / 2, y * cellH + cellH / 2);
          }
        }
      }
    };

    // ── Interactive Rastering Loop (Runs ONLY during hover or transition) ──
    const renderRasterSweep = () => {
      const { width, height } = canvas;
      if (width === 0 || height === 0) return;

      const target = isHovered ? 1.0 : 0.0;
      const speed = isHovered ? 0.065 : 0.09;

      if (Math.abs(rasterProgressRef.current - target) > 0.01) {
        rasterProgressRef.current += (target - rasterProgressRef.current) * speed;
      } else {
        rasterProgressRef.current = target;
      }

      const progress = rasterProgressRef.current;

      // When unhovered and fully at 0, clear canvas and terminate animation frame!
      if (!isHovered && progress <= 0.01) {
        ctx.clearRect(0, 0, width, height);
        rasterProgressRef.current = 0.0;
        rafIdRef.current = null;
        return;
      }

      const imgData = offCtx.getImageData(0, 0, sampleWidth, sampleHeight);
      const pixels = imgData.data;

      ctx.clearRect(0, 0, width, height);

      const cellW = width / sampleWidth;
      const cellH = height / sampleHeight;

      ctx.font = `bold ${Math.floor(cellH * 1.05)}px "Space Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const rasterRow = Math.min(sampleHeight, Math.floor(progress * sampleHeight));
      const rasterYPx = rasterRow * cellH;

      // Black background plate covering rasterized rows
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, rasterYPx + cellH);

      const now = performance.now();

      // Draw compiled ASCII rows from 0 down to rasterRow
      for (let y = 0; y <= rasterRow; y++) {
        const isFrontier = y === rasterRow && progress < 0.98;

        for (let x = 0; x < sampleWidth; x++) {
          const idx = (y * sampleWidth + x) * 4;
          const r = pixels[idx];
          const g = pixels[idx + 1];
          const b = pixels[idx + 2];
          const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

          if (brightness > 20) {
            const charIdx = Math.floor((brightness / 255) * (ASCII_RAMP.length - 1));
            let char = ASCII_RAMP[charIdx];

            if (isFrontier) {
              // Frontier scanning row: active high-energy cyber characters
              const symIdx = (x + Math.floor(now * 0.04)) % GLITCH_SYMBOLS.length;
              char = GLITCH_SYMBOLS[symIdx];
              ctx.fillStyle = '#00FF7F';
            } else {
              // High-fidelity cyberpunk amber-green phosphor
              const green = Math.min(255, Math.floor(brightness * 1.15));
              const red = Math.floor(brightness * 0.92);
              const blue = Math.floor(brightness * 0.35);
              ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
            }

            ctx.fillText(char, x * cellW + cellW / 2, y * cellH + cellH / 2);
          }
        }
      }

      // Glowing raster sweep line across frontier
      if (progress > 0.02 && progress < 0.98) {
        ctx.strokeStyle = '#00FF7F';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, rasterYPx + cellH);
        ctx.lineTo(width, rasterYPx + cellH);
        ctx.stroke();
      }

      // Continue animation frame while transitioning or actively hovered
      if (isHovered || rasterProgressRef.current > 0.01) {
        rafIdRef.current = requestAnimationFrame(renderRasterSweep);
      } else {
        rafIdRef.current = null;
      }
    };

    // Mode-specific initialization
    if (mode === 'flip' && isHeroFace) {
      renderStaticFlipFace();
    } else if (mode === 'morph-flip' && isHeroFace) {
      // In morph-flip on Hero front face: static ASCII portrait baseline
      renderStaticFlipFace();
    } else if (mode === 'morph' || mode === 'morph-flip') {
      // In morph mode or morph-flip back face:
      if (isHovered) {
        if (!rafIdRef.current) {
          rafIdRef.current = requestAnimationFrame(renderRasterSweep);
        }
      } else {
        // Not hovered: clear canvas completely
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        rasterProgressRef.current = 0.0;
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
      }
    } else {
      // Standard mode: clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [imageLoaded, mode, isHovered, isHeroFace]);

  // Determine if photo element should be hidden
  const isStaticAsciiFace = (mode === 'flip' || mode === 'morph-flip') && isHeroFace;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden bg-black select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Base Photograph: 100% visible, sharp, pixel-aligned ── */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover object-top transition-none ${
          isStaticAsciiFace
            ? 'opacity-0 pointer-events-none'
            : grayscaleHero
            ? 'filter grayscale contrast-115'
            : 'filter-none contrast-105'
        }`}
      />

      {/* ── Interactive ASCII Canvas Overlay ── */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full pointer-events-none ${
          mode === 'standard' ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* ── Mode Indicator Pill ── */}
      <div className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 bg-black/80 text-white border border-white/30 font-mono text-[9px] uppercase tracking-wider backdrop-blur-sm pointer-events-none">
        {mode === 'morph'
          ? (isHovered ? 'ASCII Raster' : 'Photo (Hover: ASCII)')
          : mode === 'morph-flip'
          ? (isHeroFace ? 'ASCII Front (Flip)' : (isHovered ? 'ASCII Raster' : 'Photo (Hover: ASCII)'))
          : mode === 'flip'
          ? (isHeroFace ? 'ASCII Face' : 'Photo Face')
          : 'Standard Photo'}
      </div>
    </div>
  );
};

export default AsciiPhoto;
