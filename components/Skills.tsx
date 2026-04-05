
import React from 'react';
import { NavSection } from '../types';
import { SKILLS } from '../constants';
import { DecryptedText } from './ui/DecryptedText';
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
        {/* Added py-4 to container to prevent hover clipping */}
        <ScrollAnimation variant="slideLeft" delay={0.2} className="flex overflow-hidden group py-4" style={{ willChange: 'transform' }}>
          <div className="flex shrink-0 animate-marquee gap-6 pr-6 group-hover:[animation-play-state:paused]">
            {[...SKILLS, ...SKILLS].map((skill, idx) => (
              <SkillCard key={`r1-${idx}`} skill={skill} />
            ))}
          </div>
          <div className="flex shrink-0 animate-marquee gap-6 pr-6 group-hover:[animation-play-state:paused]" aria-hidden="true">
            {[...SKILLS, ...SKILLS].map((skill, idx) => (
              <SkillCard key={`r1-dup-${idx}`} skill={skill} />
            ))}
          </div>
        </ScrollAnimation>

        {/* Second row randomized */}
        <ScrollAnimation variant="slideRight" delay={0.3} className="flex overflow-hidden group py-4" style={{ willChange: 'transform' }}>
          <div className="flex shrink-0 animate-marquee-reverse gap-6 pr-6 group-hover:[animation-play-state:paused]">
            {[...shuffledSkills, ...shuffledSkills].map((skill, idx) => (
              <SkillCard key={`r2-${idx}`} skill={skill} />
            ))}
          </div>
          <div className="flex shrink-0 animate-marquee-reverse gap-6 pr-6 group-hover:[animation-play-state:paused]" aria-hidden="true">
            {[...shuffledSkills, ...shuffledSkills].map((skill, idx) => (
              <SkillCard key={`r2-dup-${idx}`} skill={skill} />
            ))}
          </div>
        </ScrollAnimation>
      </div>
    </div>
  );
};

export default React.memo(Skills);
