
import React from 'react';
import { NavSection } from '../types';
import { SKILLS } from '../constants';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DecryptedText } from './ui/DecryptedText';

gsap.registerPlugin(ScrollTrigger);
import ScrollAnimation from './ui/ScrollAnimation';

// Helper to shuffle array
const shuffleArray = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

interface SkillCardProps {
  skill: { name: string; icon: string; level: number };
}

const SkillCard: React.FC<SkillCardProps> = ({ skill }) => {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--x', `${x}px`);
    e.currentTarget.style.setProperty('--y', `${y}px`);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative group/skill bg-white dark:bg-neo-dark-surface border-4 border-black dark:border-neo-dark-border p-4 shadow-neo dark:shadow-neo-dark min-w-[200px] text-center flex items-center justify-center hover:-translate-y-2 transition-transform duration-300 overflow-hidden"
      style={{ contain: 'layout style paint', willChange: 'transform' }}
    >
      {/* Spotlight Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover/skill:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(200px circle at var(--x) var(--y), rgba(0,0,0,0.08), transparent 80%)`
        }}
      />
      {/* Dark mode specific spotlight adjustment */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover/skill:opacity-100 transition-opacity duration-500 hidden dark:block"
        style={{
          background: `radial-gradient(200px circle at var(--x) var(--y), rgba(255,255,255,0.08), transparent 80%)`
        }}
      />

      <span className="text-xl md:text-2xl font-black uppercase text-black dark:text-neo-dark-text relative z-10">{skill.name}</span>
    </div>
  );
};

interface MarqueeRowProps {
  items: { name: string; icon: string; level: number }[];
  direction: 1 | -1;
}

const MarqueeRow: React.FC<MarqueeRowProps> = ({ items, direction }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!rowRef.current) return;

    const xPercent = direction === 1 ? -50 : 0;
    const xPercentEnd = direction === 1 ? 0 : -50;

    gsap.set(rowRef.current, { xPercent });

    const tween = gsap.to(rowRef.current, {
      xPercent: xPercentEnd,
      repeat: -1,
      duration: 30, // Base duration
      ease: "none",
    });

    tweenRef.current = tween;

    // Add ScrollTrigger to modify timeScale based on scroll velocity
    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        // self.getVelocity() returns the scroll velocity
        // We calculate a multiplier, mapping base speed (1) up to a max when scrolling fast
        const velocity = Math.abs(self.getVelocity());
        let timeScale = 1 + (velocity / 500);

        // Cap the maximum speed multiplier
        if (timeScale > 5) timeScale = 5;

        // Apply the new timescale to the tween smoothly
        gsap.to(tween, {
          timeScale: timeScale,
          duration: 0.2, // Smooth transition
          overwrite: true,
          onComplete: () => {
            // Once scroll stops/slows, return to base speed
            gsap.to(tween, {
              timeScale: 1,
              duration: 1,
              ease: "power2.out"
            });
          }
        });
      }
    });

    return () => {
      tweenRef.current?.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [direction]);

  const handleMouseEnter = () => tweenRef.current?.pause();
  const handleMouseLeave = () => tweenRef.current?.play();

  return (
    <div
      className="flex shrink-0 gap-6 w-max"
      ref={rowRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {[...items, ...items, ...items, ...items].map((skill, idx) => (
        <SkillCard key={`mq-${idx}`} skill={skill} />
      ))}
    </div>
  );
};

const Skills: React.FC = () => {
  // We shuffle the second row for randomization while keeping the first row ordered (or as is in constants)
  const shuffledSkills = React.useMemo(() => shuffleArray(SKILLS), []);

  return (
    <div id={NavSection.SKILLS} className="py-24 overflow-hidden relative border-b-4 border-black dark:border-neo-dark-border">
      <ScrollAnimation variant="blur" className="flex flex-col items-center mb-12">
        <h2 className="text-5xl md:text-7xl font-black uppercase mb-8 text-center flex flex-wrap justify-center gap-4 items-center transform hover:scale-105 transition-transform">
          <span className="text-black dark:text-neo-dark-text"><DecryptedText text="MY" /></span>
          <span className="bg-neo-yellow text-black px-6 py-1 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_#FAFAFA] transform -skew-x-6"><DecryptedText text="ARSENAL" /></span>
        </h2>
      </ScrollAnimation>

      <div className="flex flex-col gap-8">
        {/* Removed CSS marquee and used GSAP instead */}
        <ScrollAnimation variant="slideLeft" delay={0.2} className="flex overflow-hidden group py-4" style={{ willChange: 'transform' }}>
          <MarqueeRow items={SKILLS} direction={1} />
        </ScrollAnimation>

        <ScrollAnimation variant="slideRight" delay={0.3} className="flex overflow-hidden group py-4" style={{ willChange: 'transform' }}>
          <MarqueeRow items={shuffledSkills} direction={-1} />
        </ScrollAnimation>
      </div>
    </div>
  );
};

export default React.memo(Skills);
