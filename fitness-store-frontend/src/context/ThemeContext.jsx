import { createContext, useContext, useEffect, useState } from 'react';

export const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * ThemeProvider - Manages dark/light mode theme
 * - Persists to localStorage (key: 'crunchfit-theme')
 * - Applies 'dark' class to document element for Tailwind dark: prefix
 * - Auto-detects system preference on first visit
 * - Handles theme toggles
 */
export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first
    const stored = localStorage.getItem('crunchfit-theme');
    if (stored !== null) {
      return stored === 'dark';
    }
    
    // Auto-detect system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    return false; // Default to light mode
  });

  // Apply theme to document element
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    
    // Persist to localStorage
    localStorage.setItem('crunchfit-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Listen to system theme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // Only auto-switch if user hasn't manually set theme
      if (localStorage.getItem('crunchfit-theme') === null) {
        setIsDark(e.matches);
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    
    // Legacy browsers
    if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  const toggleTheme = () => setIsDark(!isDark);
  const theme = isDark ? 'dark' : 'light';
  const setTheme = (nextTheme) => setIsDark(nextTheme === 'dark');

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
