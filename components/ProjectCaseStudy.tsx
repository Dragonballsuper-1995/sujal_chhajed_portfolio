import React from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { Project } from '../types';

interface ProjectCaseStudyProps {
  project: Project;
}

const ProjectCaseStudy: React.FC<ProjectCaseStudyProps> = ({ project }) => {
  const { caseStudy, accentColor } = project;

  if (!caseStudy) {
    return (
      <div className="p-8 font-mono text-sm text-muted">
        No case study available for this project.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-y-auto bg-canvas">
      {/* Header strip with space reserved for close button */}
      <div
        className="flex-shrink-0 px-6 sm:px-8 py-5 border-b-2 border-black flex items-center gap-3 pr-16 bg-white"
        style={{ borderLeftColor: accentColor || '#FFDE59', borderLeftWidth: 6 }}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-black text-white">
              {project.category}
            </span>
            <span className="font-mono text-[11px] font-bold text-gray-500 uppercase tracking-wide">
              Engineering Deep Dive
            </span>
          </div>
          <h2 className="font-sans text-xl sm:text-2xl md:text-3xl font-black text-black leading-tight uppercase tracking-tight break-words">
            {project.title}
          </h2>
          {project.tagline && (
            <p className="font-mono text-xs sm:text-sm font-semibold text-gray-700 mt-1 leading-snug break-words">
              {project.tagline}
            </p>
          )}
        </div>
      </div>

      <div className="flex-1 px-5 sm:px-8 py-6 sm:py-8 space-y-8 sm:space-y-10">

        {/* Problem + Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          <div className="p-4 sm:p-5 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000]">
            <h3 className="font-mono text-[11px] font-black uppercase tracking-widest text-black mb-2.5 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-neo-pink inline-block" />
              The Problem
            </h3>
            <p className="font-mono text-xs sm:text-sm text-gray-800 leading-relaxed break-words">
              {caseStudy.problem}
            </p>
          </div>
          <div className="p-4 sm:p-5 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000]">
            <h3 className="font-mono text-[11px] font-black uppercase tracking-widest text-black mb-2.5 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-neo-green inline-block" />
              The Solution
            </h3>
            <p className="font-mono text-xs sm:text-sm text-gray-800 leading-relaxed break-words">
              {caseStudy.solution}
            </p>
          </div>
        </div>

        {/* Metrics — responsive grid */}
        {caseStudy.metrics && caseStudy.metrics.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-mono text-xs font-black uppercase tracking-widest text-black flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-neo-yellow border border-black inline-block" />
              Production Metrics & Validation
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
              {caseStudy.metrics.map((m) => (
                <div
                  key={m.label}
                  className="bg-white border-2 border-black p-3 sm:p-3.5 shadow-[2px_2px_0px_0px_#000] flex flex-col justify-between"
                  style={{ borderTopColor: accentColor || '#FFDE59', borderTopWidth: 4 }}
                >
                  <p className="font-sans text-sm sm:text-base font-black text-black leading-tight break-words mb-1">
                    {m.value}
                  </p>
                  <p className="font-mono text-[10px] sm:text-[11px] font-semibold text-gray-600 leading-tight">
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Architecture pipeline */}
        {caseStudy.architecture && caseStudy.architecture.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-mono text-xs font-black uppercase tracking-widest text-black flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-neo-blue border border-black inline-block" />
              System Architecture & Execution Pipeline
            </h3>
            <div className="space-y-3 bg-white border-2 border-black p-4 sm:p-5 shadow-[3px_3px_0px_0px_#000]">
              {caseStudy.architecture.map((step, i) => (
                <div key={step.step} className="flex gap-3 sm:gap-4 items-start">
                  {/* Step indicator */}
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div
                      className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center border-2 border-black font-mono text-[11px] sm:text-xs font-black"
                      style={{ backgroundColor: i === 0 ? (accentColor || '#FFDE59') : '#FFFFFF' }}
                    >
                      {i + 1}
                    </div>
                    {i < caseStudy.architecture!.length - 1 && (
                      <div className="w-0.5 flex-1 bg-black/20 mt-1 min-h-[22px]" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-3 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className="font-mono text-[10px] font-bold text-gray-500 uppercase">
                        {step.step}
                      </span>
                      <p className="font-sans text-xs sm:text-sm font-black text-black leading-tight">
                        {step.title}
                      </p>
                    </div>
                    <p className="font-mono text-[11px] sm:text-xs text-gray-700 leading-relaxed break-words">
                      {step.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        <div className="flex flex-wrap gap-2.5 pt-4 border-t-2 border-black/15">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold px-4 py-2.5 bg-black text-white border-2 border-black
                shadow-neo-sm hover:bg-neo-yellow hover:text-black hover:shadow-neo
                active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <span>Live Demo</span>
              <ExternalLink size={13} />
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold px-4 py-2.5 bg-white text-black border-2 border-black
                shadow-neo-sm hover:bg-gray-100 hover:shadow-neo
                active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <Github size={13} />
              <span>GitHub Repository</span>
            </a>
          )}
          {project.huggingFace && (
            <a
              href={project.huggingFace}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold px-4 py-2.5 bg-white text-black border-2 border-black
                shadow-neo-sm hover:bg-neo-blue hover:text-black hover:shadow-neo
                active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <span>Hugging Face Space ↗</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCaseStudy;

