import React, { useRef, useEffect, useState } from 'react';
import { PERSONAL_INFO } from '../constants';

export type PhotoColorMode = 'classic' | 'chromatic' | 'photo-rgb' | 'multi-glitch';

interface AsciiPhotoProps {
  src?: string;
  alt?: string;
  isHeroFace?: boolean;
  colorMode?: PhotoColorMode;
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

/**
 * Computes ASCII character color based on the selected PhotoColorMode
 */
const getAsciiCharColor = (
  mode: PhotoColorMode,
  r: number,
  g: number,
  b: number,
  luma: number,
  isFrontier: boolean,
  x: number,
  y: number,
  now: number,
  alpha = 1.0
): string => {
  if (isFrontier) {
    if (mode === 'multi-glitch' || mode === 'chromatic') {
      const palette = ['#00FF7F', '#FFE600', '#FF0055', '#00E5FF'];
      const pIdx = (x * 3 + y * 7 + Math.floor(now * 0.04)) % palette.length;
      return palette[pIdx];
    }
    return `rgba(0, 255, 127, ${Math.min(1, alpha * 1.25)})`;
  }

  // Inside the blob / portrait face:
  if (mode === 'chromatic') {
    // Chromatic Tier Mapping using website palette:
    if (luma < 65) {
      // Deep shadows / suit: Cyber Green with deep violet undertones
      return luma < 38
        ? `rgba(138, 43, 226, ${Math.min(1, alpha * 1.2)})` // Neo-Purple #8A2BE2
        : `rgba(0, 255, 127, ${Math.min(1, alpha * 1.2)})`; // Neo-Green #00FF7F
    } else if (luma < 150) {
      // Midtones (face, smile): Warm Neo-Yellow & amber
      const yellowGlow = Math.min(255, Math.floor(luma * 1.45 + 35));
      return `rgba(255, ${yellowGlow}, 0, ${Math.min(1, alpha * 1.2)})`;
    } else if (luma < 210) {
      // Highlights (forehead, cheek): Neo-Cyan
      const cyanGlow = Math.min(255, Math.floor(luma * 1.1 + 40));
      return `rgba(0, ${cyanGlow}, 255, ${Math.min(1, alpha * 1.2)})`;
    } else {
      // Top highlights (collar, glint): Pure electric white
      return `rgba(255, 255, 255, ${Math.min(1, alpha * 1.3)})`;
    }
  }

  if (mode === 'photo-rgb') {
    // True photo RGB with saturation & vibrancy boost:
    const maxChannel = Math.max(r, g, b);
    const minChannel = Math.min(r, g, b);
    const delta = maxChannel - minChannel;
    const satBoost = delta > 15 ? 1.45 : 1.15;
    let nr = Math.min(255, Math.floor(r * satBoost * 1.25 + 10));
    let ng = Math.min(255, Math.floor(g * satBoost * 1.20 + 12));
    let nb = Math.min(255, Math.floor(b * satBoost * 1.15 + 5));

    // Warm up skin tones into golden amber, cool tones into cyan:
    if (nr > ng && nr > nb) {
      nr = Math.min(255, nr + 25);
      ng = Math.min(255, Math.floor(ng * 1.1));
    } else if (nb > nr && nb > ng) {
      ng = Math.min(255, ng + 20);
      nb = Math.min(255, nb + 30);
    }
    return `rgba(${nr}, ${ng}, ${nb}, ${Math.min(1, alpha * 1.2)})`;
  }

  // Default 'classic' & 'multi-glitch' interior:
  // Luminous cyberpunk amber-green phosphor
  const green = Math.min(255, Math.floor(luma * 1.22 + 18));
  const red = Math.min(255, Math.floor(luma * 0.96 + 10));
  const blue = Math.min(255, Math.floor(luma * 0.42 + 5));
  return `rgba(${red}, ${green}, ${blue}, ${Math.min(1, alpha * 1.2)})`;
};

export const AsciiPhoto: React.FC<AsciiPhotoProps> = ({
  src = PERSONAL_INFO.profilePic,
  alt = PERSONAL_INFO.profilePicAlt,
  isHeroFace = false,
  colorMode = 'photo-rgb',
  className = '',
  grayscaleHero = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isHoveredRef = useRef(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgElementRef = useRef<HTMLImageElement | null>(null);

  // Mouse cursor tracking inside the photo
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });

  // Organic blob nodes
  const blobsRef = useRef<BlobNode[]>(createBlobSeeds());

  // Blob transition progress: 0.0 (fully photo) -> 1.0 (fully active blobs)
  const transitionProgressRef = useRef(0.0);
  const rafIdRef = useRef<number | null>(null);
  const renderLoopRef = useRef<(() => void) | null>(null);

  // Dynamic grid dimensions & sampled pixel cache
  const gridRef = useRef<{ cols: number; rows: number }>({ cols: 48, rows: 54 });
  const sampledDataRef = useRef<Uint8ClampedArray | null>(null);

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

    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
    if (!offCtx) return;

    // Synchronize physical canvas pixel size with container and resample
    const syncDimensionsAndSample = () => {
      if (!containerRef.current || !canvas || !imgElementRef.current) return;
      const img = imgElementRef.current;
      const imgW = img.naturalWidth || 2543;
      const imgH = img.naturalHeight || 3435;

      // Read untransformed layout dimensions (clientWidth/clientHeight unaffected by CSS 3D scale/rotation)
      const containerW = containerRef.current.clientWidth || 332;
      const containerH = containerRef.current.clientHeight || 371;

      // Synchronize canvas internal pixel buffer with CSS layout dimensions (1:1 pixel mapping)
      if (canvas.width !== containerW || canvas.height !== containerH) {
        canvas.width = containerW;
        canvas.height = containerH;
      }

      // Compute dynamic grid: fixed 48 columns, dynamic rows matching container aspect ratio
      const sampleCols = 48;
      const sampleRows = Math.max(10, Math.round(sampleCols * (containerH / containerW)));
      gridRef.current = { cols: sampleCols, rows: sampleRows };

      // Compute exact object-cover object-top source rectangle
      const targetAspect = containerW / containerH;
      const imgAspect = imgW / imgH;

      let sx = 0;
      let sy = 0;
      let sWidth = imgW;
      let sHeight = imgH;

      if (imgAspect > targetAspect) {
        // Image is wider than container: crop sides, anchor top
        sWidth = imgH * targetAspect;
        sx = (imgW - sWidth) / 2;
        sy = 0;
      } else {
        // Image is taller than container: crop bottom, anchor top
        sHeight = imgW / targetAspect;
        sx = 0;
        sy = 0;
      }

      offCanvas.width = sampleCols;
      offCanvas.height = sampleRows;
      offCtx.clearRect(0, 0, sampleCols, sampleRows);
      offCtx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, sampleCols, sampleRows);

      try {
        const imgData = offCtx.getImageData(0, 0, sampleCols, sampleRows);
        sampledDataRef.current = imgData.data;
      } catch {
        sampledDataRef.current = null;
      }

      if (isHeroFace) {
        renderStaticFlipFace();
      }
    };

