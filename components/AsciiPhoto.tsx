import React, { useRef, useEffect, useState } from 'react';
import { PERSONAL_INFO } from '../constants';

export type PhotoMode = 'morph' | 'morph-reveal' | 'morph-flip' | 'flip' | 'standard';

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

interface BlobNode {
  baseX: number;
  baseY: number;
  curX: number;
  curY: number;
  speedX: number;
  speedY: number;
  phaseX: number;
  phaseY: number;
  radius: number;
  weight: number;
}

const createBlobSeeds = (): BlobNode[] => [
  // Blob 0: Mouse tracker / focal core
  { baseX: 0.5, baseY: 0.5, curX: 0.5, curY: 0.5, speedX: 0, speedY: 0, phaseX: 0, phaseY: 0, radius: 0.34, weight: 1.15 },
  // Blob 1: Upper-right quadrant (reference screenshot 2)
  { baseX: 0.70, baseY: 0.28, curX: 0.70, curY: 0.28, speedX: 0.75, speedY: 0.95, phaseX: 0.4, phaseY: 1.2, radius: 0.32, weight: 1.0 },
  // Blob 2: Middle-left quadrant (reference screenshot 3)
  { baseX: 0.28, baseY: 0.48, curX: 0.28, curY: 0.48, speedX: 0.85, speedY: 0.65, phaseX: 2.1, phaseY: 0.8, radius: 0.30, weight: 0.95 },
  // Blob 3: Lower-center / bottom-left (reference screenshot 4)
  { baseX: 0.52, baseY: 0.74, curX: 0.52, curY: 0.74, speedX: 0.65, speedY: 0.80, phaseX: 1.5, phaseY: 2.7, radius: 0.35, weight: 1.05 },
  // Blob 4: Upper-center / top (reference screenshot 1)
  { baseX: 0.46, baseY: 0.18, curX: 0.46, curY: 0.18, speedX: 0.90, speedY: 0.70, phaseX: 3.2, phaseY: 1.9, radius: 0.28, weight: 0.90 },
];

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

  // Mouse cursor tracking inside the photo
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });

  // Organic blob nodes
  const blobsRef = useRef<BlobNode[]>(createBlobSeeds());

  // Blob transition progress: 0.0 (fully photo) -> 1.0 (fully active blobs)
  const transitionProgressRef = useRef(0.0);
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

  // Main canvas organic ASCII blob engine
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
        sWidth = imgH * targetAspect;
        sx = (imgW - sWidth) / 2;
        sy = 0;
      } else {
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

    // ── Interactive Organic ASCII Blob Simulation ──
    const renderBlobAscii = () => {
      const { width, height } = canvas;
      if (width === 0 || height === 0) return;

      const target = isHovered ? 1.0 : 0.0;
      const speed = isHovered ? 0.08 : 0.12;

      if (Math.abs(transitionProgressRef.current - target) > 0.01) {
        transitionProgressRef.current += (target - transitionProgressRef.current) * speed;
      } else {
        transitionProgressRef.current = target;
      }

      const progress = transitionProgressRef.current;

      // When unhovered and fully at 0, clear canvas and terminate animation frame!
      if (!isHovered && progress <= 0.01) {
        ctx.clearRect(0, 0, width, height);
        transitionProgressRef.current = 0.0;
        rafIdRef.current = null;
        return;
      }

      const imgData = offCtx.getImageData(0, 0, sampleWidth, sampleHeight);
      const pixels = imgData.data;

      ctx.clearRect(0, 0, width, height);

      const cellW = width / sampleWidth;
      const cellH = height / sampleHeight;
      const aspect = sampleWidth / sampleHeight; // ~0.8

      ctx.font = `bold ${Math.floor(cellH * 1.05)}px "Space Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const now = performance.now();
      const t = now * 0.0016;

      const blobs = blobsRef.current;

      // Smoothly steer Blob 0 toward mouse cursor position
      blobs[0].curX += (mousePosRef.current.x - blobs[0].curX) * 0.10;
      blobs[0].curY += (mousePosRef.current.y - blobs[0].curY) * 0.10;

      // Autonomous organic wandering for blobs 1-4 (matching reference screenshots)
      for (let k = 1; k < blobs.length; k++) {
        const b = blobs[k];
        b.curX = b.baseX + 0.13 * Math.sin(t * b.speedX + b.phaseX);
        b.curY = b.baseY + 0.11 * Math.cos(t * b.speedY + b.phaseY);
      }

      // Base radius calculation depending on mode
      const isRevealMode = mode === 'morph-reveal';
      const threshold = isRevealMode ? 0.55 : 0.62;

      // Evaluate each cell in the 48x60 grid
      for (let y = 0; y < sampleHeight; y++) {
        const v = (y + 0.5) / sampleHeight;

        for (let x = 0; x < sampleWidth; x++) {
          const u = (x + 0.5) / sampleWidth;

          // Compute Gaussian metaball potential across all organic blobs
          let potential = 0;
          for (let k = 0; k < blobs.length; k++) {
            const b = blobs[k];
            const dx = u - b.curX;
            const dy = (v - b.curY) / aspect;
            const distSq = dx * dx + dy * dy;

            // In reveal mode, radius expands until full card is covered; in wandering blobs mode, maintains organic sizes
            const effRadius = isRevealMode
              ? b.radius * (0.2 + 2.0 * progress)
              : b.radius * progress * (1.0 + 0.15 * Math.sin(t * 1.5 + k));

            if (effRadius > 0.01) {
              potential += b.weight * Math.exp(-distSq / (2 * effRadius * effRadius));
            }
          }

          // Subtle spatial high-frequency noise for organic digital edge
          const noise = 0.06 * Math.sin(x * 0.65 + t * 2.5) * Math.cos(y * 0.65 + t * 2.5);
          const totalVal = potential + noise;

          if (totalVal >= threshold) {
            // Inside the organic ASCII blob: blot out underlying photo with dark background
            ctx.fillStyle = '#060606';
            ctx.fillRect(x * cellW, y * cellH, cellW + 0.5, cellH + 0.5);

            const isFrontier = totalVal < threshold + 0.14 && progress < 0.98;

            const idx = (y * sampleWidth + x) * 4;
            const r = pixels[idx];
            const g = pixels[idx + 1];
            const b = pixels[idx + 2];
            const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

            if (isFrontier) {
              // Active organic frontier: neon green cyber characters
              const symIdx = (x * 7 + y * 13 + Math.floor(now * 0.05)) % GLITCH_SYMBOLS.length;
              ctx.fillStyle = '#00FF7F';
              ctx.fillText(GLITCH_SYMBOLS[symIdx], x * cellW + cellW / 2, y * cellH + cellH / 2);
            } else if (brightness > 18) {
              // Deep inside blob: recognizable portrait ASCII with phosphor amber/green
              const charIdx = Math.floor((brightness / 255) * (ASCII_RAMP.length - 1));
              const char = ASCII_RAMP[charIdx];

              const green = Math.min(255, Math.floor(brightness * 1.15));
              const red = Math.floor(brightness * 0.92);
              const blue = Math.floor(brightness * 0.35);
              ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;

              ctx.fillText(char, x * cellW + cellW / 2, y * cellH + cellH / 2);
            }
          }
          // If totalVal < threshold, cell is transparent (underlying photograph shows through!)
        }
      }

      // Continue animation frame while transitioning or actively hovered
      if (isHovered || transitionProgressRef.current > 0.01) {
        rafIdRef.current = requestAnimationFrame(renderBlobAscii);
      } else {
        rafIdRef.current = null;
      }
    };

    // Mode-specific initialization
    if (mode === 'flip' && isHeroFace) {
      renderStaticFlipFace();
    } else if (mode === 'morph-flip' && isHeroFace) {
      renderStaticFlipFace();
    } else if (mode === 'morph' || mode === 'morph-reveal' || mode === 'morph-flip') {
      if (isHovered) {
        if (!rafIdRef.current) {
          rafIdRef.current = requestAnimationFrame(renderBlobAscii);
        }
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        transitionProgressRef.current = 0.0;
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
      }
    } else {
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

  // Determine if base photo element should be hidden
  const isStaticAsciiFace = (mode === 'flip' || mode === 'morph-flip') && isHeroFace;

  const handleMouseEnter = () => {
    // Add slight random phase variation to autonomous blobs on each hover entrance
    const blobs = blobsRef.current;
    for (let k = 1; k < blobs.length; k++) {
      blobs[k].phaseX = Math.random() * Math.PI * 2;
      blobs[k].phaseY = Math.random() * Math.PI * 2;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      mousePosRef.current = { x, y };
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden bg-black select-none ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
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
          ? (isHovered ? 'ASCII Blobs' : 'Photo (Hover: ASCII Blobs)')
          : mode === 'morph-reveal'
          ? (isHovered ? 'ASCII Reveal' : 'Photo (Hover: Blob Reveal)')
          : mode === 'morph-flip'
          ? (isHeroFace ? 'ASCII Front (Flip)' : (isHovered ? 'ASCII Blobs' : 'Photo (Hover: ASCII Blobs)'))
          : mode === 'flip'
          ? (isHeroFace ? 'ASCII Face' : 'Photo Face')
          : 'Standard Photo'}
      </div>
    </div>
  );
};

export default AsciiPhoto;
