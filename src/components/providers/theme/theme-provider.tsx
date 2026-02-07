import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  type AccentTheme,
  type Theme,
  ThemeProviderContext,
  type ThemeProviderState,
} from './theme-context';

const ACCENT_CLASSES = [
  'theme-parchment',
  'theme-crimson',
  'theme-arcane',
] as const;
const ACCENT_STORAGE_KEY = 'daggerheart-accent-theme';

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  const [accentTheme, setAccentThemeRaw] = useState<AccentTheme>(
    () => (localStorage.getItem(ACCENT_STORAGE_KEY) as AccentTheme) || 'classic'
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'system') {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      const apply = () => {
        root.classList.remove('light', 'dark');
        root.classList.add(mql.matches ? 'dark' : 'light');
      };
      apply();
      mql.addEventListener('change', apply);
      return () => mql.removeEventListener('change', apply);
    }
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(...ACCENT_CLASSES);
    if (accentTheme !== 'classic') {
      root.classList.add(`theme-${accentTheme}`);
    }
  }, [accentTheme]);

  const handleSetTheme = useCallback(
    (t: Theme) => {
      localStorage.setItem(storageKey, t);
      setTheme(t);
    },
    [storageKey]
  );

  const handleSetAccentTheme = useCallback((accent: AccentTheme) => {
    localStorage.setItem(ACCENT_STORAGE_KEY, accent);
    setAccentThemeRaw(accent);
  }, []);

  const value: ThemeProviderState = useMemo(
    () => ({
      theme,
      setTheme: handleSetTheme,
      accentTheme,
      setAccentTheme: handleSetAccentTheme,
    }),
    [theme, handleSetTheme, accentTheme, handleSetAccentTheme]
  );

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
