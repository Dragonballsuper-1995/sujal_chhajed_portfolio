import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';
import { NavSection } from '../types';

interface HeroProps {
  scrollToSection: (id: NavSection) => void;
}

/**
 * Hero Section — Single Column Neo-Brutalist Layout
 *
 * Features:
 * - Full-width single column identity & mission display.
 * - Availability badge, subtitle plate, action CTAs, feature strip.
 * - At the bottom center of Hero: The Profile Card.
 * - As the user scrolls down towards About:
 *     - The card executes a 3D perspective rotation (rotateY: 0° -> -45° -> 0°).
 *     - The card morphs / scales up from 0.70 (~238px) to 1.0 (~340px).
 *     - The card translates downward towards the About center slot.
 *     - Hands off smoothly to the About center card as it lands.
 */
const Hero: React.FC<HeroProps> = ({ scrollToSection }) => {
  const heroRef = useRef<HTMLElement>(null);

  // Track scroll through the Hero section
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Text parallaxes up slightly on scroll
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -80]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0.2]);

  // Card 3D scroll morph transition (Hero -> About)
  const cardScale = useTransform(scrollYProgress, [0.05, 0.65], [0.70, 1.0]);
  const cardRotateY = useTransform(scrollYProgress, [0.05, 0.35, 0.65], [0, -45, 0]);
  const cardRotateX = useTransform(scrollYProgress, [0.05, 0.35, 0.65], [0, 10, 0]);
  const cardY = useTransform(scrollYProgress, [0.05, 0.65], [0, 120]);
  const cardOpacity = useTransform(scrollYProgress, [0.60, 0.72], [1, 0]);

  return (
    <section
      ref={heroRef}
      id={NavSection.HERO}
      className="relative bg-transparent pt-28 sm:pt-24 pb-16 overflow-visible"
    >
      <div className="max-w-6xl mx-auto px-5 md:px-8 w-full flex flex-col items-start">
        {/* ── Text Content Block ─────────────────────────────────── */}
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="flex flex-col items-start w-full"
        >
          {/* Availability Badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-black shadow-neo-sm mb-4 select-none animate-fadeIn boundary-plate self-start"
            data-boundary="true"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-neo-green animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-black">
              Available for AI/ML &amp; Full-Stack Roles
            </span>
          </div>

          {/* Identity & Mission Headline — Full Width Display */}
          <div className="mb-4 w-full">
            <h1 className="font-sans text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-ink leading-[0.90] tracking-tight uppercase select-none font-black">
              Sujal Chhajed
            </h1>
            <p className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl text-ink font-black uppercase mt-1.5 leading-tight">
              Building AI That{' '}
              <span className="text-neo-pink underline decoration-4 underline-offset-8 decoration-black inline-block transform hover:-rotate-2 transition-transform">
                Ships.
              </span>
            </p>
          </div>

          {/* Technical Scope Subtitle Box */}
          <div
            className="max-w-xl mb-4 p-3.5 sm:p-4 bg-white border-2 border-black shadow-neo-sm relative z-10 boundary-plate self-start"
            data-boundary="true"
          >
            <p className="font-mono text-xs sm:text-sm text-ink font-medium leading-relaxed mb-2">
              AI/ML Engineer &amp; Full-Stack Developer specializing in fine-tuned LLM architectures,
              real-time inference optimization, and resilient full-stack systems.
            </p>
            <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs text-muted">
              <span className="w-2 h-2 rounded-full bg-neo-yellow border border-black inline-block" />
              <span>8+ Production Deployments • Sub-100ms Target Latency</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-2.5 sm:gap-3 items-center mb-4">
            <button
              onClick={() => scrollToSection(NavSection.PROJECTS)}
              className="inline-flex items-center gap-2 font-mono font-bold text-xs sm:text-sm px-5 py-2.5
                bg-neo-yellow text-black border-2 border-black
                shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-lg
                active:translate-x-1 active:translate-y-1 active:shadow-neo-press
                transition-all duration-150 group"
            >
              <span>Explore Projects</span>
              <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Feature Strip */}
          <div
            className="p-2.5 sm:p-3 bg-white border-2 border-black shadow-neo-sm inline-flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] sm:text-xs text-ink relative z-10 boundary-plate self-start"
            data-boundary="true"
          >
            <span className="flex items-center gap-1.5 font-bold">
              <Sparkles size={13} className="text-neo-pink" /> 4 Fine-Tuned GGUF Models
            </span>
            <span className="hidden sm:inline text-black/30 font-bold">•</span>
            <span className="font-medium">100% Deterministic Constraint Grounding</span>
            <span className="hidden sm:inline text-black/30 font-bold">•</span>
            <span className="font-medium">Offline-First LWW Cross-Device Sync</span>
          </div>
        </motion.div>

        {/* ── Profile Card at Bottom of Hero (Scroll-Linked 3D Morph) ── */}
        <div className="w-full flex justify-center mt-8 pb-4 overflow-visible">
          <motion.div
            style={{
              scale: cardScale,
              rotateY: cardRotateY,
              rotateX: cardRotateX,
              y: cardY,
              opacity: cardOpacity,
              perspective: 1200,
              transformStyle: 'preserve-3d',
            }}
            className="w-[340px] max-w-[85vw] origin-top"
          >
            <div
              className="relative group bg-white border-4 border-black shadow-neo-lg overflow-hidden flex flex-col boundary-plate transition-shadow duration-300 hover:shadow-[8px_8px_0px_0px_#000]"
              data-boundary="true"
            >
              {/* Photo Container */}
              <div className="relative aspect-[4/5] overflow-hidden bg-black">
                <img
                  src="/profile-pic-4.webp"
                  alt="Sujal Sanjay Chhajed"
                  className="w-full h-full object-cover object-top filter grayscale contrast-115 group-hover:filter-none group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 pointer-events-none" />
                <div className="absolute top-3 right-3 px-2 py-0.5 bg-neo-yellow text-black border border-black font-mono text-[10px] font-bold uppercase shadow-sm">
                  AI/ML
                </div>
              </div>

              {/* Bottom Bar Info Strip */}
              <div className="p-3.5 bg-black text-white border-t-2 border-black font-mono text-xs flex items-center justify-between shrink-0">
                <span className="font-bold uppercase tracking-wider text-white">Sujal Chhajed</span>
                <span className="text-neo-yellow text-xs font-bold">AI/ML Engineer</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(Hero);
