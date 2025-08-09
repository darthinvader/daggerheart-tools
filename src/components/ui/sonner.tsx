import type { ToasterProps } from 'sonner';
import { Toaster as SonnerToaster } from 'sonner';

import * as React from 'react';

function getCurrentTheme(): ToasterProps['theme'] {
  if (typeof document === 'undefined') return 'system';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

const Toaster = ({ ...props }: ToasterProps) => {
  const [theme, setTheme] =
    React.useState<ToasterProps['theme']>(getCurrentTheme());

  React.useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => setTheme(getCurrentTheme()));
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <SonnerToaster
      theme={theme}
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
