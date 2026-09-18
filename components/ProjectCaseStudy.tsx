import React, { useState } from 'react';
import { ExternalLink, Github, Zap, BookOpen, Bug } from 'lucide-react';
import { Project } from '../types';

// Per-project "bugs / hard debugging moments" — engineering authenticity section
const BUG_STORIES: Record<number, { title: string; story: string; lesson: string }> = {
  1: {
    title: 'The Constraint Validator That Lied for 3 Hours',
    story: 'The DLRM was happily recommending phones that had been discontinued or were never available in India. The validator was checking the product ID against the wrong catalogue version — a stale in-memory snapshot cached at import time, not the live filtered set.',
    lesson: 'Caching at module-import time is silent death. Validate against the live filtered dataset, not a snapshot taken before your ingestion pipeline ran.',
  },
  2: {
    title: 'SSE Streaming Vanished After 30 Seconds',
    story: 'MetaGen\'s token streaming would silently die on Vercel after exactly 30 seconds. No error, no exception — the stream just ended mid-generation. Took 6 hours to find: Vercel\'s serverless function timeout was silently killing the SSE connection. Had to switch to edge runtime + response-streaming mode.',
    lesson: 'Always test streaming at the infrastructure layer, not just locally. Platform-level timeouts are invisible in development.',
  },
  3: {
    title: 'Offline-First LWW Sync That Corrupted Watchlists',
    story: 'After a network reconnect, users would see duplicate entries or rolled-back updates. The Last-Write-Wins timestamp comparison was using the local device clock — which drifted by up to 3 seconds on some Android devices. Server timestamps solved it in one line.',
    lesson: 'Client clocks lie. Always use server-authoritative timestamps for conflict resolution in distributed sync protocols.',
  },
  4: {
    title: 'Isolation Forest Flagging Everyone on Day 1',
    story: 'The unsupervised anomaly model was flagging 40% of students as anomalous in the first 10 minutes of an exam. The issue: students hadn\'t established a "normal" typing rhythm baseline yet. The isolation forest needs a warm-up window before its outlier scores stabilize.',
    lesson: 'Unsupervised anomaly detection needs a calibration window. Apply anomaly scoring only after sufficient baseline samples are collected.',
  },
  5: {
    title: 'Prophet Seasonality Made Everything Worse',
    story: 'Adding a weekly seasonality component to Prophet caused prediction accuracy to tank for intraday stock data. It was overfitting to day-of-week noise that wasn\'t actually meaningful for financial prediction at hourly granularity.',
    lesson: 'More model components ≠ better. Ablation studies on time-series components are non-negotiable before shipping forecast models.',
  },
  6: {
    title: 'GitHub Actions Cache Serving Stale Predictions',
    story: 'The automated pipeline was serving week-old predictions after a gameweek reset because GitHub\'s action cache wasn\'t busted when the underlying data files changed. Added a cache key based on a hash of the ingestion timestamp.',
    lesson: 'Cache keys must incorporate data freshness signals, not just tool versions. Stale ML predictions are worse than no predictions.',
  },
  7: {
    title: 'DBSCAN Clustering Everything into One Cluster',
    story: 'epsilon was set to 0.3 — reasonable for normalized float embeddings. But after the MiniLM-L12 encoder, the 384-dim space had very different density. Everything within epsilon was in the same cluster. The fix was to calibrate epsilon empirically with a kNN distance elbow curve.',
    lesson: 'Clustering hyperparameters (especially epsilon in DBSCAN) must be calibrated per embedding space — not carried over from tutorials on toy data.',
  },
  8: {
    title: 'CSS Grid Columns Collapsing on Safari iOS',
    story: 'The asymmetric magazine grid looked perfect on Chrome and Firefox. On Safari iOS, three columns collapsed to one because of a Safari-specific calc() rounding bug with percentage-based grid track widths. Fixed with explicit pixel-fallback tracks and a safari-specific grid template.',
    lesson: 'CSS Grid on Safari still has subtle layout bugs in 2024. Test with real Safari, not just desktop emulation.',
  },
};

interface ProjectCaseStudyProps {
  project: Project;
}

