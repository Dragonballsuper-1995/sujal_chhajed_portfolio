import { useState, useEffect, useRef } from 'react';
import { NavSection } from '../types';

/**
 * Custom hook for tracking which section is currently visible in the viewport.
 * Uses IntersectionObserver to avoid layout thrashing on scroll.
 */
export const useScrollSpy = () => {
    const [activeSection, setActiveSection] = useState<NavSection>(NavSection.HERO);
    // Keep track of section visibility state
    const visibilityMap = useRef<Record<string, number>>({});

    useEffect(() => {
        const sections = Object.values(NavSection);

        // Initialize visibility map
        sections.forEach(section => {
            visibilityMap.current[section] = 0;
        });

        const handleIntersect = (entries: IntersectionObserverEntry[]) => {
            let maxVisibility = 0;
            let currentActive = activeSection;

            // Check if we are at the bottom of the page
            const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;

            if (isAtBottom) {
                setActiveSection(NavSection.CONTACT);
                return;
            }

            entries.forEach(entry => {
                visibilityMap.current[entry.target.id] = entry.intersectionRatio;
            });

            // Find the section with the highest visibility
            for (const section of sections) {
                const ratio = visibilityMap.current[section] || 0;
                if (ratio > maxVisibility) {
                    maxVisibility = ratio;
                    currentActive = section as NavSection;
                }
            }

            // Only update if we found a section with meaningful visibility
            // Otherwise keep the current active section
            if (maxVisibility > 0 && currentActive !== activeSection) {
                 setActiveSection(currentActive);
            }
        };

        // Create the observer with multiple thresholds to accurately track visibility
        const observer = new IntersectionObserver(handleIntersect, {
            root: null,
            // Track visibility at various percentages
            threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
            // Offset the margin to trigger section changes a bit earlier when scrolling down
            rootMargin: "-20% 0px -20% 0px"
        });

        // Observe all sections
        sections.forEach(sectionId => {
            const el = document.getElementById(sectionId);
            if (el) {
                observer.observe(el);
            }
        });

        // Add a scroll listener just for the bottom-of-page check
        // We use a simple debounce/throttle for this since we only care about the very bottom
        let timeoutId: number;
        const checkBottom = () => {
            if (timeoutId) {
                window.cancelAnimationFrame(timeoutId);
            }
            timeoutId = window.requestAnimationFrame(() => {
                const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
                if (isAtBottom) {
                    setActiveSection(NavSection.CONTACT);
                }
            });
        };

        window.addEventListener('scroll', checkBottom, { passive: true });

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', checkBottom);
            if (timeoutId) {
                window.cancelAnimationFrame(timeoutId);
            }
        };
    }, [activeSection]);

    return activeSection;
};

export default useScrollSpy;
