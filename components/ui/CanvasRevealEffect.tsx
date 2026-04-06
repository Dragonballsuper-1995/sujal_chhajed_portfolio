
import React, { useRef, useEffect } from 'react';

interface CanvasRevealEffectProps {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
  enabled?: boolean;
}

const CanvasRevealEffect: React.FC<CanvasRevealEffectProps> = ({
  animationSpeed = 3,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize = 3,
  showGradient = true,
  enabled = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const randomsRef = useRef<Float32Array | null>(null);

  // Effect 1: Initialization and Resize Listener
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width;
    let height = canvas.height;
    
    // Grid configuration
    const gap = dotSize * 4; // Spacing between dots
    let cols = 0;
    let rows = 0;

    // Pre-calculate phases with radial distance baked in
    const initDots = (c: number, r: number, w: number, h: number) => {
       const total = c * r;
       const cx = w / 2;
       const cy = h / 2;
       
       const newPhases = new Float32Array(total);
       
       for (let j = 0; j < r; j++) {
         for (let i = 0; i < c; i++) {
             const index = j * c + i;
             if (index >= total) break;
             
             const x = i * gap;
             const y = j * gap;
             
             // Calculate distance from center
             const dx = x - cx;
             const dy = y - cy;
             const dist = Math.sqrt(dx * dx + dy * dy);
             
             // 1. Random noise (0 to 2PI) for the "twinkle"
             const randomShift = Math.random() * Math.PI * 2;
             
             // 2. Radial offset (-dist / freq) to create outward motion
             // The 35 divisor controls the wavelength of the ripple
             const radialOffset = -dist / 35; 
             
             // Combine them: The dot will oscillate based on time + this value
             newPhases[index] = randomShift + radialOffset;
         }
       }
       randomsRef.current = newPhases;
    };

    const resize = () => {
       const parent = canvas.parentElement;
       if(parent) {
           const rect = parent.getBoundingClientRect();
           width = rect.width;
           height = rect.height;
           
           // Handle High DPI displays
           const dpr = window.devicePixelRatio || 1;
           canvas.width = width * dpr;
           canvas.height = height * dpr;
           canvas.style.width = `${width}px`;
           canvas.style.height = `${height}px`;
           ctx.scale(dpr, dpr);

           cols = Math.ceil(width / gap);
           rows = Math.ceil(height / gap);
           
           initDots(cols, rows, width, height);
       }
    };
    
    // Initial resize and listener
    resize();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [dotSize]); // Only re-init if dotSize changes (or geometry related props)

  // Effect 2: Animation Loop
  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    const gap = dotSize * 4;

    const draw = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      
      const cols = Math.ceil(width / gap);
      const rows = Math.ceil(height / gap);

      // Increment time for animation
      time += animationSpeed * 0.01; 
      
      ctx.clearRect(0, 0, width, height);

      const baseColor = colors[0];
      const [r, g, b] = baseColor;
      const phases = randomsRef.current;
      
      if (!phases) {
          animationFrameId = requestAnimationFrame(draw);
          return;
      }

      // Group dots by opacity level for grouped drawing
      const dotsByOpacity: Record<string, {x: number, y: number}[]> = {};
      for (const opacity of opacities) {
         if (opacity > 0) {
             dotsByOpacity[opacity.toString()] = [];
         }
      }

      // Draw Loop (Scanline order)
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            const index = j * cols + i;
            if (index >= phases.length) continue;

            const phase = phases[index];
            
            // The sine wave now includes the baked-in radial offset
            // resulting in a wave traveling outwards from the center
            const val = Math.sin(time + phase);
            
            // Normalize -1..1 to 0..1
            const normalized = (val + 1) / 2;
            
            // Map to opacity levels
            const opacityIndex = Math.floor(normalized * (opacities.length - 1));
            const opacity = opacities[opacityIndex];
            
            // Optimization: Skip fully transparent dots
            if (opacity > 0) {
                const x = i * gap;
                const y = j * gap;

                dotsByOpacity[opacity.toString()].push({ x: x + gap/2, y: y + gap/2 });
            }
        }
      }

      // Draw each opacity level as a single path
      for (const opacityStr in dotsByOpacity) {
          const dots = dotsByOpacity[opacityStr];
          if (dots.length > 0) {
              ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacityStr})`;
              ctx.beginPath();
              for (const dot of dots) {
                  // Draw rectangles instead of arcs for performance
                  ctx.rect(dot.x - dotSize / 2, dot.y - dotSize / 2, dotSize, dotSize);
              }
              ctx.fill();
          }
      }
      
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled, animationSpeed, colors, opacities, dotSize]);

  return (
    <div className={`h-full w-full relative bg-transparent ${containerClassName}`}>
       <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
       {showGradient && (
         <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent dark:from-black/50 dark:to-transparent pointer-events-none" />
       )}
    </div>
  );
};

export default React.memo(CanvasRevealEffect);