type ViewMode = 'tldr' | 'deepdive';

const ProjectCaseStudy: React.FC<ProjectCaseStudyProps> = ({ project }) => {
  const [mode, setMode] = useState<ViewMode>('tldr');
  const { caseStudy, accentColor } = project;
  const bugStory = BUG_STORIES[project.id];

  if (!caseStudy) {
    return (
      <div className="p-8 font-mono text-sm text-muted">
        No case study available for this project.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-y-auto bg-canvas">
      {/* Header strip */}
      <div
        className="flex-shrink-0 px-6 sm:px-8 py-5 border-b-2 border-black flex items-start gap-3 pr-16 bg-white"
        style={{ borderLeftColor: accentColor || '#FFDE59', borderLeftWidth: 6 }}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-black text-white">
              {project.category}
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

      {/* TL;DR / Deep-Dive toggle */}
      <div className="flex-shrink-0 flex border-b-2 border-black">
        <button
          onClick={() => setMode('tldr')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 font-mono text-xs font-black uppercase tracking-widest transition-colors border-r-2 border-black
            ${mode === 'tldr' ? 'bg-neo-yellow text-black' : 'bg-white hover:bg-neo-yellow/20 text-muted'}`}
        >
          <Zap size={13} />
          TL;DR
        </button>
        <button
          onClick={() => setMode('deepdive')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 font-mono text-xs font-black uppercase tracking-widest transition-colors
            ${mode === 'deepdive' ? 'bg-neo-yellow text-black' : 'bg-white hover:bg-neo-yellow/20 text-muted'}`}
        >
          <BookOpen size={13} />
          Engineering Deep-Dive
        </button>
      </div>

      {/* ── TL;DR MODE ─────────────────────────────────────────────────── */}
      {mode === 'tldr' && (
        <div className="flex-1 px-5 sm:px-8 py-6 space-y-5">
          {/* One-liner */}
          <div className="p-4 bg-white border-2 border-black shadow-neo-sm">
            <p className="font-mono text-xs font-black uppercase tracking-widest text-muted mb-1.5">What it does</p>
            <p className="font-mono text-sm text-black leading-relaxed">{project.description}</p>
          </div>

          {/* Key metric */}
          {project.primaryMetric && (
            <div
              className="p-4 bg-white border-2 border-black shadow-neo-sm flex items-center gap-3"
              style={{ borderLeftWidth: 5, borderLeftColor: accentColor }}
            >
              <Zap size={18} className="shrink-0 text-black" />
              <div>
                <p className="font-mono text-[10px] font-black uppercase tracking-widest text-muted">Key Metric</p>
                <p className="font-sans text-base font-black text-black">{project.primaryMetric}</p>
              </div>
            </div>
          )}

          {/* Metrics grid (compact) */}
          {caseStudy.metrics && caseStudy.metrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {caseStudy.metrics.map(m => (
                <div
                  key={m.label}
                  className="bg-white border-2 border-black p-3 shadow-[2px_2px_0px_0px_#000] text-center"
                  style={{ borderTopWidth: 4, borderTopColor: accentColor || '#FFDE59' }}
                >
                  <p className="font-sans text-sm font-black text-black break-words">{m.value}</p>
                  <p className="font-mono text-[10px] text-muted mt-0.5">{m.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Stack */}
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map(t => (
              <span key={t} className="font-mono text-[11px] font-bold px-2 py-0.5 bg-canvas border border-black shadow-[1px_1px_0px_0px_#000]">
                {t}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-2.5 pt-2 border-t-2 border-black/15">
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs font-bold px-4 py-2.5 bg-black text-white border-2 border-black shadow-neo-sm hover:bg-neo-yellow hover:text-black transition-all">
                <span>Live Demo</span><ExternalLink size={13} />
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs font-bold px-4 py-2.5 bg-white text-black border-2 border-black shadow-neo-sm hover:bg-gray-100 transition-all">
                <Github size={13} /><span>GitHub</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* ── ENGINEERING DEEP-DIVE MODE ──────────────────────────────────── */}
      {mode === 'deepdive' && (
        <div className="flex-1 px-5 sm:px-8 py-6 space-y-8">
          {/* Problem + Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-4 sm:p-5 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000]">
              <h3 className="font-mono text-[11px] font-black uppercase tracking-widest text-black mb-2.5 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-neo-pink inline-block" />The Problem
              </h3>
              <p className="font-mono text-xs sm:text-sm text-gray-800 leading-relaxed break-words">{caseStudy.problem}</p>
            </div>
            <div className="p-4 sm:p-5 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000]">
              <h3 className="font-mono text-[11px] font-black uppercase tracking-widest text-black mb-2.5 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-neo-green inline-block" />The Solution
              </h3>
              <p className="font-mono text-xs sm:text-sm text-gray-800 leading-relaxed break-words">{caseStudy.solution}</p>
            </div>
          </div>

          {/* Architecture pipeline */}
          {caseStudy.architecture && caseStudy.architecture.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-mono text-xs font-black uppercase tracking-widest text-black flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-neo-blue border border-black inline-block" />
                System Architecture &amp; Execution Pipeline
              </h3>
              <div className="space-y-3 bg-white border-2 border-black p-4 sm:p-5 shadow-[3px_3px_0px_0px_#000]">
                {caseStudy.architecture.map((step, i) => (
                  <div key={step.step} className="flex gap-3 sm:gap-4 items-start">
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
                    <div className="pb-3 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <span className="font-mono text-[10px] font-bold text-gray-500 uppercase">{step.step}</span>
                        <p className="font-sans text-xs sm:text-sm font-black text-black leading-tight">{step.title}</p>
                      </div>
                      <p className="font-mono text-[11px] sm:text-xs text-gray-700 leading-relaxed break-words">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metrics */}
          {caseStudy.metrics && caseStudy.metrics.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-mono text-xs font-black uppercase tracking-widest text-black flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-neo-yellow border border-black inline-block" />
                Production Metrics &amp; Validation
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {caseStudy.metrics.map(m => (
                  <div
                    key={m.label}
                    className="bg-white border-2 border-black p-3 shadow-[2px_2px_0px_0px_#000]"
                    style={{ borderTopColor: accentColor || '#FFDE59', borderTopWidth: 4 }}
                  >
                    <p className="font-sans text-sm font-black text-black break-words mb-1">{m.value}</p>
                    <p className="font-mono text-[10px] text-gray-600">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* The Bug That Cost Me section */}
          {bugStory && (
            <div className="space-y-3">
              <h3 className="font-mono text-xs font-black uppercase tracking-widest text-black flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-neo-red border border-black inline-block" />
                The Bug That Cost Me 6+ Hours
              </h3>
              <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b-2 border-black bg-neo-red/10">
                  <Bug size={14} className="text-black shrink-0" />
                  <span className="font-mono text-xs font-black text-black">{bugStory.title}</span>
                </div>
                <div className="p-4 space-y-3">
                  <p className="font-mono text-xs text-gray-800 leading-relaxed">{bugStory.story}</p>
                  <div className="border-l-4 border-neo-yellow pl-3 bg-neo-yellow/10 py-2 pr-2">
                    <p className="font-mono text-[10px] font-black text-black uppercase tracking-widest mb-0.5">Lesson Learned</p>
                    <p className="font-mono text-xs text-black leading-relaxed">{bugStory.lesson}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-2.5 pt-4 border-t-2 border-black/15">
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold px-4 py-2.5 bg-black text-white border-2 border-black shadow-neo-sm hover:bg-neo-yellow hover:text-black transition-all">
                <span>Live Demo</span><ExternalLink size={13} />
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold px-4 py-2.5 bg-white text-black border-2 border-black shadow-neo-sm hover:bg-gray-100 transition-all">
                <Github size={13} /><span>GitHub Repository</span>
              </a>
            )}
            {project.huggingFace && (
              <a href={project.huggingFace} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold px-4 py-2.5 bg-white text-black border-2 border-black shadow-neo-sm hover:bg-neo-blue hover:text-black transition-all">
                <span>Hugging Face Space ↗</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCaseStudy;