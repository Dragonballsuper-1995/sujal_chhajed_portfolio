import React, { useState } from 'react';
import { Github, ExternalLink, ArrowRight, BookOpen, Sparkles, Zap, CheckCircle2 } from 'lucide-react';
import { Project } from '../types';
import CanvasRevealEffect from './ui/CanvasRevealEffect';
import { useRecruiter, RoleFilter } from '../context/RecruiterContext';

export const isProjectMatchingRole = (project: Project, role: RoleFilter): boolean => {
  if (role === 'all') return true;
  const category = (project.category || '').toLowerCase();
  const title = (project.title || '').toLowerCase();
  const tags = (project.tags || []).map(t => t.toLowerCase());

  if (role === 'ai-ml') {
    return (
      category.includes('ai') ||
      category.includes('ml') ||
      title.includes('phonos') ||
      title.includes('metagen') ||
      title.includes('alphagaze') ||
      title.includes('anomlogbert') ||
      title.includes('proctoring') ||
      tags.some(t =>
        t.includes('bert') ||
        t.includes('xgboost') ||
        t.includes('transformers') ||
        t.includes('pytorch') ||
        t.includes('llama') ||
        t.includes('hugging') ||
        t.includes('scikit') ||
        t.includes('gemini')
      )
    );
  }

  if (role === 'fullstack') {
    return (
      category.includes('fullstack') ||
      category.includes('full-stack') ||
      category.includes('web') ||
      title.includes('loopa') ||
      title.includes('urban escapade') ||
      title.includes('proctoring') ||
      tags.some(t =>
        t.includes('react') ||
        t.includes('next') ||
        t.includes('fastapi') ||
        t.includes('kotlin') ||
        t.includes('supabase') ||
        t.includes('html') ||
        t.includes('css') ||
        t.includes('node')
      )
    );
  }

  if (role === 'data-eng') {
    return (
      category.includes('data') ||
      title.includes('fpl') ||
      title.includes('phonos') ||
      title.includes('alphagaze') ||
      tags.some(t =>
        t.includes('xgboost') ||
        t.includes('pandas') ||
        t.includes('actions') ||
        t.includes('prophet') ||
        t.includes('python') ||
        t.includes('sql')
      )
    );
  }

  return true;
};

const hexToRgb = (hex: string): number[] => {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  return [r, g, b];
};

