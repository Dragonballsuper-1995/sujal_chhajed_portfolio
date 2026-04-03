import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

/**
 * Custom hook for managing theme state with localStorage persistence.
 * Defaults to light mode if no saved preference exists.
 */
export const useTheme = () => {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme');
            if (saved === 'dark' || saved === 'light') {
                // Apply immediately on initial load to avoid flash
                document.documentElement.classList.toggle('dark', saved === 'dark');
                return saved;
            }
        }
        return 'light';
    });

    const toggleTheme = useCallback(() => {
        setTheme(prev => {
            const newTheme = prev === 'light' ? 'dark' : 'light';
            // Update DOM and local storage directly here rather than waiting for useEffect
            // This prevents a render-cycle delay before the CSS actually updates
            localStorage.setItem('theme', newTheme);
            document.documentElement.classList.toggle('dark', newTheme === 'dark');
            return newTheme;
        });
    }, []);

    // Effect just to ensure it's synced if changed externally, though mostly handled by toggleTheme now
    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    return { theme, setTheme, toggleTheme };
};

export default useTheme;
