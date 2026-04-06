
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NavSection } from '../types';
import { SKILLS } from '../constants';
import { DecryptedText } from './ui/DecryptedText';
import ScrollAnimation from './ui/ScrollAnimation';

gsap.registerPlugin(ScrollTrigger);

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

const Skills: React.FC = () => {
  // We shuffle the second row for randomization while keeping the first row ordered (or as is in constants)
  const shuffledSkills = React.useMemo(() => shuffleArray(SKILLS), []);

  const containerRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // We want to create an infinite marquee using GSAP that responds to scroll velocity
    const ctx = gsap.context(() => {
      // Create tweens for each row
      const createMarquee = (rowTarget: HTMLDivElement, direction: number) => {
        // Calculate the exact width of one set of skills
        // We assume the first child is the first set
        const firstSet = rowTarget.children[0] as HTMLElement;
        const width = firstSet.offsetWidth;

        if (direction === 1) {
          // Moving Left
          gsap.set(rowTarget, { x: 0 });
          return gsap.to(rowTarget, {
            x: -width,
            ease: "none",
            duration: 20, // Base duration
            repeat: -1,
          });
        } else {
          // Moving Right
          // Start shifted left by one full set width, animate to 0
          gsap.set(rowTarget, { x: -width });
          return gsap.to(rowTarget, {
            x: 0,
            ease: "none",
            duration: 20,
            repeat: -1,
          });
        }
      };

      if (!row1Ref.current || !row2Ref.current) return;

      const tl1 = createMarquee(row1Ref.current, 1);
      const tl2 = createMarquee(row2Ref.current, -1);

      // Track scroll velocity
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          // self.getVelocity() returns pixels per second
          // We clamp it and map it to a timeScale modifier
          const velocity = Math.abs(self.getVelocity());

          // Base timeScale is 1. Increase based on velocity.
          let timeScale = 1 + (velocity / 500);

          // Clamp the max timeScale to prevent it from going crazy fast
          timeScale = Math.min(timeScale, 10);

          // Animate the timeScale back to 1 smoothly when scrolling stops
          gsap.to([tl1, tl2], {
            timeScale: timeScale,
            duration: 0.1,
            onComplete: () => {
               gsap.to([tl1, tl2], { timeScale: 1, duration: 1, ease: "power2.out" });
            }
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div id={NavSection.SKILLS} className="py-24 overflow-hidden relative border-b-4 border-black dark:border-neo-dark-border" ref={containerRef}>
      <ScrollAnimation variant="blur" className="flex flex-col items-center mb-12">
        <h2 className="text-5xl md:text-7xl font-black uppercase mb-8 text-center flex flex-wrap justify-center gap-4 items-center transform hover:scale-105 transition-transform">
          <span className="text-black dark:text-neo-dark-text"><DecryptedText text="MY" /></span>
          <span className="bg-neo-yellow text-black px-6 py-1 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_#FAFAFA] transform -skew-x-6"><DecryptedText text="ARSENAL" /></span>
        </h2>
      </ScrollAnimation>

      <div className="flex flex-col gap-8">
        {/* Added py-4 to container to prevent hover clipping */}
        <ScrollAnimation variant="slideLeft" delay={0.2} className="flex overflow-hidden group py-4" style={{ willChange: 'transform' }}>
          <div ref={row1Ref} className="flex shrink-0 gap-6 pr-6 w-max">
            <div className="flex shrink-0 gap-6 pr-6">
              {SKILLS.map((skill, idx) => (
                <SkillCard key={`r1-${idx}`} skill={skill} />
              ))}
            </div>
            <div className="flex shrink-0 gap-6 pr-6" aria-hidden="true">
              {SKILLS.map((skill, idx) => (
                <SkillCard key={`r1-dup-${idx}`} skill={skill} />
              ))}
            </div>
            {/* Added an extra set for smoother infinite wrapping depending on screen size */}
            <div className="flex shrink-0 gap-6 pr-6" aria-hidden="true">
              {SKILLS.map((skill, idx) => (
                <SkillCard key={`r1-dup2-${idx}`} skill={skill} />
              ))}
            </div>
          </div>
        </ScrollAnimation>

        {/* Second row randomized */}
        <ScrollAnimation variant="slideRight" delay={0.3} className="flex overflow-hidden group py-4" style={{ willChange: 'transform' }}>
          <div ref={row2Ref} className="flex shrink-0 gap-6 pr-6 w-max">
            <div className="flex shrink-0 gap-6 pr-6">
              {shuffledSkills.map((skill, idx) => (
                <SkillCard key={`r2-${idx}`} skill={skill} />
              ))}
            </div>
            <div className="flex shrink-0 gap-6 pr-6" aria-hidden="true">
              {shuffledSkills.map((skill, idx) => (
                <SkillCard key={`r2-dup-${idx}`} skill={skill} />
              ))}
            </div>
            {/* Extra set */}
            <div className="flex shrink-0 gap-6 pr-6" aria-hidden="true">
              {shuffledSkills.map((skill, idx) => (
                <SkillCard key={`r2-dup2-${idx}`} skill={skill} />
              ))}
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </div>
  );
};

export default React.memo(Skills);