interface ProjectCardProps {
  project: Project;
  onCaseStudy: (project: Project) => void;
  variant?: 'flagship' | 'archive';
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onCaseStudy, variant = 'flagship' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isRecruiterMode, roleFilter } = useRecruiter();

  const rgbColor = hexToRgb(project.accentColor || '#FFDE59');
  const isRoleMatch = roleFilter === 'all' || isProjectMatchingRole(project, roleFilter);

  // ── ARCHIVE TIER VARIANT (Clean white at rest, floating popover on hover) ──
  // ── ARCHIVE TIER VARIANT (Clean, balanced card with directly visible content) ──
  if (variant === 'archive') {
    return (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          if (project.caseStudy) {
            onCaseStudy(project);
          }
        }}
        className={`relative group flex flex-col justify-between overflow-hidden bg-white border-2 border-black shadow-neo-sm
          hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo transition-all duration-200 h-full min-h-[260px] ${
            project.caseStudy ? 'cursor-pointer' : ''
          } ${
            roleFilter !== 'all' && !isRoleMatch
              ? 'opacity-40 grayscale contrast-75 hover:opacity-100 hover:grayscale-0'
              : ''
          } ${
            roleFilter !== 'all' && isRoleMatch ? 'ring-2 ring-neo-yellow' : ''
          }`}
      >
        {/* Top Accent Strip */}
        <div
          className="h-2 w-full border-b-2 border-black"
          style={{ backgroundColor: project.accentColor }}
        />

        {/* Decorative Diagonal Watermark in background */}
        <div
          className="absolute -right-2 -bottom-3 text-7xl font-sans font-black text-black/[0.04] select-none pointer-events-none uppercase rotate-6 group-hover:rotate-0 group-hover:scale-105 transition-transform duration-300"
          aria-hidden="true"
        >
          0{project.id}
        </div>

        {/* Hover Canvas Reveal Effect (Dotted live grid in accent color on hover only) */}
        <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-multiply">
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName="bg-transparent"
            colors={[rgbColor, [0, 0, 0]]}
            opacities={[0.2, 0.2, 0.3, 0.5, 0.7, 0.9]}
            dotSize={2.5}
            enabled={isHovered}
          />
        </div>

        {/* Card Header & Content */}
        <div className="relative z-10 p-3.5 sm:p-5 flex flex-col flex-1 justify-between">
          <div>
            {/* Top Category & Match Badges */}
            <div className="flex items-center justify-between gap-2 mb-2 sm:mb-2.5 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-mono text-[9px] sm:text-[10px] font-black uppercase px-1.5 sm:px-2 py-0.5 bg-black text-white border border-black">
                  {project.category}
                </span>
                {roleFilter !== 'all' && isRoleMatch && (
                  <span className="font-mono text-[8px] sm:text-[9px] font-black uppercase px-1 sm:px-1.5 py-0.5 bg-neo-yellow text-black border border-black shadow-[1px_1px_0px_0px_#000]">
                    ★ MATCH
                  </span>
                )}
              </div>
              {project.caseStudy && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCaseStudy(project);
                  }}
                  className="p-1 hover:bg-black hover:text-white transition-colors border border-black bg-white flex items-center gap-1 text-[9px] sm:text-[10px] font-mono font-bold cursor-pointer"
                  title="View Case Study"
                >
                  <BookOpen size={11} className="sm:w-3 sm:h-3" />
                  <span>Case Study</span>
                </button>
              )}
            </div>

            {/* Title */}
            <h3 className="font-sans text-base sm:text-lg md:text-xl font-black text-black leading-tight uppercase mb-1 sm:mb-1.5 group-hover:underline underline-offset-2 break-words min-w-0">
              {project.title}
            </h3>

            {/* Tagline if present */}
            {project.tagline && (
              <p className="font-mono text-[11px] sm:text-xs font-semibold text-gray-700 uppercase tracking-tight mb-1.5 sm:mb-2.5 line-clamp-1">
                {project.tagline}
              </p>
            )}

            {/* Primary Metric */}
            {project.primaryMetric && (
              <div className="font-mono text-[11px] sm:text-xs font-bold text-black flex items-center gap-1.5 mb-2 sm:mb-3 bg-neo-yellow/25 p-1 sm:p-1.5 border border-black/20">
                <span>⚡</span>
                <span className="truncate">{project.primaryMetric}</span>
              </div>
            )}

            {/* Description directly visible on card surface - clamped on mobile for cleaner height */}
            <p className="font-mono text-[11px] sm:text-xs text-gray-800 leading-relaxed mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-3">
              {project.description}
            </p>

            {/* Tech Stack Tags - top 2 on mobile, all on desktop */}
            <div className="flex flex-wrap gap-1 mb-2.5 sm:mb-3">
              {project.tags.slice(0, 2).map((t) => (
                <span
                  key={t}
                  className="font-mono text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 bg-canvas border border-black/30 text-black"
                >
                  {t}
                </span>
              ))}
              {project.tags.slice(2).map((t) => (
                <span
                  key={t}
                  className="hidden sm:inline-flex font-mono text-[10px] font-bold px-1.5 py-0.5 bg-canvas border border-black/30 text-black"
                >
                  {t}
                </span>
              ))}
              {project.tags.length > 2 && (
                <span className="sm:hidden font-mono text-[9px] font-bold px-1 py-0.5 text-muted">
                  +{project.tags.length - 2}
                </span>
              )}
            </div>

            {/* Recruiter Mode Pipeline Brief (if active) */}
            {isRecruiterMode && project.caseStudy?.architecture && project.caseStudy.architecture.length > 0 && (
              <div className="text-[10px] font-mono text-gray-800 bg-canvas p-1.5 border border-black/20 mb-2">
                <span className="font-black text-black uppercase">Pipeline: </span>
                {project.caseStudy.architecture.map(a => a.title).join(' → ')}
              </div>
            )}
          </div>

          {/* Action Links */}
          <div className="mt-auto pt-2 sm:pt-3 border-t border-black/15 flex gap-2">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-1 flex items-center justify-center gap-1 font-mono text-[11px] sm:text-xs font-bold py-1 sm:py-1.5 px-2
                  bg-white text-black border border-black hover:bg-black hover:text-white transition-colors"
              >
                <Github size={12} />
                <span>Code</span>
              </a>
            )}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-1 flex items-center justify-center gap-1 font-mono text-[11px] sm:text-xs font-bold py-1 sm:py-1.5 px-2
                  bg-black text-white border border-black hover:bg-white hover:text-black transition-colors"
              >
                <ExternalLink size={12} />
                <span>Live ↗</span>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── FLAGSHIP TIER VARIANT (Clean white at rest, live coloured dot grid on hover) ──
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (project.caseStudy) {
          onCaseStudy(project);
        }
      }}
      className={`relative group flex flex-col justify-between overflow-hidden bg-white border-4 border-black shadow-neo
        hover:-translate-x-1 hover:-translate-y-1 hover:shadow-neo-lg transition-all duration-200 h-full ${
          project.caseStudy ? 'cursor-pointer' : ''
        } ${
          roleFilter !== 'all' && !isRoleMatch
            ? 'opacity-40 grayscale contrast-75 hover:opacity-100 hover:grayscale-0'
            : ''
        } ${
          roleFilter !== 'all' && isRoleMatch ? 'ring-4 ring-neo-yellow' : ''
        }`}
    >
      {/* Top Accent Strip */}
      <div
        className="h-2 w-full border-b-2 border-black"
        style={{ backgroundColor: project.accentColor }}
      />

      {/* Interactive Dotted Canvas Reveal Mesh (Only visible on hover) */}
      <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-multiply">
        <CanvasRevealEffect
          animationSpeed={3.5}
          containerClassName="bg-transparent"
          colors={[rgbColor, [0, 0, 0]]}
          opacities={[0.2, 0.2, 0.3, 0.5, 0.7, 0.9, 1]}
          dotSize={3}
          enabled={isHovered}
        />
      </div>

      {/* Decorative Diagonal Watermark in background */}
      <div
        className="absolute -right-6 -bottom-6 text-8xl font-sans font-black text-black/[0.04] select-none pointer-events-none uppercase rotate-6 group-hover:rotate-0 group-hover:scale-105 transition-transform duration-300"
        aria-hidden="true"
      >
        0{project.id}
      </div>

      {/* Content Container */}
      <div className="relative z-10 p-4 sm:p-6 md:p-8 flex flex-col flex-1">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 sm:gap-3 mb-2.5 sm:mb-4 flex-wrap">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="font-mono text-[10px] sm:text-xs font-black uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 bg-black text-white border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              {project.category}
            </span>
            {roleFilter !== 'all' && isRoleMatch && (
              <span className="font-mono text-[9px] sm:text-xs font-black uppercase px-1.5 sm:px-2 py-0.5 bg-neo-yellow text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center gap-1">
                <CheckCircle2 size={12} />
                <span>Role Match</span>
              </span>
            )}
          </div>
          <span
            className="font-mono text-[10px] sm:text-xs font-bold px-2 py-0.5 border border-black"
            style={{ backgroundColor: project.accentColor + '35' }}
          >
            FLAGSHIP 0{project.id}
          </span>
        </div>

        {/* Project Title */}
        <h3 className="font-sans text-2xl sm:text-3xl lg:text-2xl xl:text-3xl font-black text-black leading-tight uppercase mb-1 sm:mb-3 group-hover:underline underline-offset-4 decoration-black break-words min-w-0">
          {project.title}
        </h3>

        {/* Tagline */}
        {project.tagline && (
          <p className="font-mono text-[11px] sm:text-xs md:text-sm font-bold text-muted uppercase tracking-tight mb-2.5 sm:mb-4 line-clamp-1 sm:line-clamp-none">
            {project.tagline}
          </p>
        )}

        {/* Description - clamped on mobile for compact height */}
        <p className="font-mono text-xs sm:text-sm text-black leading-relaxed mb-3 sm:mb-6 flex-1 line-clamp-3 sm:line-clamp-none">
          {project.description}
        </p>

        {/* Primary Metric Banner */}
        {project.primaryMetric && (
          <div
            className="mb-3 sm:mb-6 p-2 sm:p-3 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center gap-2 min-w-0"
            style={{ borderLeftWidth: 6, borderLeftColor: project.accentColor }}
          >
            <Sparkles size={15} className="text-black shrink-0" />
            <div className="font-mono text-xs sm:text-sm font-bold text-black truncate min-w-0">
              {project.primaryMetric}
            </div>
          </div>
        )}

        {/* Stack Tags (top 2 on mobile, up to 3 or all on desktop) */}
        <div className="flex flex-wrap gap-1.5 mb-4 sm:mb-6">
          {(isRecruiterMode ? project.tags : project.tags.slice(0, 3)).map((tag, idx) => (
            <span
              key={tag}
              className={`font-mono text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 bg-canvas text-black border border-black shadow-[1px_1px_0px_0px_#000] ${
                idx >= 2 ? 'hidden sm:inline-flex' : ''
              }`}
            >
              {tag}
            </span>
          ))}
          {!isRecruiterMode && project.tags.length > 2 && (
            <span className="sm:hidden font-mono text-[10px] font-bold px-1 py-0.5 text-muted self-center">
              +{project.tags.length - 2} more
            </span>
          )}
          {!isRecruiterMode && project.tags.length > 3 && (
            <span className="hidden sm:inline font-mono text-[10px] font-bold px-1.5 py-0.5 text-muted self-center">
              +{project.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Recruiter Speedrun Mode: Direct In-Line Architecture Brief & Production Metrics */}
        {isRecruiterMode && project.caseStudy && (
          <div className="mb-6 p-4 bg-canvas border-2 border-black shadow-neo-sm space-y-3">
            <div className="flex items-center justify-between border-b border-black/20 pb-2 flex-wrap gap-1">
              <span className="font-mono text-xs font-black uppercase text-black flex items-center gap-1.5">
                <Zap size={14} className="fill-black" />
                Recruiter Architecture Brief
              </span>
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-black text-white">
                In-Line Direct Inspection
              </span>
            </div>

            {/* Key Architecture Stages */}
            {project.caseStudy.architecture && project.caseStudy.architecture.length > 0 && (
              <div className="space-y-1.5">
                <div className="font-mono text-[10px] font-black uppercase text-muted tracking-wider">
                  // Architecture Workflow Stages:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {project.caseStudy.architecture.map((arch, idx) => (
                    <div key={idx} className="bg-white p-2 border border-black/30 text-xs font-mono">
                      <span className="font-bold text-black">{arch.step}: {arch.title}</span>
                      <p className="text-[11px] text-gray-700 mt-0.5 leading-snug">{arch.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Verified Production Metrics */}
            {project.caseStudy.metrics && project.caseStudy.metrics.length > 0 && (
              <div className="pt-2 border-t border-black/15">
                <div className="font-mono text-[10px] font-black uppercase text-muted tracking-wider mb-1.5">
                  // Verified Production Metrics:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {project.caseStudy.metrics.map((m, idx) => (
                    <div key={idx} className="bg-white p-1.5 border border-black/30 text-center font-mono">
                      <div className="text-[10px] text-muted font-bold truncate">{m.label}</div>
                      <div className="text-xs font-black text-black truncate">{m.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Button Row */}
        <div className="mt-auto pt-4 border-t-2 border-black/15 flex flex-wrap gap-2 items-center">
          {/* Live Demo */}
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 font-mono text-xs sm:text-sm font-black px-3 sm:px-4 py-2 sm:py-2.5
                bg-black text-white border-2 border-black
                shadow-neo-sm hover:bg-white hover:text-black
                active:translate-x-0.5 active:translate-y-0.5 active:shadow-none
                transition-all duration-150"
            >
              <span>Live Demo</span>
              <ExternalLink size={14} />
            </a>
          )}

          {/* Deep-Dive Case Study */}
          {project.caseStudy && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onCaseStudy(project);
              }}
              className="inline-flex items-center gap-1.5 font-mono text-xs sm:text-sm font-black px-3 sm:px-3.5 py-2 sm:py-2.5
                bg-white text-black border-2 border-black
                shadow-neo-sm hover:bg-neo-yellow hover:text-black
                active:translate-x-0.5 active:translate-y-0.5 active:shadow-none
                transition-all duration-150"
            >
              <span>Case Study</span>
              <ArrowRight size={14} />
            </button>
          )}

          {/* GitHub Repo */}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold px-2.5 sm:px-3 py-2 sm:py-2.5
                bg-canvas text-black border-2 border-black
                hover:bg-white hover:shadow-neo-sm
                active:translate-x-0.5 active:translate-y-0.5 active:shadow-none
                transition-all duration-150 ml-auto"
              title="View Source on GitHub"
            >
              <Github size={14} />
              <span className="hidden sm:inline">Source</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProjectCard);