import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, FileText, Sparkles, Terminal, ArrowUpRight } from 'lucide-react';
import { NavSection } from '../types';
import { PERSONAL_INFO } from '../constants';

interface HeroAboutStageProps {
  scrollToSection: (id: NavSection) => void;
  openResumeModal?: () => void;
}

/**
 * HeroAboutStage
 *
 * Implements the MAJD reference portfolio 3D Scroll-Linked Profile Transition (Hero -> About):
 * - Exactly ONE profile card exists in the desktop DOM.
 * - In Hero state (top of page), the card sits at the bottom center of Hero (scaled down ~0.70).
 * - As the user scrolls through the pinned stage:
 *     1. Hero identity & CTAs slide upward and fade out.
 *     2. The profile card moves up into the exact vertical center of the viewport.
 *     3. The card rotates on the Y-axis (0° -> -55° -> 0°) and X-axis (0° -> 12° -> 0°) in 3D perspective.
 *     4. The card morphs/scales up to full size (1.0).
 *     5. About columns slide in dynamically: Left column ("Hey!" + bio) from the left, Right column (Bio + Origin Story + CTA) from the right, and the section header from above.
 *     6. The card settles into the center column of the 3-column About layout.
 *     7. Interactive 3D mouse tilt activates on hover once settled.
 * - On mobile (< 1024px), a responsive natural-flow layout is used to prevent viewport clipping.
 */
