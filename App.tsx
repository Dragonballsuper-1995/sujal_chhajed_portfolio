
import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { Send } from 'lucide-react';

import CustomCursor from './components/CustomCursor';
import BackgroundGrid from './components/BackgroundGrid';
import ScrollToTopButton from './components/ScrollToTopButton';
import LoadingScreen from './components/LoadingScreen';
import ToastNotification from './components/ToastNotification';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import MobileNavBar from './components/MobileNavBar';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './components/ui/Sheet';

// Lazy loaded components (not needed for initial visual render)
const ChatAssistant = lazy(() => import('./components/ChatAssistant'));
const ContactForm = lazy(() => import('./components/ContactForm'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));
const ProjectCaseStudy = lazy(() => import('./components/ProjectCaseStudy'));

import { useTheme, useScrollSpy } from './hooks';
import { PERSONAL_INFO } from './constants';
import { NavSection, Project } from './types';

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


const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaderMounted, setIsLoaderMounted] = useState(true);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCmdPaletteOpen, setIsCmdPaletteOpen] = useState(false);

  // Sheet state for Project Case Study
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Custom hooks for theme and scroll spy
  const { theme, toggleTheme } = useTheme();
  const activeSection = useScrollSpy();
  const [toast, setToast] = useState({ message: '', visible: false, type: 'success' as 'success' | 'error' });

  // Force scroll to top on page load/refresh - override browser's scroll restoration
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

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

  // Preload images optimized: Defer to idle time to prioritize FCP
  useEffect(() => {
    const preloadImages = () => {
      const imageUrls = [
        '/logo-light.svg',
        '/logo-dark.svg',
        '/profile-pic-4.webp'
      ];
      imageUrls.forEach(url => { (new Image()).src = url; });
    };

    // Use requestIdleCallback if available, otherwise fallback to timeout
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(preloadImages);
    } else {
      setTimeout(preloadImages, 2000);
    }
  }, []);

  useGlobalScrollReveal(!isLoading);

  // Theme and scroll spy logic now handled by custom hooks

  const scrollToSection = useCallback((id: NavSection) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

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

      {/* Main content is instantly ready at opacity-100; the LoadingScreen grid will block reveal it */}
      <main className="min-h-svh flex flex-col font-sans bg-neo-white dark:bg-neo-dark-bg text-neo-black dark:text-neo-dark-text relative">
        <CustomCursor highContrast={isChatOpen && theme === 'light'} />
        <BackgroundGrid theme={theme} />

        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          activeSection={activeSection}
          scrollToSection={scrollToSection}
          openCommandPalette={() => setIsCmdPaletteOpen(true)}
        />

        <Hero scrollToSection={scrollToSection} />
        <About />
        <Skills />

        {/* Pass click handler and theme to ProjectsSection */}
        <ProjectsSection onProjectClick={handleProjectClick} theme={theme} />

        <ContactSection
          setIsContactOpen={setIsContactOpen}
          copyToClipboard={copyToClipboard}
        />

        {/* Spacer for mobile navbar - only before footer */}
        <div className="pb-20 md:pb-0" />

        <Footer scrollToSection={scrollToSection} />

        {/* Contact Sheet */}
        <Sheet open={isContactOpen} onOpenChange={setIsContactOpen}>
          <SheetContent className="w-full sm:max-w-xl p-0 border-l-4 border-black dark:border-neo-dark-border">
            <SheetHeader className="p-4 border-b-4 border-black dark:border-neo-dark-border bg-neo-yellow text-black">
              <SheetTitle className="flex items-center gap-2">
                <Send size={20} /> New Message
              </SheetTitle>
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
          <SheetContent className="w-full sm:max-w-3xl p-0 border-l-4 border-black dark:border-neo-dark-border">
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
              theme={theme}
              toggleTheme={toggleTheme}
              scrollToSection={scrollToSection}
              setIsContactOpen={setIsContactOpen}
              setIsChatOpen={setIsChatOpen}
              isOpen={isCmdPaletteOpen}
              setIsOpen={setIsCmdPaletteOpen}
            />
          </Suspense>
        )}

        <ScrollToTopButton />

        <Suspense fallback={null}>
          <ChatAssistant isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
        </Suspense>

        {/* New Mobile Bottom Navigation */}
        <MobileNavBar
          activeSection={activeSection}
          scrollToSection={scrollToSection}
          openCommandPalette={() => setIsCmdPaletteOpen(true)}
        />

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

export default App;
