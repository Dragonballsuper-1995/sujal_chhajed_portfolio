import React from 'react';
import { Project, NavSection } from '../types';
import ProjectCard, { isProjectMatchingRole } from './ProjectCard';
import { FEATURED_PROJECTS, ARCHIVE_PROJECTS } from '../constants';
import { Sparkles, ArrowRight, Filter } from 'lucide-react';
import { useRecruiter } from '../context/RecruiterContext';

interface ProjectsSectionProps {
  onProjectClick: (project: Project) => void;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onProjectClick }) => {
  const { roleFilter, setRoleFilter } = useRecruiter();

  const allProjects = [...FEATURED_PROJECTS, ...ARCHIVE_PROJECTS];
  const matchingProjects = allProjects.filter(p => isProjectMatchingRole(p, roleFilter));
  const totalMatching = matchingProjects.length;

  const ROLE_OPTIONS: { id: 'all' | 'ai-ml' | 'fullstack' | 'data-eng'; label: string; count: number }[] = [
    { id: 'all', label: 'All Projects', count: allProjects.length },
    { id: 'ai-ml', label: 'AI / ML', count: allProjects.filter(p => isProjectMatchingRole(p, 'ai-ml')).length },
    { id: 'fullstack', label: 'Full-Stack', count: allProjects.filter(p => isProjectMatchingRole(p, 'fullstack')).length },
    { id: 'data-eng', label: 'Data Eng', count: allProjects.filter(p => isProjectMatchingRole(p, 'data-eng')).length },
  ];

  return (
    <section id={NavSection.PROJECTS} className="scroll-mt-20 py-20 md:py-28 border-t-4 border-black bg-transparent relative z-10">
      <div className="max-w-6xl mx-auto px-5 md:px-8 relative z-10">

        {/* Section Header (Unboxed, High Visibility) */}
        <div className="mb-12 relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-neo-yellow text-black border-2 border-black font-mono text-xs font-bold uppercase tracking-wider shadow-neo-sm">
              <Sparkles size={12} />
              <span>Proven Architectures</span>
            </div>

            {roleFilter !== 'all' && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-neo-yellow border-2 border-black font-mono text-xs font-bold uppercase tracking-wider shadow-neo-sm animate-fadeIn">
                <Filter size={12} />
                <span>Active Filter: {roleFilter.toUpperCase()}</span>
                <span className="bg-neo-yellow text-black px-1.5 py-0.2 text-[10px]">
                  {totalMatching} Matched
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="font-sans text-4xl sm:text-5xl md:text-6xl font-black text-ink leading-none uppercase tracking-tight">
                Featured Projects
              </h2>
              <p className="font-mono text-sm sm:text-base text-gray-700 max-w-2xl mt-3 leading-relaxed">
                Curated flagship systems solving real-world constraints across hardware recommendation, LLM inference, and cross-platform sync.
              </p>
            </div>

            <div className="font-mono text-xs font-bold px-3.5 py-1.5 bg-white border-2 border-black text-ink uppercase shadow-neo-sm shrink-0 self-start sm:self-end">
              {roleFilter === 'all'
                ? '3 Flagships • 5 Open-Source'
                : `${totalMatching} of ${allProjects.length} Projects Matched`}
            </div>
          </div>

          {/* Role Filter Tabs Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t-2 border-black/10">
            <span className="font-mono text-xs font-bold text-black uppercase mr-1">
              Role:
            </span>
            {ROLE_OPTIONS.map((opt) => {
              const isActive = roleFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setRoleFilter(opt.id)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-neo-yellow text-black border-2 border-black shadow-neo-sm font-black -translate-y-0.5'
                      : 'bg-white text-gray-700 hover:text-black hover:bg-canvas border-2 border-black/30 hover:border-black font-bold'
                  }`}
                >
                  <span>{opt.label}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 border ${
                      isActive
                        ? 'bg-black text-white border-black'
                        : 'bg-gray-100 text-gray-600 border-black/20'
                    }`}
                  >
                    {opt.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Tier 1: 3 Flagship Systems (1 column on mobile/tablet, 3 columns on desktop) ──────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          {FEATURED_PROJECTS.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onCaseStudy={onProjectClick}
              variant="flagship"
            />
          ))}
        </div>

        {/* ── Tier 2 Header: 5 Additional Engineering Projects (Unboxed) ── */}
        <div className="mb-8 pt-6 border-t-2 border-black/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div>
            <h3 className="font-sans text-2xl sm:text-3xl text-ink font-black uppercase tracking-tight">
              Specialized Labs & Machine Learning Models
            </h3>
            <p className="font-mono text-xs text-gray-700 mt-1">
              Deep NLP attention heatmaps, behavioral biometrics, automated MLOps pipelines, and web systems.
            </p>
          </div>
        </div>

        {/* ── Tier 2: 5 Archive Cards (Responsive 2/3 column layout with directly visible details) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 relative z-20">
          {ARCHIVE_PROJECTS.map((project) => (
            <div key={project.id} className="relative">
              <ProjectCard
                project={project}
                onCaseStudy={onProjectClick}
                variant="archive"
              />
            </div>
          ))}
        </div>

        {/* GitHub Deep Link Banner */}
        <div className="p-6 bg-white border-2 border-black shadow-neo flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 boundary-plate" data-boundary="true">
          <div className="font-mono text-sm">
            <span className="font-bold text-black">Looking for model checkpoints & benchmarks?</span>{' '}
            <span className="text-muted">Explore 30+ open repositories on my personal GitHub.</span>
          </div>
          <a
            href="https://github.com/Dragonballsuper-1995"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-bold px-5 py-2.5
              bg-neo-yellow text-black border-2 border-black shadow-neo-sm
              hover:bg-neo-green hover:shadow-neo active:translate-x-0.5 active:translate-y-0.5 transition-all whitespace-nowrap"
          >
            <span>Visit GitHub Profile</span>
            <ArrowRight size={14} />
          </a>
        </div>

      </div>
    </section>
  );
};

export default React.memo(ProjectsSection);
