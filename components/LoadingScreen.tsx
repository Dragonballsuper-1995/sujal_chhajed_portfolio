import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
  onAnimationFinished: () => void;
  name?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete, onAnimationFinished }) => {
  const [phase, setPhase] = useState<'sc' | 'morph' | 'full' | 'fadeout'>('sc');

  useEffect(() => {
    // Phase timeline (deliberate boot sequence):
    // 0ms    → show "SC" monogram
    // 700ms  → begin morph to "Sujal—"
    // 1300ms → show full name "Sujal Chhajed"
    // 2100ms → trigger onComplete (site ready) and start fadeout
    // 2500ms → unmount loader cleanly

    const t1 = setTimeout(() => setPhase('morph'), 700);
    const t2 = setTimeout(() => setPhase('full'), 1300);
    const t3 = setTimeout(() => {
      onComplete();
      setPhase('fadeout');
    }, 2100);
    const t4 = setTimeout(() => onAnimationFinished(), 2500);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete, onAnimationFinished]);

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-canvas
        transition-opacity duration-150
        ${phase === 'fadeout' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <div className="relative flex flex-col items-center gap-4 text-center px-4" style={{ minWidth: 260 }}>
        <div className="relative overflow-hidden w-full flex justify-center py-2" style={{ minHeight: 64 }}>
          {/* SC — shown initially */}
          <span
            className={`block font-sans text-ink font-black text-6xl leading-none tracking-tight select-none
              transition-all duration-300 ease-out
              ${phase === 'sc' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-3 scale-95 absolute'}`}
          >
            SC
          </span>

          {/* Morph phase — animating in */}
          <span
            className={`block font-sans text-ink font-black text-4xl sm:text-5xl leading-none tracking-tight select-none
              transition-all duration-300 ease-out
              ${phase === 'morph' ? 'opacity-100 translate-y-0' : phase === 'full' || phase === 'fadeout' ? 'opacity-0 -translate-y-2 absolute' : 'opacity-0 translate-y-3 absolute'}`}
          >
            Sujal—
          </span>

          {/* Full name — final state */}
          <span
            className={`block font-sans text-ink font-black text-3xl sm:text-4xl leading-none tracking-tight select-none
              transition-all duration-300 ease-out
              ${phase === 'full' || phase === 'fadeout' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 absolute'}`}
          >
            Sujal Chhajed
          </span>
        </div>

        {/* Minimal neo-brutalist progress track */}
        <div className="w-48 h-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] overflow-hidden">
          <div
            className="h-full bg-neo-yellow transition-all duration-700 ease-out"
            style={{
              width: phase === 'sc' ? '25%' : phase === 'morph' ? '65%' : '100%'
            }}
          />
        </div>

        <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-muted">
          {phase === 'sc' ? 'Initializing...' : phase === 'morph' ? 'Loading Core Stack...' : 'System Ready'}
        </span>
      </div>
    </div>
  );
};

export default LoadingScreen;
