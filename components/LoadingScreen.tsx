import React, { useState, useEffect, useRef } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
  onAnimationFinished: () => void;
  name?: string;
}

const LOADING_TEXTS = [
  'INITIALIZING ASSETS...',
  'CONNECTING TO GRID...',
  'CALIBRATING PIXELS...',
  'COMPILING NEURAL WEIGHTS...',
  'DECOMPRESSING MODULES...',
  'AWAKENING AI ASSISTANT...',
  'SYSTEM READY.',
];

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  onAnimationFinished,
  name = 'Sujal Sanjay Chhajed',
}) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState(LOADING_TEXTS[0]);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isContentHidden, setIsContentHidden] = useState(false);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Fast, snappy boot duration (~1100ms total progress)
    const duration = 1100;

    // Fast status cycling (~160ms per line)
    const textInterval = setInterval(() => {
      setStatusText((current) => {
        const idx = LOADING_TEXTS.indexOf(current);
        if (idx === -1 || idx >= LOADING_TEXTS.length - 2) return current;
        return LOADING_TEXTS[idx + 1];
      });
    }, 160);

    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));

      setProgress(pct);

      if (elapsed < duration) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setProgress(100);
        clearInterval(textInterval);
        setStatusText('SYSTEM READY.');

        // 1. Tell parent app to mount content underneath
        onComplete();

        // 2. Snappy buffer (120ms) then lift curtain
        setTimeout(() => {
          setIsContentHidden(true);
          setIsCompleting(true);
        }, 120);

        // 3. Unmount loader once curtain has lifted
        setTimeout(() => {
          onAnimationFinished();
        }, 750);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      clearInterval(textInterval);
    };
  }, [onComplete, onAnimationFinished]);

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[9999] bg-[#050505] text-white flex flex-col justify-between p-6 sm:p-10 font-sans select-none overflow-hidden transition-transform duration-600 ease-[cubic-bezier(0.87,0,0.13,1)] will-change-transform ${
        isCompleting ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      {/* Subtle Dot Grid Background */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Main Content Container */}
      <div
        className={`flex flex-col justify-between h-full w-full relative z-10 transition-opacity duration-200 ease-out ${
          isContentHidden ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Top Header Bar */}
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#FFDE59] shadow-[0_0_8px_#FFDE59] animate-pulse" />
            <span className="text-xs sm:text-sm font-mono font-bold tracking-tight text-white uppercase">
              SYSTEM BOOT // V.2.6
            </span>
          </div>
          <div className="font-mono text-[11px] sm:text-xs text-white/50 tracking-wider hidden sm:flex items-center gap-3">
            <span>MEM: 64MB</span>
            <span>//</span>
            <span className="text-[#FFDE59]">SYS_OK</span>
          </div>
        </div>

        {/* Center Progress Display */}
        <div className="flex flex-col items-center w-full my-auto py-8">
          {/* Large Bold Percentage */}
          <div className="text-[clamp(4.5rem,16vw,10.5rem)] font-black leading-none tracking-tighter text-white tabular-nums">
            {progress}%
          </div>

          {/* Progress Bar Container (High-Contrast White from Deployed Loader) */}
          <div className="w-full max-w-md sm:max-w-lg mt-4 sm:mt-8">
            <div className="w-full h-4 bg-gray-900 border-4 border-white overflow-hidden">
              {/* Actual Filling Bar (Solid White) */}
              <div
                className="h-full bg-white transition-all duration-75 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Status & Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs sm:text-sm font-mono uppercase pb-[env(safe-area-inset-bottom,0px)]">
          <div className="flex items-center gap-2 text-white" role="status" aria-live="polite">
            <span className="text-[#FFDE59] font-bold">&gt;</span>
            <span className="tracking-wide">{statusText}</span>
          </div>
          <div className="text-white/60 tracking-wider text-[11px] sm:text-xs">
            © {new Date().getFullYear()} {name}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(LoadingScreen);
