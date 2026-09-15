import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { SKILLS, SKILL_CATEGORY_META } from '../constants';
import { NavSection, SkillCategory } from '../types';

const SI_CDN = 'https://cdn.simpleicons.org';

const CATEGORY_STYLES: Record<string, { bgClass: string; textClass: string; borderClass: string }> = {
  'ml-genai': {
    bgClass: 'bg-neo-blue',
    textClass: 'text-black',
    borderClass: 'border-black'
  },
  'fullstack': {
    bgClass: 'bg-neo-green',
    textClass: 'text-black',
    borderClass: 'border-black'
  },
  'data-eng': {
    bgClass: 'bg-neo-yellow',
    textClass: 'text-black',
    borderClass: 'border-black'
  },
  'mlops': {
    bgClass: 'bg-neo-purple',
    textClass: 'text-white',
    borderClass: 'border-black'
  },
};

interface SkillPillProps {
  name: string;
  svgSlug: string;
  category: SkillCategory;
}

const SkillPill: React.FC<SkillPillProps> = ({ name, svgSlug, category }) => {
  const [iconError, setIconError] = useState(false);
  const style = CATEGORY_STYLES[category] || CATEGORY_STYLES['ml-genai'];
  const isDarkPill = category === 'mlops';

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1.5 ${style.bgClass} ${style.textClass}
        border-2 border-black shadow-[2px_2px_0px_0px_#000]
        hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-sm
        active:translate-x-0.5 active:translate-y-0.5 active:shadow-none
        transition-all duration-150 select-none group cursor-default`}
      title={`${name} • ${SKILL_CATEGORY_META[category].label}`}
    >
      <span className="flex-shrink-0 w-3.5 h-3.5 flex items-center justify-center" aria-hidden="true">
        {!iconError ? (
          <img
            src={`${SI_CDN}/${svgSlug}${isDarkPill ? '/ffffff' : '/000000'}`}
            alt=""
            width={14}
            height={14}
            className="w-3.5 h-3.5 object-contain group-hover:scale-110 transition-transform"
            onError={() => setIconError(true)}
            loading="lazy"
          />
        ) : (
          <span className="text-[9px] font-mono font-bold leading-none uppercase">
            {name.slice(0, 2)}
          </span>
        )}
      </span>
      <span className="font-mono text-xs font-bold tracking-tight whitespace-nowrap">
        {name}
      </span>
    </div>
  );
};

const CATEGORY_KEYS: SkillCategory[] = ['ml-genai', 'fullstack', 'data-eng', 'mlops'];

const Skills: React.FC = () => {
  return (
    <section id={NavSection.SKILLS} className="scroll-mt-24 sm:scroll-mt-28 py-16 md:py-24 border-t-4 border-black bg-transparent">
      <div className="max-w-6xl mx-auto px-5 md:px-8">

        {/* Section Header */}
        <div className="mb-10 sm:mb-12 relative z-10">
          <div className="inline-block px-2.5 py-0.5 bg-black text-neo-yellow font-mono text-xs font-bold uppercase tracking-widest mb-2 shadow-neo-sm border-2 border-black">
            Technical Arsenal
          </div>
          <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-black text-ink leading-none uppercase tracking-tight">
            Skills &amp; Frameworks
          </h2>
          <p className="font-mono text-xs sm:text-sm text-gray-700 max-w-2xl mt-2 leading-relaxed">
            Verified production toolchain across machine learning, generative AI, full-stack architecture, data engineering, and MLOps.
          </p>
        </div>

        {/* ── Verified Toolchain Arsenal ── */}
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-black" />
              <h3 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-black">
                // Verified Toolchain &amp; Frameworks
              </h3>
            </div>
            <span className="font-mono text-xs font-bold px-2.5 py-0.5 bg-black text-white shadow-neo-sm border border-black self-start sm:self-auto">
              23 Production Tools
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
            {CATEGORY_KEYS.map((catKey) => {
              const meta = SKILL_CATEGORY_META[catKey];
              const catSkills = SKILLS.filter(s => s.category === catKey);

              return (
                <div
                  key={catKey}
                  className="bg-white border-2 border-black p-4 sm:p-5 shadow-neo-sm relative z-10 boundary-plate flex flex-col h-full min-h-[148px] sm:min-h-[155px]"
                  data-boundary="true"
                >
                  {/* Category Header */}
                  <div className="flex items-center justify-between gap-3 mb-3 pb-2 border-b-2 border-black/10">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 border-2 border-black shadow-[1px_1px_0px_0px_#000]"
                        style={{ backgroundColor: meta.color }}
                      />
                      <h4 className="font-sans text-sm sm:text-base font-black uppercase tracking-wider text-black">
                        {meta.label}
                      </h4>
                    </div>
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 bg-black text-white border border-black shadow-neo-sm">
                      {catSkills.length} Tools
                    </span>
                  </div>

                  {/* Skill Pills */}
                  <div className="flex flex-wrap gap-2">
                    {catSkills.map((skill) => (
                      <SkillPill
                        key={skill.name}
                        name={skill.name}
                        svgSlug={skill.svgSlug}
                        category={skill.category}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default React.memo(Skills);