    // ── Static Render for Hero Front Face (Morph + Flip Architecture) ──
    const renderStaticFlipFace = () => {
      const { width, height } = canvas;
      if (width === 0 || height === 0) return;
      const pixels = sampledDataRef.current;
      if (!pixels) return;

      const { cols: sampleCols, rows: sampleRows } = gridRef.current;
      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, width, height);

      const cellW = width / sampleCols;
      const cellH = height / sampleRows;
      ctx.font = `bold ${Math.floor(cellH * 1.05)}px "Space Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let y = 0; y < sampleRows; y++) {
        for (let x = 0; x < sampleCols; x++) {
          const idx = (y * sampleCols + x) * 4;
          const r = pixels[idx];
          const g = pixels[idx + 1];
          const b = pixels[idx + 2];
          const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

          const normBright = brightness / 255;
          const boosted = Math.min(1, Math.pow(normBright, 0.80) * 1.28);
          const luma = boosted * 255;
          const charIdx = Math.min(ASCII_RAMP.length - 1, Math.floor(boosted * ASCII_RAMP.length));
          const char = ASCII_RAMP[charIdx];

          if (luma > 14) {
            ctx.fillStyle = getAsciiCharColor(colorMode, r, g, b, luma, false, x, y, 0, 1.0);
            ctx.fillText(char, x * cellW + cellW / 2, y * cellH + cellH / 2);
          }
        }
      }
    };

    // ── Interactive Organic ASCII Blob Simulation (About Back Face) ──
    const renderBlobAscii = () => {
      const { width, height } = canvas;
      if (width === 0 || height === 0) return;

      const target = isHoveredRef.current ? 1.0 : 0.0;
      const speed = isHoveredRef.current ? 0.075 : 0.055;

      if (Math.abs(transitionProgressRef.current - target) > 0.005) {
        transitionProgressRef.current += (target - transitionProgressRef.current) * speed;
      } else {
        transitionProgressRef.current = target;
      }

      const progress = transitionProgressRef.current;

      // When unhovered and fully at 0, clear canvas and cleanly terminate animation loop!
      if (!isHoveredRef.current && progress <= 0.008) {
        ctx.clearRect(0, 0, width, height);
        transitionProgressRef.current = 0.0;
        rafIdRef.current = null;
        return;
      }

      const pixels = sampledDataRef.current;
      if (!pixels) return;

      const { cols: sampleCols, rows: sampleRows } = gridRef.current;
      ctx.clearRect(0, 0, width, height);

      const cellW = width / sampleCols;
      const cellH = height / sampleRows;
      const aspect = width / height;

      ctx.font = `bold ${Math.floor(cellH * 1.05)}px "Space Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const now = performance.now();
      const t = now * 0.0016;

      const blobs = blobsRef.current;

      // Smoothly steer Blob 0 toward mouse cursor position
      blobs[0].curX += (mousePosRef.current.x - blobs[0].curX) * 0.10;
      blobs[0].curY += (mousePosRef.current.y - blobs[0].curY) * 0.10;

      // Autonomous organic wandering for blobs 1-4
      for (let k = 1; k < blobs.length; k++) {
        const b = blobs[k];
        b.curX = b.baseX + 0.13 * Math.sin(t * b.speedX + b.phaseX);
        b.curY = b.baseY + 0.11 * Math.cos(t * b.speedY + b.phaseY);
      }

      const threshold = 0.60;
      const edgeFeather = 0.16;

      // Evaluate each cell in the dynamic grid
      for (let y = 0; y < sampleRows; y++) {
        const v = (y + 0.5) / sampleRows;

        for (let x = 0; x < sampleCols; x++) {
          const u = (x + 0.5) / sampleCols;

          // Compute Gaussian metaball potential across all organic blobs
          let potential = 0;
          for (let k = 0; k < blobs.length; k++) {
            const b = blobs[k];
            const dx = u - b.curX;
            const dy = (v - b.curY) / aspect;
            const distSq = dx * dx + dy * dy;

            const effRadius = b.radius * progress * (1.0 + 0.14 * Math.sin(t * 1.5 + k));

            if (effRadius > 0.01) {
              potential += b.weight * Math.exp(-distSq / (2 * effRadius * effRadius));
            }
          }

          // Subtle spatial high-frequency noise for organic digital edge
          const noise = 0.06 * Math.sin(x * 0.65 + t * 2.5) * Math.cos(y * 0.65 + t * 2.5);
          const totalVal = potential + noise;

          // Seamless edge feathering alpha
          const rawAlpha = (totalVal - threshold) / edgeFeather;
          const smoothAlpha = Math.max(0, Math.min(1, rawAlpha));
          const cellAlpha = smoothAlpha * progress;

          if (cellAlpha > 0.02) {
            // Smooth dark backing to avoid harsh square block cutoffs
            ctx.fillStyle = `rgba(6, 6, 6, ${Math.min(0.95, cellAlpha * 1.1)})`;
            ctx.fillRect(x * cellW, y * cellH, cellW + 0.5, cellH + 0.5);

            const isFrontier = totalVal < threshold + 0.12 && progress < 0.98;

            const idx = (y * sampleCols + x) * 4;
            const r = pixels[idx];
            const g = pixels[idx + 1];
            const b = pixels[idx + 2];
            const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

            // Luminance boost curve
            const normBright = brightness / 255;
            const boosted = Math.min(1, Math.pow(normBright, 0.80) * 1.28);
            const luma = boosted * 255;

            if (isFrontier) {
              // Active organic frontier tokens
              const symIdx = (x * 7 + y * 13 + Math.floor(now * 0.05)) % GLITCH_SYMBOLS.length;
              ctx.fillStyle = getAsciiCharColor(colorMode, r, g, b, luma, true, x, y, now, cellAlpha);
              ctx.fillText(GLITCH_SYMBOLS[symIdx], x * cellW + cellW / 2, y * cellH + cellH / 2);
            } else if (luma > 14) {
              // Core of blob: recognizable portrait ASCII with selected color mode
              const charIdx = Math.min(ASCII_RAMP.length - 1, Math.floor(boosted * ASCII_RAMP.length));
              const char = ASCII_RAMP[charIdx];

              ctx.fillStyle = getAsciiCharColor(colorMode, r, g, b, luma, false, x, y, now, cellAlpha);
              ctx.fillText(char, x * cellW + cellW / 2, y * cellH + cellH / 2);
            }
          }
        }
      }

