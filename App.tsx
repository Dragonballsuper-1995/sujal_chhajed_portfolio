
import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';

import ScrollToTopButton from './components/ScrollToTopButton';
import LoadingScreen from './components/LoadingScreen';
import ToastNotification from './components/ToastNotification';
import Header from './components/Header';
import HeroAboutStage from './components/HeroAboutStage';
import Skills from './components/Skills';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './components/ui/Sheet';
import BackgroundGrid from './components/BackgroundGrid';
import HeroShader from './components/HeroShader';
import DevToolsGreeting from './components/DevToolsGreeting';

// Lazy loaded components (not needed for initial visual render)
const ContactForm = lazy(() => import('./components/ContactForm'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));
const ProjectCaseStudy = lazy(() => import('./components/ProjectCaseStudy'));

import { useScrollSpy } from './hooks';
import { PERSONAL_INFO } from './constants';
import { NavSection, Project } from './types';
import { RecruiterProvider } from './context/RecruiterContext';

// Global scroll reveal hook
const useGlobalScrollReveal = (isLoaded: boolean) => {
  useEffect(() => {
    if (isLoaded) {
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
    }
  }, [isLoaded]);
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
  const [isLoading, setIsLoading] = useState(() => {
    // If arriving directly at a sub-path like /skills or /about, skip initial splash loader
    const initial = pathToSection(window.location.pathname);
    return !initial || initial === NavSection.HERO;
  });
  const [isLoaderMounted, setIsLoaderMounted] = useState(() => {
    const initial = pathToSection(window.location.pathname);
    return !initial || initial === NavSection.HERO;
  });
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCmdPaletteOpen, setIsCmdPaletteOpen] = useState(false);

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
      setIsLoading(false);
      setIsLoaderMounted(false);
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
  // Global keyboard listener for Ctrl+K/Cmd+K to open Command Palette
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCmdPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleAnimationFullyComplete = useCallback(() => {
    setIsLoaderMounted(false);
  }, []);

  useGlobalScrollReveal(!isLoading);

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

  // Body scroll lock for modal and loader
  useEffect(() => {
    const shouldLock = isChatOpen || isLoaderMounted || isCmdPaletteOpen;
    // Sheets handle their own scroll locking, so we check for others here
    if (shouldLock) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      // Reset scroll to top when loading screen is mounted
      if (isLoaderMounted) {
        window.scrollTo(0, 0);
      }
    } else if (!isContactOpen && !selectedProject) {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    return () => {
      // Cleanup logic handled mostly by components
    };
  }, [isChatOpen, isLoaderMounted, isCmdPaletteOpen, isContactOpen, selectedProject]);

  return (
    <>
      {isLoaderMounted && (
        <LoadingScreen
          onComplete={handleLoadingComplete}
          onAnimationFinished={handleAnimationFullyComplete}
          name={PERSONAL_INFO.name}
        />
      )}

      {/* Backdrop for Chat Modal */}
      {isChatOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 animate-[fadeIn_0.3s_ease-out]"
          onClick={() => setIsChatOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <main className="min-h-svh flex flex-col font-sans bg-canvas text-ink relative">
        {/* DevTools Console Greeting (invisible, fires once on mount) */}
        <DevToolsGreeting />

        {/* Global Ambient Pastel WebGL Shader */}
        <HeroShader />

        {/* Persistent Canvas Interactive Dot Grid */}
        <BackgroundGrid />

        <Header
          activeSection={activeSection}
          scrollToSection={scrollToSection}
          openCommandPalette={() => setIsCmdPaletteOpen(true)}
        />

        <HeroAboutStage scrollToSection={scrollToSection} />
        <Skills />
        <ProjectsSection onProjectClick={handleProjectClick} />

        <ContactSection
          copyToClipboard={copyToClipboard}
        />

        <Footer scrollToSection={scrollToSection} />

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

        {/* Project Case Study Sheet (Feature #5 Implementation) */}
        <Sheet open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
          <SheetContent className="w-full sm:max-w-3xl p-0 border-l border-ink overflow-y-auto">
            {selectedProject && (
              <Suspense fallback={<div className="flex items-center justify-center h-full p-10"><span className="animate-pulse">Loading project details...</span></div>}>
                <ProjectCaseStudy project={selectedProject} />
              </Suspense>
            )}
          </SheetContent>
        </Sheet>

        {isCmdPaletteOpen && (
          <Suspense fallback={null}>
            <CommandPalette
              scrollToSection={scrollToSection}
              setIsContactOpen={setIsContactOpen}
              setIsChatOpen={setIsChatOpen}
              isOpen={isCmdPaletteOpen}
              setIsOpen={setIsCmdPaletteOpen}
            />
          </Suspense>
        )}

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
