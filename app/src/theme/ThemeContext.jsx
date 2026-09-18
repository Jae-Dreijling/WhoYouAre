import { createContext, useContext, useEffect, useMemo, useState } from 'react';

// Phase 0 placeholder color schemes — not real characters yet.
// These exist purely to prove the app can reskin itself from data.
// Phase 1 replaces this with the real character data model.
export const PLACEHOLDER_THEMES = [
  { id: 'sunset', name: 'Sunset', primary: '#6C4CE0', accent: '#FF8A5C' },
  { id: 'ocean', name: 'Ocean', primary: '#1E88E5', accent: '#00C2A8' },
  { id: 'berry', name: 'Berry', primary: '#E0468C', accent: '#FFC24C' },
];

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [activeThemeId, setActiveThemeId] = useState(PLACEHOLDER_THEMES[0].id);

  const activeTheme = useMemo(
    () => PLACEHOLDER_THEMES.find((t) => t.id === activeThemeId) ?? PLACEHOLDER_THEMES[0],
    [activeThemeId]
  );

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', activeTheme.primary);
    root.style.setProperty('--color-accent', activeTheme.accent);
  }, [activeTheme]);

  const value = useMemo(
    () => ({ themes: PLACEHOLDER_THEMES, activeTheme, setActiveThemeId }),
    [activeTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function usePersonaTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('usePersonaTheme must be used within a ThemeProvider');
  return ctx;
}
