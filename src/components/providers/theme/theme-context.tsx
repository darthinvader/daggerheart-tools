import { createContext, useContext } from 'react';

export type Theme = 'dark' | 'light' | 'system';
export type AccentTheme = 'classic' | 'parchment' | 'crimson' | 'arcane';

export interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accentTheme: AccentTheme;
  setAccentTheme: (accent: AccentTheme) => void;
}

export const ThemeProviderContext = createContext<
  ThemeProviderState | undefined
>(undefined);

export function useTheme() {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
