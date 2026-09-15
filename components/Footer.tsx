import React from 'react';
import { ExternalLink, Github, Linkedin, Instagram } from 'lucide-react';
import { XIcon } from './XIcon';
import { NavSection } from '../types';
import { PERSONAL_INFO, SOCIALS } from '../constants';

interface FooterProps {
  scrollToSection: (id: NavSection) => void;
}

const getSocialIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'github':
      return <Github size={15} />;
    case 'linkedin':
      return <Linkedin size={15} />;
    case 'twitter':
    case 'x':
      return <XIcon size={14} />;
    case 'instagram':
      return <Instagram size={15} />;
    default:
      return <ExternalLink size={15} />;
  }
};

const getSocialColorClass = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'linkedin':
      return 'text-[#0077B5] hover:text-white border-[#0077B5]/60 hover:border-[#0077B5] bg-[#0077B5]/15 hover:bg-[#0077B5]';
    case 'github':
      return 'text-[#F0F6FC] hover:text-white border-white/20 hover:border-white/60 hover:bg-white/10';
    case 'twitter':
    case 'x':
      return 'text-white hover:text-gray-300 border-white/20 hover:border-white/60 hover:bg-white/10';
    case 'instagram':
      return 'text-[#E4405F] hover:text-[#FD1D1D] border-[#E4405F]/40 hover:border-[#E4405F] hover:bg-[#E4405F]/15';
    default:
      return 'text-gray-300 hover:text-white border-white/20 hover:border-white/60 hover:bg-white/10';
  }
};

const Footer: React.FC<FooterProps> = ({ scrollToSection }) => {
  return (
    <footer className="bg-[#0A0A10] text-white border-t-4 border-black relative overflow-hidden select-none">
      {/* ── Main Footer Architecture (Decluttered & Compact) ─────────── */}
      <div className="max-w-6xl mx-auto px-5 md:px-8 pt-10 sm:pt-12 pb-4 sm:pb-6 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-8 relative z-10">
        
        {/* Left: Eye-Catching Punchline (MAJD Inspiration) */}
        <div className="md:col-span-6 space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-black tracking-tight leading-[0.95] text-white uppercase">
            Engineering AI <br />
            <span className="text-neo-yellow">That Scales.</span>
          </h2>
          <p className="font-mono text-gray-400 text-xs sm:text-sm max-w-sm leading-relaxed">
            Deterministic inference optimization, fine-tuned LLM architectures, and resilient full-stack systems.
          </p>
        </div>

        {/* Center: /Quick links */}
        <div className="md:col-span-3 flex flex-col">
          <span className="font-mono text-xs uppercase font-bold text-gray-400 tracking-wider mb-3">
            /Quick links
          </span>
          <div className="flex flex-wrap gap-2 max-w-xs">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(NavSection.HERO);
              }}
              className="px-3 py-1 bg-white text-black font-mono text-xs font-bold uppercase rounded-lg hover:bg-neo-yellow transition-colors shadow-sm cursor-pointer"
            >
              Home
            </a>
            <a
              href="/about"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(NavSection.ABOUT);
              }}
              className="px-3 py-1 bg-white text-black font-mono text-xs font-bold uppercase rounded-lg hover:bg-neo-green transition-colors shadow-sm cursor-pointer"
            >
              About Me
            </a>
            <a
              href="/skills"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(NavSection.SKILLS);
              }}
              className="px-3 py-1 bg-white text-black font-mono text-xs font-bold uppercase rounded-lg hover:bg-neo-blue transition-colors shadow-sm cursor-pointer"
            >
              Skills
            </a>
            <a
              href="/projects"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(NavSection.PROJECTS);
              }}
              className="px-3 py-1 bg-white text-black font-mono text-xs font-bold uppercase rounded-lg hover:bg-neo-yellow transition-colors shadow-sm cursor-pointer"
            >
              Projects
            </a>
            <a
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(NavSection.CONTACT);
              }}
              className="px-3 py-1 bg-white text-black font-mono text-xs font-bold uppercase rounded-lg hover:bg-neo-pink transition-colors shadow-sm cursor-pointer"
            >
              Contact
            </a>
            <a
              href={PERSONAL_INFO.resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-neo-yellow text-black font-mono text-xs font-bold uppercase rounded-lg hover:bg-white transition-colors shadow-sm inline-flex items-center gap-1"
            >
              <span>Resume</span>
              <ExternalLink size={11} />
            </a>
          </div>
        </div>

        {/* Right: /Contact & Networks */}
        <div className="md:col-span-3 flex flex-col">
          <span className="font-mono text-xs uppercase font-bold text-gray-400 tracking-wider mb-3">
            /Contact
          </span>
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            className="font-mono text-xs sm:text-sm text-gray-300 hover:text-neo-yellow transition-colors break-all mb-3"
          >
            {PERSONAL_INFO.email}
          </a>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            {SOCIALS.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg border transition-all duration-150 flex items-center justify-center ${getSocialColorClass(social.platform)}`}
                title={social.platform}
              >
                {getSocialIcon(social.platform)}
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* ── Architectural Name Watermark (Subtly Cropped at Base) ── */}
      <div
        className="w-full overflow-hidden pointer-events-none select-none z-0 flex justify-center items-end relative -mb-4 sm:-mb-6 md:-mb-8"
        aria-hidden="true"
      >
        <span className="font-sans font-black text-[22vw] leading-[0.72] tracking-tighter uppercase text-white/[0.08] whitespace-nowrap block select-none translate-y-[6%]">
          SUJAL
        </span>
      </div>

      {/* ── Bottom Copyright Strip ───────────────────────────────────────── */}
      <div className="border-t border-white/10 bg-[#0A0A10] py-5 relative z-10">
        <div className="max-w-6xl mx-auto px-5 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Sujal Sanjay Chhajed • Built with React 18 & Vite</p>
          <p className="text-gray-400 font-bold">Chennai, India • Available Globally</p>
        </div>
      </div>

      <style>{`
        .stroke-text {
          -webkit-text-stroke: 1.5px #FAFAFA;
        }
      `}</style>
    </footer>
  );
};

export default React.memo(Footer);