const HeroAboutStage: React.FC<HeroAboutStageProps> = ({ scrollToSection, openResumeModal }) => {
  const desktopTrackRef = useRef<HTMLDivElement>(null);
  // ── Desktop Scroll Animations ──────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: desktopTrackRef,
    offset: ['start start', 'end end'],
  });

  // Hero Content: visible at start, fades out & gently translates up
  const heroOpacity = useTransform(scrollYProgress, [0.0, 0.28], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0.0, 0.28], [0, -60]);

  // Profile Card: 3D Flip & Scale Morph (Hero -> About)
  // Initially placed so ~15-20% peeks above the viewport bottom.
  // On scroll, moves up smoothly to its centered place in the About section.
  const cardScale = useTransform(scrollYProgress, [0.08, 0.62], [0.70, 1.0]);
  const cardY = useTransform(scrollYProgress, (progress) => {
    const t = Math.min(1, Math.max(0, progress / 0.58));
    const factor = 1 - t;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
    // Pushes card down so top ~15-20% (~50-60px) is visible at bottom of screen
    const initialOffset = Math.max(340, vh * 0.5 + 5);
    return factor * initialOffset;
  });
  const cardRotateY = useTransform(scrollYProgress, [0.08, 0.62], [0, 180]);

  // About Section elements: enter cleanly as the card completes its flip
  const aboutHeaderOpacity = useTransform(scrollYProgress, [0.35, 0.65], [0, 1]);
  const aboutHeaderY = useTransform(scrollYProgress, [0.35, 0.65], [-25, 0]);

  const aboutLeftX = useTransform(scrollYProgress, [0.40, 0.72], [-70, 0]);
  const aboutLeftOpacity = useTransform(scrollYProgress, [0.40, 0.70], [0, 1]);

  const aboutRightX = useTransform(scrollYProgress, [0.42, 0.75], [70, 0]);
  const aboutRightOpacity = useTransform(scrollYProgress, [0.42, 0.72], [0, 1]);

  // Pointer event switches to prevent invisible layer blocking clicks
  const heroPointerEvents = useTransform(scrollYProgress, (v) => (v < 0.28 ? 'auto' : 'none'));
  const aboutPointerEvents = useTransform(scrollYProgress, (v) => (v > 0.35 ? 'auto' : 'none'));

  return (
    <div className="relative w-full">
      {/* Scroll Navigation Anchors & ScrollSpy Zones */}
      <div id={NavSection.HERO} className="absolute top-0 w-full h-[60vh] pointer-events-none" />
      <div id={NavSection.ABOUT} className="absolute top-[60vh] w-full h-[100vh] pointer-events-none" />

      {/* ══════════════════════════════════════════════════════════════════════
          DESKTOP VIEWPORT: Pinned 3D Scroll Stage (>= 1024px)
          ══════════════════════════════════════════════════════════════════════ */}
      <div
        ref={desktopTrackRef}
        className="hidden lg:block relative w-full h-[160vh]"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
          {/* ── 1. Hero Content Layer: Vertically Centered ── */}
          <motion.div
            style={{ opacity: heroOpacity, y: heroY, pointerEvents: heroPointerEvents }}
            className="absolute inset-x-0 inset-y-0 pt-16 pb-20 px-8 max-w-6xl mx-auto flex flex-col justify-center items-start z-30 pointer-events-auto"
          >
            {/* Availability Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-black shadow-neo-sm mb-3.5 select-none animate-fadeIn boundary-plate self-start"
              data-boundary="true"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-neo-green animate-pulse" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-black">
                Available for AI/ML &amp; Full-Stack Roles
              </span>
            </div>

            {/* Headline */}
            <div className="mb-3.5 w-full">
              <h1 className="font-sans text-7xl xl:text-8xl text-ink leading-[0.90] tracking-tight uppercase select-none font-black">
                Sujal Chhajed
              </h1>
              <p className="font-sans text-3xl xl:text-4xl text-ink font-black uppercase mt-1 leading-tight">
                Building AI That{' '}
                <span className="text-neo-pink underline decoration-4 underline-offset-8 decoration-black inline-block transform hover:-rotate-2 transition-transform">
                  Ships.
                </span>
              </p>
            </div>

            {/* Subtitle Plate */}
            <div
              className="max-w-xl mb-3.5 p-3.5 bg-white border-2 border-black shadow-neo-sm relative z-10 boundary-plate"
              data-boundary="true"
            >
              <p className="font-mono text-sm text-ink font-medium leading-relaxed mb-1">
                AI/ML Engineer &amp; Full-Stack Developer specializing in fine-tuned LLM
                architectures, real-time inference optimization, and resilient full-stack systems.
              </p>
              <div className="flex items-center gap-2 font-mono text-xs text-muted">
                <span className="w-2 h-2 rounded-full bg-neo-yellow border border-black inline-block" />
                <span>8+ Production Deployments • Sub-100ms Target Latency</span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap gap-2.5 items-center mb-3.5">
              <button
                type="button"
                onClick={() => scrollToSection(NavSection.PROJECTS)}
                className="inline-flex items-center gap-2 font-mono font-bold text-xs px-5 py-2.5
                  bg-neo-yellow text-black border-2 border-black
                  shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-lg
                  active:translate-x-1 active:translate-y-1 active:shadow-neo-press
                  transition-all duration-150 group cursor-pointer"
              >
                <span>Explore Projects</span>
                <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>

            {/* Feature Strip */}
            <div
              className="p-2.5 bg-white border-2 border-black shadow-neo-sm inline-flex items-center gap-x-4 font-mono text-xs text-ink relative z-10 boundary-plate self-start"
              data-boundary="true"
            >
              <span className="flex items-center gap-1.5 font-bold">
                <Sparkles size={13} className="text-neo-pink" /> 4 Fine-Tuned GGUF Models
              </span>
              <span className="text-black/30 font-bold">•</span>
              <span className="font-medium">100% Deterministic Constraint Grounding</span>
              <span className="text-black/30 font-bold">•</span>
              <span className="font-medium">Offline-First LWW Cross-Device Sync</span>
            </div>
          </motion.div>

          {/* ── 2. About Section & The Single Shared Profile Card ── */}
          <motion.div
            style={{ pointerEvents: aboutPointerEvents }}
            className="relative max-w-6xl mx-auto px-8 w-full z-20"
          >
            {/* About Section Header */}
            <motion.div
              style={{ opacity: aboutHeaderOpacity, y: aboutHeaderY, pointerEvents: aboutPointerEvents }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-neo-yellow border-2 border-black font-mono text-xs font-bold uppercase tracking-wider mb-2.5 shadow-neo-sm">
                <Terminal size={13} />
                <span>Background &amp; Philosophy</span>
              </div>
              <h2 className="font-sans text-5xl xl:text-6xl font-black text-ink uppercase tracking-tight leading-none">
                About Me
              </h2>
              <p className="font-mono text-sm text-gray-700 max-w-2xl mt-2 leading-relaxed">
                Architecting deterministic, production-hardened machine learning systems and
                high-throughput web applications.
              </p>
            </motion.div>

            {/* 3-Column Composition */}
            <div className="grid grid-cols-12 gap-6 items-center">
              {/* ── Left Column: Greeting & Identity ── */}
              <motion.div
                style={{ x: aboutLeftX, opacity: aboutLeftOpacity, pointerEvents: aboutPointerEvents }}
                className="col-span-4 flex flex-col justify-between space-y-6"
              >
                <div>
                  <h3 className="font-sans text-5xl xl:text-6xl font-black text-ink tracking-tight mb-3 uppercase">
                    Hey!
                  </h3>
                  <p className="font-mono text-sm text-gray-800 leading-relaxed">
                    I'm Sujal — an AI/ML Engineer and builder specialising in fine-tuned LLM
                    architectures, real-time inference pipelines, and resilient full-stack systems.
                  </p>
                </div>

                <div className="pt-4 border-t-2 border-black/15 font-mono text-xs text-gray-700 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-neo-green animate-pulse" />
                    <span className="font-bold text-black uppercase tracking-wider">VIT Chennai &apos;26</span>
                  </div>
                  <p className="text-gray-500 font-medium">
                    Undergraduate in Computer Science &amp; Engineering
                  </p>
                </div>
              </motion.div>

              {/* ── Center Column: THE ONLY PROFILE CARD (Scroll-Linked 3D Flip) ── */}
              <div className="col-span-4 flex justify-center items-center">
                <motion.div
                  style={{
                    scale: cardScale,
                    y: cardY,
                    rotateY: cardRotateY,
                    perspective: 1200,
                    transformStyle: 'preserve-3d',
                  }}
                  className="w-full max-w-[340px] aspect-[4/5] relative origin-center"
                >
                  {/* FRONT FACE: Grayscale (Hero State — Facing camera at 0deg) */}
                  <div
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(0deg)',
                    }}
                    className="absolute inset-0 bg-white border-4 border-black shadow-neo-lg overflow-hidden flex flex-col boundary-plate"
                    data-boundary="true"
                  >
                    {/* Photo */}
                    <div className="relative flex-1 overflow-hidden bg-black">
                      <img
                        src="/profile-pic-4.webp"
                        alt="Sujal Sanjay Chhajed"
                        className="w-full h-full object-cover object-top filter grayscale contrast-115"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 pointer-events-none" />
                      <div className="absolute top-3 right-3 px-2 py-0.5 bg-neo-yellow text-black border border-black font-mono text-[10px] font-bold uppercase shadow-sm">
                        AI/ML
                      </div>
                    </div>

                    {/* Bottom Info Bar */}
                    <div className="p-3.5 bg-black text-white border-t-2 border-black font-mono text-xs flex items-center justify-between shrink-0">
                      <span className="font-bold uppercase tracking-wider text-white">Sujal Chhajed</span>
                      <span className="text-neo-yellow text-xs font-bold">AI/ML Engineer</span>
                    </div>
                  </div>

                  {/* BACK FACE: Coloured (About State — Revealed after 180deg Flip) */}
                  <div
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                    className="absolute inset-0 bg-white border-4 border-black shadow-neo-lg overflow-hidden flex flex-col boundary-plate"
                    data-boundary="true"
                  >
                    {/* Photo */}
                    <div className="relative flex-1 overflow-hidden bg-black">
                      <img
                        src="/profile-pic-4.webp"
                        alt="Sujal Sanjay Chhajed"
                        className="w-full h-full object-cover object-top filter-none contrast-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-50 pointer-events-none" />
                      <div className="absolute top-3 right-3 px-2 py-0.5 bg-neo-green text-black border border-black font-mono text-[10px] font-bold uppercase shadow-sm">
                        AI/ML
                      </div>
                    </div>

                    {/* Bottom Info Bar */}
                    <div className="p-3.5 bg-black text-white border-t-2 border-black font-mono text-xs flex items-center justify-between shrink-0">
                      <span className="font-bold uppercase tracking-wider text-white">Sujal Chhajed</span>
                      <span className="text-neo-green text-xs font-bold">AI/ML Engineer</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* ── Right Column: Narrative Bio, Origin Story & CTA ── */}
              <motion.div
                style={{ x: aboutRightX, opacity: aboutRightOpacity, pointerEvents: aboutPointerEvents }}
                className="col-span-4 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3 font-mono text-xs xl:text-sm leading-relaxed text-ink">
                  <p className="font-bold text-sm text-black leading-snug">
                    I care about verified inference latency, mathematical constraint satisfaction,
                    and writing clean, deterministic code that runs reliably in production
                    environments.
                  </p>
                  <p className="text-gray-700 leading-relaxed text-xs">
                    From fine-tuning open-source LLM weights (Phi-4, Llama 3.1) and compiling to
                    GGUF, to designing two-stage recommendation engines with XGBoost and crafting
                    offline-first PWA sync protocols, I focus on the bridge between machine learning
                    research and real software product.
                  </p>
                </div>

                {/* Origin Story */}
                <div className="p-3.5 bg-neo-yellow/15 border-2 border-black shadow-neo-sm">
                  <div className="flex items-start gap-2.5">
                    <Sparkles size={15} className="text-neo-pink shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-mono text-[10px] font-black uppercase tracking-wider text-black bg-neo-yellow px-1.5 py-0.5 border border-black inline-block">
                        Origin Story
                      </span>
                      <p className="font-mono text-xs text-gray-800 leading-relaxed pt-0.5">
                        {PERSONAL_INFO.funFact}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons (Explore Projects + Resume) */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => scrollToSection(NavSection.PROJECTS)}
                    className="inline-flex items-center gap-2 font-mono font-bold text-xs px-5 py-2.5 bg-white text-black border-2 border-black shadow-neo-sm hover:bg-neo-yellow hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo transition-all group cursor-pointer"
                  >
                    <span>Explore Projects</span>
                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={openResumeModal}
                    className="inline-flex items-center gap-1.5 font-mono font-bold text-xs px-4 py-2.5 bg-neo-yellow text-black border-2 border-black shadow-neo-sm hover:bg-white hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo transition-all cursor-pointer"
                  >
                    <FileText size={13} />
                    <span>RESUME ↗</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          MOBILE / TABLET VIEWPORT: Responsive Natural Flow (< 1024px)
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="block lg:hidden w-full">
        {/* Mobile Hero */}
        <section className="pt-28 pb-16 px-5 max-w-xl mx-auto flex flex-col items-start">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-black shadow-neo-sm mb-4 select-none boundary-plate"
            data-boundary="true"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-neo-green animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-black">
              Available for AI/ML &amp; Full-Stack Roles
            </span>
          </div>

          <div className="mb-4 w-full">
            <h1 className="font-sans text-4xl sm:text-6xl text-ink leading-[0.90] tracking-tight uppercase select-none font-black">
              Sujal Chhajed
            </h1>
            <p className="font-sans text-xl sm:text-2xl text-ink font-black uppercase mt-1.5 leading-tight">
              Building AI That{' '}
              <span className="text-neo-pink underline decoration-4 underline-offset-8 decoration-black inline-block">
                Ships.
              </span>
            </p>
          </div>

          <div
            className="w-full mb-4 p-4 bg-white border-2 border-black shadow-neo-sm relative z-10 boundary-plate"
            data-boundary="true"
          >
            <p className="font-mono text-xs sm:text-sm text-ink font-medium leading-relaxed mb-2">
              AI/ML Engineer &amp; Full-Stack Developer specializing in fine-tuned LLM
              architectures, real-time inference optimization, and resilient full-stack systems.
            </p>
            <div className="flex items-center gap-2 font-mono text-[11px] text-muted">
              <span className="w-2 h-2 rounded-full bg-neo-yellow border border-black inline-block" />
              <span>8+ Production Deployments • Sub-100ms Target Latency</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 items-center mb-4 w-full">
            <button
              type="button"
              onClick={() => scrollToSection(NavSection.PROJECTS)}
              className="inline-flex items-center gap-2 font-mono font-bold text-xs px-5 py-2.5 bg-neo-yellow text-black border-2 border-black shadow-neo"
            >
              <span>Explore Projects</span>
              <ArrowDown size={14} />
            </button>
          </div>

          <div
            className="p-3 bg-white border-2 border-black shadow-neo-sm inline-flex flex-col gap-1 font-mono text-[11px] text-ink relative z-10 boundary-plate w-full mb-8"
            data-boundary="true"
          >
            <span className="flex items-center gap-1.5 font-bold">
              <Sparkles size={13} className="text-neo-pink" /> 4 Fine-Tuned GGUF Models
            </span>
            <span className="font-medium">• 100% Deterministic Constraint Grounding</span>
            <span className="font-medium">• Offline-First LWW Cross-Device Sync</span>
          </div>

          {/* Profile Card at bottom of Hero on mobile */}
          <div className="w-full flex justify-center pb-4">
            <div
              className="relative w-[280px] max-w-full bg-white border-4 border-black shadow-neo-lg overflow-hidden flex flex-col boundary-plate"
              data-boundary="true"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-black">
                <img
                  src="/profile-pic-4.webp"
                  alt="Sujal Sanjay Chhajed"
                  className="w-full h-full object-cover object-top filter grayscale contrast-115"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 pointer-events-none" />
                <div className="absolute top-3 right-3 px-2 py-0.5 bg-neo-yellow text-black border border-black font-mono text-[10px] font-bold uppercase shadow-sm">
                  AI/ML
                </div>
              </div>
              <div className="p-3 bg-black text-white border-t-2 border-black font-mono text-xs flex items-center justify-between shrink-0">
                <span className="font-bold uppercase tracking-wider text-white">Sujal Chhajed</span>
                <span className="text-neo-yellow text-xs font-bold">AI/ML Engineer</span>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile About */}
        <section className="py-16 px-5 max-w-xl mx-auto space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-neo-yellow border-2 border-black font-mono text-xs font-bold uppercase tracking-wider mb-3 shadow-neo-sm">
              <Terminal size={13} />
              <span>Background &amp; Philosophy</span>
            </div>
            <h2 className="font-sans text-4xl sm:text-5xl font-black text-ink uppercase tracking-tight leading-none">
              About Me
            </h2>
            <p className="font-mono text-xs sm:text-sm text-gray-700 max-w-2xl mt-2 leading-relaxed">
              Architecting deterministic, production-hardened machine learning systems and
              high-throughput web applications.
            </p>
          </div>

          <div>
            <h3 className="font-sans text-3xl sm:text-4xl font-black text-ink tracking-tight mb-3 uppercase">
              Hey!
            </h3>
            <p className="font-mono text-xs sm:text-sm text-gray-800 leading-relaxed">
              I'm Sujal — an AI/ML Engineer and builder specialising in fine-tuned LLM
              architectures, real-time inference pipelines, and resilient full-stack systems.
            </p>
            <div className="pt-3 mt-3 border-t-2 border-black/15 font-mono text-xs text-gray-700 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-neo-green animate-pulse" />
                <span className="font-bold text-black uppercase tracking-wider">VIT Chennai &apos;26</span>
              </div>
              <p className="text-gray-500 font-medium">Undergraduate in Computer Science &amp; Engineering</p>
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs text-ink leading-relaxed">
            <p className="font-bold text-sm text-black leading-snug">
              I care about verified inference latency, mathematical constraint satisfaction, and
              writing clean, deterministic code that runs reliably in production environments.
            </p>
            <p className="text-gray-700 leading-relaxed">
              From fine-tuning open-source LLM weights (Phi-4, Llama 3.1) and compiling to GGUF, to
              designing two-stage recommendation engines with XGBoost and crafting offline-first PWA
              sync protocols, I focus on the bridge between machine learning research and real
              software product.
            </p>
          </div>

          <div className="p-3.5 bg-neo-yellow/15 border-2 border-black shadow-neo-sm">
            <div className="flex items-start gap-2.5">
              <Sparkles size={15} className="text-neo-pink shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-mono text-[10px] font-black uppercase tracking-wider text-black bg-neo-yellow px-1.5 py-0.5 border border-black inline-block">
                  Origin Story
                </span>
                <p className="font-mono text-xs text-gray-800 leading-relaxed pt-0.5">
                  {PERSONAL_INFO.funFact}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => scrollToSection(NavSection.PROJECTS)}
              className="inline-flex items-center gap-2 font-mono font-bold text-xs px-5 py-2.5 bg-white text-black border-2 border-black shadow-neo"
            >
              <span>Explore Projects</span>
              <ArrowUpRight size={14} />
            </button>
            <button
              type="button"
              onClick={openResumeModal}
              className="inline-flex items-center gap-1.5 font-mono font-bold text-xs px-4 py-2.5 bg-neo-yellow text-black border-2 border-black shadow-neo cursor-pointer"
            >
              <FileText size={13} />
              <span>RESUME ↗</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default React.memo(HeroAboutStage);
