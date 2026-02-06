import { Monitor, Moon, Sun } from 'lucide-react';

import { type Theme, useTheme } from '@/components/providers/theme';

import { Button } from './button';

const themeOrder: Theme[] = ['light', 'dark', 'system'];

const themeIcon: Record<Theme, React.ReactNode> = {
  light: <Sun className="size-4" />,
  dark: <Moon className="size-4" />,
  system: <Monitor className="size-4" />,
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      aria-label={`Current theme: ${theme}`}
    >
      {themeIcon[theme]}
    </Button>
  );
}
