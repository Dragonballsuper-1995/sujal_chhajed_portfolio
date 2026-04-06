
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Section from './Section';
import ProjectCard from './ProjectCard';
import ProjectSkeleton from './ProjectSkeleton';
import { NavSection, Project } from '../types';
import { PROJECTS } from '../constants';
import { DecryptedText } from './ui/DecryptedText';
import ScrollAnimation from './ui/ScrollAnimation';

interface ProjectsSectionProps {
  onProjectClick: (project: Project) => void;
  theme: 'light' | 'dark';
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onProjectClick, theme }) => {
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [loadedProjects, setLoadedProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadedProjects(PROJECTS);
      setIsLoadingProjects(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const categories = useMemo(() => ['All', ...Array.from(new Set(PROJECTS.map(p => p.category)))], []);
  
  // Colors for categories
  const categoryColors = ['bg-neo-black', 'bg-neo-orange', 'bg-neo-pink', 'bg-neo-blue', 'bg-neo-green', 'bg-neo-purple'];
  const getCategoryColorClass = (index: number) => {
      const color = categoryColors[index % categoryColors.length];
      switch(color) {
          case 'bg-neo-black': return 'hover:!bg-neo-yellow hover:!text-black dark:hover:!bg-neo-yellow dark:hover:!text-black';
          case 'bg-neo-orange': return 'hover:!bg-neo-orange hover:!text-black dark:hover:!bg-neo-orange dark:hover:!text-black';
          case 'bg-neo-pink': return 'hover:!bg-neo-pink hover:!text-black dark:hover:!bg-neo-pink dark:hover:!text-black';
          case 'bg-neo-blue': return 'hover:!bg-neo-blue hover:!text-black dark:hover:!bg-neo-blue dark:hover:!text-black';
          case 'bg-neo-green': return 'hover:!bg-neo-green hover:!text-black dark:hover:!bg-neo-green dark:hover:!text-black';
          case 'bg-neo-purple': return 'hover:!bg-neo-purple hover:!text-white dark:hover:!bg-neo-purple dark:hover:!text-white';
          default: return 'hover:!bg-neo-yellow hover:!text-black dark:hover:!bg-neo-yellow dark:hover:!text-black';
      }
  };

  const filteredProjects = useMemo(() => loadedProjects.filter(project =>
    activeCategory === 'All' || project.category === activeCategory
  ), [loadedProjects, activeCategory]);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = scrollContainerRef.current;
      // Scroll by one card width (roughly 85vw + gap)
      const scrollAmount = window.innerWidth * 0.85 + 24; 
      const maxScroll = scrollWidth - clientWidth;
      
      let scrollTo;
      
      // Use a threshold for boundary detection to account for subpixel differences
      const threshold = 50;

      if (direction === 'left') {
        // If we are at the very beginning, wrap to the end
        if (scrollLeft <= threshold) {
          scrollTo = maxScroll;
        } else {
          scrollTo = Math.max(0, scrollLeft - scrollAmount);
        }
      } else {
        // If we are at the very end, wrap to the beginning
        if (scrollLeft >= maxScroll - threshold) {
          scrollTo = 0;
        } else {
          scrollTo = Math.min(maxScroll, scrollLeft + scrollAmount);
        }
      }
      
      scrollContainerRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Section id={NavSection.PROJECTS} className="overflow-hidden md:overflow-visible">
      <ScrollAnimation variant="blur" className="flex flex-col items-center mb-8">
        <h2 className="text-5xl md:text-6xl font-black uppercase mb-4 text-center dark:text-neo-dark-text">
          <DecryptedText text="Featured" /> <span className="text-neo-purple"><DecryptedText text="Works" /></span>
        </h2>
      </ScrollAnimation>
      
      {/* Categories Filter - Removed horizontal scroll, now wraps naturally */}
      <ScrollAnimation variant="fadeUp" delay={0.2} className="mb-12 px-4">
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 max-w-full">
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`
                px-4 md:px-6 py-2 font-mono font-bold border-2 border-black dark:border-neo-dark-border transition-all text-sm md:text-base uppercase tracking-wider whitespace-nowrap shrink-0
                ${activeCategory === category
                  ? 'bg-neo-black text-white dark:bg-neo-dark-border dark:text-neo-dark-bg shadow-[2px_2px_0px_0px_rgba(126,217,87,1)] translate-x-[2px] translate-y-[2px]'
                  : `bg-white dark:bg-neo-dark-surface text-black dark:text-neo-dark-text shadow-neo dark:shadow-neo-dark hover:-translate-y-1 hover:shadow-neo-lg dark:hover:shadow-neo-lg-dark ${getCategoryColorClass(index)}`
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>
      </ScrollAnimation>

      <div className="relative group/carousel">
        {/* Mobile Navigation Arrows - Repositioned to the sides */}
        <div className="md:hidden">
          <button 
            onClick={() => scrollCarousel('left')}
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-30 p-3 bg-neo-yellow border-4 border-black shadow-neo-sm active:translate-y-1 active:shadow-none transition-all"
            aria-label="Scroll Left"
          >
            <ChevronLeft size={24} strokeWidth={3} />
          </button>
          <button 
            onClick={() => scrollCarousel('right')}
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-30 p-3 bg-neo-green border-4 border-black shadow-neo-sm active:translate-y-1 active:shadow-none transition-all"
            aria-label="Scroll Right"
          >
            <ChevronRight size={24} strokeWidth={3} />
          </button>
        </div>

        <div 
          ref={scrollContainerRef}
          className={`
            md:grid md:grid-cols-2 md:gap-12 md:min-h-[600px] md:content-start
            flex flex-row overflow-x-auto overflow-y-hidden overscroll-x-contain snap-x snap-mandatory gap-6 px-8 pb-8 md:pb-0 md:px-0 scrollbar-hide
          `}
        >
          {isLoadingProjects ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="min-w-[85vw] md:min-w-0 snap-center h-full">
                 <ProjectSkeleton />
              </div>
            ))
          ) : (
            filteredProjects.map((project, index) => (
              <div key={project.id} className="min-w-[85vw] md:min-w-0 snap-center h-full">
                 <ScrollAnimation variant="fadeUp" delay={index * 0.1} className="h-full">
                    <ProjectCard project={project} onClick={onProjectClick} theme={theme} />
                 </ScrollAnimation>
              </div>
            ))
          )}
          {!isLoadingProjects && filteredProjects.length === 0 && (
            <ScrollAnimation variant="scale" className="col-span-1 md:col-span-2 text-center py-20 border-4 border-black dark:border-neo-dark-border bg-white dark:bg-neo-dark-surface shadow-neo dark:shadow-neo-dark w-full">
              <p className="font-mono text-xl mb-2">No projects found in this category.</p>
              <button
                onClick={() => setActiveCategory('All')}
                className="text-neo-purple underline font-bold hover:text-neo-pink"
              >
                View all projects
              </button>
            </ScrollAnimation>
          )}
        </div>
      </div>
    </Section>
  );
};

export default React.memo(ProjectsSection);
