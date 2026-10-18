import React, { useRef, useEffect, useState } from 'react';
import { PERSONAL_INFO } from '../constants';

export type PhotoMode = 'morph' | 'flip' | 'scanline' | 'standard';

interface AsciiPhotoProps {
  src?: string;
  alt?: string;
  mode?: PhotoMode;
  isHeroFace?: boolean;
  className?: string;
  grayscaleHero?: boolean;
}

const ASCII_RAMP = ' .:-=+*#%@';

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

  // Canvas rasterization loop for Morph and Scanline modes
  useEffect(() => {
    if (!imageLoaded || !imgElementRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId: number;
    let scanY = 0;
    let scanDirection = 1;

    // Off-screen sampling canvas to extract low-resolution luminance
    const sampleWidth = 48;
    const sampleHeight = 60;
    const offCanvas = document.createElement('canvas');
    offCanvas.width = sampleWidth;
    offCanvas.height = sampleHeight;
    const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });

    if (!offCtx) return;

    // Draw source image into sample canvas
    offCtx.drawImage(imgElementRef.current, 0, 0, sampleWidth, sampleHeight);
    const imgData = offCtx.getImageData(0, 0, sampleWidth, sampleHeight);
    const pixels = imgData.data;

    const render = () => {
      const { width, height } = canvas;
      if (width === 0 || height === 0) return;

      ctx.clearRect(0, 0, width, height);

      const cellW = width / sampleWidth;
      const cellH = height / sampleHeight;

      ctx.font = `bold ${Math.floor(cellH * 1.05)}px "Space Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (mode === 'morph') {
        // Morph mode:
        // On hover, ASCII characters fully illuminate in amber/green phosphor.
        // Base state has subtle ASCII overlay or toggles smoothly.
        const morphAlpha = isHovered ? 0.95 : 0.0;
        if (morphAlpha > 0) {
          ctx.fillStyle = '#050505';
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

              if (brightness > 20) {
                // Cyberpunk amber / green phosphor gradient
                const green = Math.min(255, Math.floor(brightness * 1.1));
                ctx.fillStyle = `rgb(${brightness}, ${green}, ${Math.floor(brightness * 0.4)})`;
                ctx.fillText(char, x * cellW + cellW / 2, y * cellH + cellH / 2);
              }
            }
          }
        }
      } else if (mode === 'scanline') {
        // Scanline mode:
        // Scan beam moves vertically across the photo
        scanY += 2.2 * scanDirection;
        if (scanY >= height) {
          scanY = height;
          scanDirection = -1;
        } else if (scanY <= 0) {
          scanY = 0;
          scanDirection = 1;
        }

        const scanRow = Math.floor((scanY / height) * sampleHeight);
        const scanBand = 8; // rows affected by scan beam

        for (let y = 0; y < sampleHeight; y++) {
          const distFromScan = Math.abs(y - scanRow);
          if (distFromScan <= scanBand) {
            const intensity = 1 - distFromScan / scanBand;
            for (let x = 0; x < sampleWidth; x++) {
              const idx = (y * sampleWidth + x) * 4;
              const r = pixels[idx];
              const g = pixels[idx + 1];
              const b = pixels[idx + 2];
              const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
              const charIdx = Math.floor((brightness / 255) * (ASCII_RAMP.length - 1));
              const char = ASCII_RAMP[charIdx];

              if (brightness > 25) {
                ctx.fillStyle = `rgba(0, 255, 120, ${intensity * 0.85})`;
                ctx.fillText(char, x * cellW + cellW / 2, y * cellH + cellH / 2);
              }
            }
          }
        }

        // Draw glowing scan beam line
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.7)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(width, scanY);
        ctx.stroke();

        animationFrameId = requestAnimationFrame(render);
      } else if (mode === 'flip' && isHeroFace) {
        // Mode B Flip: Front face is pure high-contrast ASCII terminal portrait
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
              // High contrast paper-white terminal characters
              ctx.fillStyle = `rgba(240, 240, 240, ${Math.min(1, (brightness / 255) * 1.3)})`;
              ctx.fillText(char, x * cellW + cellW / 2, y * cellH + cellH / 2);
            }
          }
        }
      }
    };

    // Resize canvas to match container's physical pixel bounding box
    const updateCanvasSize = () => {
      if (containerRef.current && canvas) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          canvas.width = rect.width;
          canvas.height = rect.height;
          render();
        }
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    if (mode === 'scanline') {
      animationFrameId = requestAnimationFrame(render);
    } else {
      render();
    }

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [imageLoaded, mode, isHovered, isHeroFace]);

  // Determine if photo element should be visible
  const isAsciiOnlyFace = mode === 'flip' && isHeroFace;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden bg-black select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Base Photograph ── */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover object-top transition-all duration-300 ${
          isAsciiOnlyFace
            ? 'opacity-0 pointer-events-none'
            : mode === 'morph' && isHovered
            ? 'opacity-0 scale-105'
            : grayscaleHero
            ? 'filter grayscale contrast-115'
            : 'filter-none contrast-105'
        }`}
      />

      {/* ── Interactive ASCII Canvas Overlay ── */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-200 ${
          mode === 'standard' ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* ── Subtle Scanline CRT Screen Overlay for Scanline mode ── */}
      {mode === 'scanline' && (
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 3px, rgba(0,0,0,0.4) 4px)',
          }}
        />
      )}

      {/* ── Mode Indicator Pill ── */}
      <div className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 bg-black/80 text-white border border-white/30 font-mono text-[9px] uppercase tracking-wider backdrop-blur-sm">
        {mode === 'morph'
          ? (isHovered ? 'ASCII Raster' : 'Photo (Hover: ASCII)')
          : mode === 'flip'
          ? (isHeroFace ? 'ASCII Face' : 'Photo Face')
          : mode === 'scanline'
          ? 'CRT Scanner'
          : 'Standard Photo'}
      </div>
    </div>
  );
};

export default AsciiPhoto;
