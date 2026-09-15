import React, { useState } from 'react';
import { Menu, X, FileText } from 'lucide-react';
import { NavSection } from '../types';
import { PERSONAL_INFO } from '../constants';

interface HeaderProps {
  activeSection: NavSection;
  scrollToSection: (id: NavSection) => void;
  openCommandPalette: () => void;
}

const NAV_LINKS: { label: string; section: NavSection }[] = [
  { label: 'Home',     section: NavSection.HERO },
  { label: 'About',    section: NavSection.ABOUT },
  { label: 'Skills',   section: NavSection.SKILLS },
  { label: 'Projects', section: NavSection.PROJECTS },
  { label: 'Contact',  section: NavSection.CONTACT },
];

const Header: React.FC<HeaderProps> = ({ activeSection, scrollToSection }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (e: React.MouseEvent, section: NavSection) => {
    e.preventDefault();
    scrollToSection(section);
    setMobileOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 z-50 w-full bg-canvas/95 backdrop-blur-sm border-b-2 border-black h-16 transition-colors">
        <nav className="max-w-6xl mx-auto px-5 md:px-8 h-full flex items-center justify-between">

          {/* Logo with logo-light.svg */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(NavSection.HERO);
            }}
            aria-label="Back to top"
            className="flex items-center gap-3 group focus:outline-none cursor-pointer"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
              <img
                src="/logo-light.svg"
                alt="Sujal Chhajed Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-sans text-lg sm:text-xl font-black text-black uppercase tracking-tight group-hover:text-neo-pink transition-colors">
              Sujal Chhajed<span className="text-neo-pink">.</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-5">
            {NAV_LINKS.map(({ label, section }) => (
              <a
                key={section}
                href={section === NavSection.HERO ? '/' : `/${section}`}
                onClick={(e) => handleNav(e, section)}
                className={`font-mono text-xs uppercase font-bold tracking-wider transition-all duration-100 py-1
                  ${activeSection === section
                    ? 'text-black border-b-2 border-neo-pink -translate-y-0.5'
                    : 'text-muted hover:text-black'
                  }`}
              >
                {label}
              </a>
            ))}

            <a
              href={PERSONAL_INFO.resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 inline-flex items-center gap-1.5 font-mono text-xs font-bold px-3.5 py-1.5
                bg-neo-yellow text-black border-2 border-black
                shadow-neo-sm hover:bg-neo-green hover:shadow-neo
                active:translate-x-0.5 active:translate-y-0.5 active:shadow-none
                transition-all duration-150"
            >
              <FileText size={13} />
              <span>Resume ↗</span>
            </a>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2.5">
            <button
              onClick={() => setMobileOpen(prev => !prev)}
              aria-label="Toggle menu"
              className="p-1.5 border-2 border-black bg-neo-yellow text-black shadow-neo-sm"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="fixed top-16 inset-x-0 z-40 bg-canvas border-b-4 border-black shadow-neo animate-fadeIn md:hidden">
          <div className="flex flex-col px-5 py-5 gap-2">
            {NAV_LINKS.map(({ label, section }) => (
              <a
                key={section}
                href={section === NavSection.HERO ? '/' : `/${section}`}
                onClick={(e) => handleNav(e, section)}
                className={`text-left font-mono text-sm font-bold uppercase py-2.5 border-b border-black/10 flex items-center justify-between
                  ${activeSection === section ? 'text-neo-pink font-black' : 'text-black'}`}
              >
                <span>{label}</span>
                <span>➔</span>
              </a>
            ))}
            <a
              href={PERSONAL_INFO.resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="mt-3 font-mono text-xs font-bold uppercase py-3 px-4 bg-neo-yellow text-black border-2 border-black text-center shadow-neo-sm"
            >
              View Full Resume (PDF) ↗
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(Header);
