
import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';

import ScrollToTopButton from './components/ScrollToTopButton';
import ToastNotification from './components/ToastNotification';
import Header from './components/Header';
import HeroAboutStage from './components/HeroAboutStage';
import Skills from './components/Skills';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import ResumeModal from './components/ResumeModal';
import CustomCursor from './components/CustomCursor';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './components/ui/Sheet';
import BackgroundGrid from './components/BackgroundGrid';
import HeroShader from './components/HeroShader';
import DevToolsGreeting from './components/DevToolsGreeting';

// Lazy loaded components (not needed for initial visual render)
const ContactForm = lazy(() => import('./components/ContactForm'));
const ProjectCaseStudy = lazy(() => import('./components/ProjectCaseStudy'));

import { useScrollSpy } from './hooks';
import { NavSection, Project } from './types';
import { RecruiterProvider } from './context/RecruiterContext';

// Global scroll reveal hook
const useGlobalScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const timeoutId = setTimeout(() => {
      // Exclude project cards, as they have their own observer
      document.querySelectorAll('.reveal-on-scroll:not(section#projects .reveal-on-scroll)').forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, []);
};


const pathToSection = (path: string): NavSection | null => {
  const clean = path.replace(/^\/+|\/+$/g, '').toLowerCase();
  if (!clean || clean === 'home' || clean === 'hero') return NavSection.HERO;
  if (clean === 'about') return NavSection.ABOUT;
  if (clean === 'skills') return NavSection.SKILLS;
  if (clean === 'projects') return NavSection.PROJECTS;
  if (clean === 'contact') return NavSection.CONTACT;
  return null;
};

const sectionToPath = (section: NavSection): string => {
  if (section === NavSection.HERO) return '/';
  return `/${section}`;
};

const AppContent: React.FC = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  // Sheet state for Project Case Study
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Custom hook for scroll spy
  const activeSection = useScrollSpy();
  const [toast, setToast] = useState({ message: '', visible: false, type: 'success' as 'success' | 'error' });

  const scrollToSection = useCallback((id: NavSection, updateHistory = true) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
    if (updateHistory) {
      const targetPath = sectionToPath(id);
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ section: id }, '', targetPath);
      }
    }
  }, []);

  // On page load or refresh: if URL has a section path (/about, /skills), jump to it directly
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const initialSection = pathToSection(window.location.pathname);
    if (initialSection && initialSection !== NavSection.HERO) {
      // Allow DOM to settle before jumping
      const timer = setTimeout(() => {
        scrollToSection(initialSection, false);
      }, 60);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo(0, 0);
    }
  }, [scrollToSection]);

  // Handle browser back and forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const section = pathToSection(window.location.pathname);
      if (section) {
        scrollToSection(section, false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [scrollToSection]);

  useGlobalScrollReveal();

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, visible: true, type });
  }, []);

  const handleCloseToast = useCallback(() => {
    setToast(prev => ({ ...prev, visible: false }));
  }, []);

  const copyToClipboard = useCallback((text: string, type: string) => {
    navigator.clipboard.writeText(text);
    showToast(
      type.includes('email')
        ? "Email ID Copied!"
        : "Phone Copied!",
      'success'
    );
  }, [showToast]);

  const handleFormSuccess = useCallback(() => {
    setIsContactOpen(false);
  }, []);

  const handleFormError = useCallback((errorMessage: string) => {
    showToast(errorMessage, 'error');
  }, [showToast]);

  // Handle opening project details
  const handleProjectClick = useCallback((project: Project) => {
    setSelectedProject(project);
  }, []);

  // Body scroll lock for modals
  useEffect(() => {
    if (isContactOpen || selectedProject || isResumeOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }, [isContactOpen, selectedProject, isResumeOpen]);

  return (
    <>
      {/* Desktop Custom Crosshair & Ring Follower Cursor */}
      <CustomCursor />

      {/* Main content with smooth entrance animation */}
      <main className="min-h-svh flex flex-col font-sans bg-transparent text-ink relative animate-[fadeIn_0.5s_cubic-bezier(0.16,1,0.3,1)]">
        {/* DevTools Console Greeting (invisible, fires once on mount) */}
        <DevToolsGreeting />

        {/* Global Ambient Pastel WebGL Shader */}
        <HeroShader />

        {/* Persistent Canvas Interactive Dot Grid */}
        <BackgroundGrid />

        <Header
          activeSection={activeSection}
          scrollToSection={scrollToSection}
          openResumeModal={() => setIsResumeOpen(true)}
        />

        <HeroAboutStage
          scrollToSection={scrollToSection}
          openResumeModal={() => setIsResumeOpen(true)}
        />
        <Skills />
        <ProjectsSection onProjectClick={handleProjectClick} />

        <ContactSection
          copyToClipboard={copyToClipboard}
        />

        <Footer
          scrollToSection={scrollToSection}
          openResumeModal={() => setIsResumeOpen(true)}
        />

        {/* In-Portfolio Resume Modal/Sheet */}
        <ResumeModal
          isOpen={isResumeOpen}
          onClose={() => setIsResumeOpen(false)}
        />

        {/* Contact Sheet */}
        <Sheet open={isContactOpen} onOpenChange={setIsContactOpen}>
          <SheetContent className="w-full sm:max-w-xl p-0 border-l border-ink">
            <SheetHeader className="p-4 border-b border-ink bg-neo-yellow text-ink">
              <SheetTitle>New Message</SheetTitle>
            </SheetHeader>
            <div className="p-6 md:p-8 h-full overflow-y-auto pb-20">
              {isContactOpen && (
                <Suspense fallback={<div className="flex items-center justify-center h-full"><span className="animate-pulse">Loading form...</span></div>}>
                  <ContactForm
                    onSuccess={handleFormSuccess}
                    onError={handleFormError}
                  />
                </Suspense>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Project Case Study Sheet */}
        <Sheet open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
          <SheetContent className="w-full sm:max-w-3xl p-0 border-l border-ink overflow-y-auto">
            {selectedProject && (
              <Suspense fallback={<div className="flex items-center justify-center h-full p-10"><span className="animate-pulse">Loading project details...</span></div>}>
                <ProjectCaseStudy project={selectedProject} />
              </Suspense>
            )}
          </SheetContent>
        </Sheet>

        <ScrollToTopButton />

        <ToastNotification
          message={toast.message}
          isVisible={toast.visible}
          onClose={handleCloseToast}
          type={toast.type}
        />
      </main>
    </>
  );
};

const App: React.FC = () => {
  return (
    <RecruiterProvider>
      <AppContent />
    </RecruiterProvider>
  );
};

export default App;
