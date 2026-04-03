import { useState, useEffect } from 'react';
import { NavSection } from '../types';

/**
 * Custom hook for tracking which section is currently visible in the viewport.
 * Updates as user scrolls through the page.
 */
export const useScrollSpy = () => {
    const [activeSection, setActiveSection] = useState<NavSection>(NavSection.HERO);

    useEffect(() => {
        let ticking = false;
        const sections = Object.values(NavSection);

        const updateActiveSection = () => {
            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;
            const triggerPoint = scrollY + viewportHeight * 0.35;
            const docHeight = document.documentElement.scrollHeight;

            // If near bottom of page, always show CONTACT
            if (scrollY + viewportHeight >= docHeight - 100) {
                setActiveSection(NavSection.CONTACT);
                return;
            }

            // Check if we're past the contact section start
            const contactEl = document.getElementById(NavSection.CONTACT);
            if (contactEl && triggerPoint >= contactEl.offsetTop) {
                setActiveSection(NavSection.CONTACT);
                return;
            }

            let active = NavSection.HERO;

            for (const sectionId of sections) {
                const el = document.getElementById(sectionId);
                if (el) {
                    const top = el.offsetTop;
                    const height = el.offsetHeight;

                    if (triggerPoint >= top && triggerPoint < top + height) {
                        active = sectionId as NavSection;
                        break;
                    }
                }
            }

            setActiveSection(active);
        };

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateActiveSection();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        updateActiveSection();

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return activeSection;
};

export default useScrollSpy;
