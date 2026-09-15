import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { NavSection } from '../types';
import { PERSONAL_INFO } from '../constants';
import { Sparkles, Terminal, ArrowUpRight, FileText } from 'lucide-react';

interface AboutProps {
  scrollToSection?: (id: NavSection) => void;
}

/**
 * About Section — MAJD-style 3-column composition.
 *
 * Characteristics:
 * - Center card is NOT always visible: It starts hidden (opacity: 0)
 *   and transitions in as the morphing hero card lands into this slot.
 * - Left column ("HEY!" + bio) slides in from the left on scroll.
 * - Right column (Narrative bio + Origin Story + CTA) slides in from the right.
 * - Interactive 3D mouse tilt is active when hovering on the card.
 */
const About: React.FC<AboutProps> = ({ scrollToSection }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Scroll tracking as About section approaches and centers in viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start center'],
  });

  // Center card: Hidden initially, fades in & docks as Hero card completes its morph
  const centerOpacity = useTransform(scrollYProgress, [0.35, 0.85], [0, 1]);
  const centerScale = useTransform(scrollYProgress, [0.35, 0.85], [0.92, 1]);

  // Side columns slide in as About enters view
  const leftX = useTransform(scrollYProgress, [0.20, 0.75], [-60, 0]);
  const leftOpacity = useTransform(scrollYProgress, [0.20, 0.70], [0, 1]);

  const rightX = useTransform(scrollYProgress, [0.25, 0.80], [60, 0]);
  const rightOpacity = useTransform(scrollYProgress, [0.25, 0.75], [0, 1]);

  const headerOpacity = useTransform(scrollYProgress, [0.10, 0.50], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0.10, 0.50], [30, 0]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x: x * 16, y: -y * 16 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <section
      ref={sectionRef}
      id={NavSection.ABOUT}
      className="scroll-mt-20 py-20 md:py-28 relative z-10 bg-transparent"
    >
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        {/* Section Header */}
        <motion.div style={{ opacity: headerOpacity, y: headerY }} className="mb-12 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-neo-yellow border-2 border-black font-mono text-xs font-bold uppercase tracking-wider mb-3 shadow-neo-sm">
            <Terminal size={13} />
            <span>Background &amp; Philosophy</span>
          </div>
          <h2 className="font-sans text-4xl sm:text-5xl md:text-6xl font-black text-ink uppercase tracking-tight leading-none">
            About Me
          </h2>
          <p className="font-mono text-sm sm:text-base text-gray-700 max-w-2xl mt-3 leading-relaxed">
            Architecting deterministic, production-hardened machine learning systems and
            high-throughput web applications.
          </p>
        </motion.div>

        {/* ── 3-Column Composition ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-start">
          {/* ── Left: Greeting & Identity ── */}
          <motion.div
            style={{ x: leftX, opacity: leftOpacity }}
            className="lg:col-span-4 flex flex-col justify-between h-full space-y-6"
          >
            <div>
              <h3 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-black text-ink tracking-tight mb-4 uppercase">
                Hey!
              </h3>
              <p className="font-mono text-sm sm:text-base text-gray-800 leading-relaxed">
                I'm Sujal — an AI/ML Engineer and builder specialising in
                fine-tuned LLM architectures, real-time inference pipelines, and resilient
                full-stack systems.
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

          {/* ── Center: Profile Card — Not always visible, fades in on transition ── */}
          <div className="lg:col-span-4 flex justify-center items-start py-4">
            <motion.div
              style={{
                opacity: centerOpacity,
                scale: centerScale,
                perspective: 1200,
              }}
              className="w-full max-w-[340px]"
            >
              <motion.div
                style={{
                  rotateY: isHovered ? mousePos.x : 0,
                  rotateX: isHovered ? mousePos.y : 0,
                  transformStyle: 'preserve-3d',
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative group bg-white border-4 border-black shadow-neo-lg overflow-hidden flex flex-col boundary-plate transition-shadow duration-300 hover:shadow-[8px_8px_0px_0px_#000]"
                data-boundary="true"
              >
                {/* Photo */}
                <div className="relative aspect-[4/5] overflow-hidden bg-black">
                  <img
                    src="/profile-pic-4.webp"
                    alt="Sujal Sanjay Chhajed"
                    className="w-full h-full object-cover object-top filter grayscale contrast-115 group-hover:filter-none group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 pointer-events-none" />
                </div>
                {/* Info strip */}
                <div className="p-3.5 bg-black text-white border-t-2 border-black font-mono text-xs flex items-center justify-between shrink-0">
                  <span className="font-bold uppercase tracking-wider text-white">Sujal Chhajed</span>
                  <span className="text-neo-yellow text-xs font-bold">AI/ML Engineer</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* ── Right: Narrative Bio, Origin Story & CTA ── */}
          <motion.div
            style={{ x: rightX, opacity: rightOpacity }}
            className="lg:col-span-4 flex flex-col justify-between h-full space-y-6"
          >
            <div className="space-y-4 font-mono text-sm leading-relaxed text-ink">
              <p className="font-bold text-base text-black leading-snug">
                I care about verified inference latency, mathematical constraint satisfaction,
                and writing clean, deterministic code that runs reliably in production
                environments.
              </p>
              <p className="text-gray-700 leading-relaxed text-xs sm:text-sm">
                From fine-tuning open-source LLM weights (Phi-4, Llama 3.1) and compiling to
                GGUF, to designing two-stage recommendation engines with XGBoost and crafting
                offline-first PWA sync protocols, I focus on the bridge between machine learning
                research and real software product.
              </p>
            </div>

            {/* Origin Story */}
            <div className="p-4 bg-neo-yellow/15 border-2 border-black shadow-neo-sm">
              <div className="flex items-start gap-2.5">
                <Sparkles size={16} className="text-neo-pink shrink-0 mt-0.5" />
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

            {/* CTA */}
            {scrollToSection && (
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => scrollToSection(NavSection.PROJECTS)}
                  className="inline-flex items-center gap-2 font-mono font-bold text-xs sm:text-sm px-5 py-2.5 bg-white text-black border-2 border-black shadow-neo-sm hover:bg-neo-yellow hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo transition-all group cursor-pointer"
                >
                  <span>Explore Projects</span>
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>

                <a
                  href={PERSONAL_INFO.resumeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono font-bold text-xs sm:text-sm px-4 py-2.5 bg-neo-yellow text-black border-2 border-black shadow-neo-sm hover:bg-white hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo transition-all"
                >
                  <FileText size={14} />
                  <span>RESUME ↗</span>
                </a>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(About);
