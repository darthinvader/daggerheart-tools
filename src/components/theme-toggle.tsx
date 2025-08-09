import { Moon, Sun } from 'lucide-react';

import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const next = !root.classList.contains('dark');
    root.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    setDark(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="bg-background text-foreground hover:bg-muted ml-auto inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium"
    >
      {dark ? (
        <>
          <Sun size={16} /> Light
        </>
      ) : (
        <>
          <Moon size={16} /> Dark
        </>
      )}
    </button>
  );
}