      // Continue animation frame while transitioning or actively hovered
      if (isHoveredRef.current || transitionProgressRef.current > 0.008) {
        rafIdRef.current = requestAnimationFrame(renderBlobAscii);
      } else {
        rafIdRef.current = null;
      }
    };

    renderLoopRef.current = renderBlobAscii;

    // Observe container layout size changes with ResizeObserver for exact 1:1 pixel alignment
    syncDimensionsAndSample();

    const resizeObserver = new ResizeObserver(() => {
      syncDimensionsAndSample();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    window.addEventListener('resize', syncDimensionsAndSample);

    // Initialization
    if (isHeroFace) {
      renderStaticFlipFace();
    } else {
      if (isHoveredRef.current) {
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
    }

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', syncDimensionsAndSample);
      renderLoopRef.current = null;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [imageLoaded, isHeroFace, colorMode]);

  const handleMouseEnter = () => {
    isHoveredRef.current = true;

    // Add slight random phase variation to autonomous blobs on each hover entrance
    const blobs = blobsRef.current;
    for (let k = 1; k < blobs.length; k++) {
      blobs[k].phaseX = Math.random() * Math.PI * 2;
      blobs[k].phaseY = Math.random() * Math.PI * 2;
    }

    // Trigger rAF loop immediately on mouse entrance
    if (!rafIdRef.current && renderLoopRef.current && !isHeroFace) {
      rafIdRef.current = requestAnimationFrame(renderLoopRef.current);
    }
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    // Smooth unhover: Ensure loop is running to smoothly ease progress to 0 and halt gracefully!
    if (!rafIdRef.current && renderLoopRef.current && transitionProgressRef.current > 0.008) {
      rafIdRef.current = requestAnimationFrame(renderLoopRef.current);
    }
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
          isHeroFace
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
        className="absolute inset-0 w-full h-full pointer-events-none opacity-100"
      />
    </div>
  );
};

export default AsciiPhoto;
