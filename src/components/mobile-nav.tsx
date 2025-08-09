import { clsx } from 'clsx';
import { Home, UserPlus, Users } from 'lucide-react';

import type { ReactNode } from 'react';
import * as React from 'react';

import { createPortal } from 'react-dom';

import { Link } from '@tanstack/react-router';

type NavItem = {
  to: string;
  label: string;
  icon: (props: { className?: string }) => ReactNode;
};

type MobileNavBarProps = {
  items?: NavItem[];
  addTo?: string;
  addLabel?: string;
};

const defaultItems: NavItem[] = [
  { to: '/', label: 'Home', icon: p => <Home className={p.className} /> },
  {
    to: '/characters',
    label: 'Characters',
    icon: p => <Users className={p.className} />,
  },
];

export function MobileNavBar({
  items = defaultItems,
  addTo = '/characters/new',
  addLabel = 'New Character',
}: MobileNavBarProps) {
  const [hideForKeyboard, setHideForKeyboard] = React.useState(false);

  React.useEffect(() => {
    // Heuristic: hide bar when soft keyboard is likely open
    const isEditable = (el: Element | null) =>
      !!el &&
      (el.matches('input, textarea, select, [contenteditable="true"]') ||
        (el as HTMLElement).isContentEditable);

    const onFocusChange = () => {
      setHideForKeyboard(isEditable(document.activeElement));
    };

    document.addEventListener('focusin', onFocusChange);
    document.addEventListener('focusout', onFocusChange);

    let initialVVH =
      typeof window !== 'undefined' && window.visualViewport
        ? window.visualViewport.height
        : 0;
    const onVVResize = () => {
      const vv: VisualViewport | null | undefined =
        typeof window !== 'undefined' ? window.visualViewport : undefined;
      if (!vv) return;
      if (!initialVVH) initialVVH = vv.height;
      // If the viewport height shrinks notably, assume keyboard is shown
      const shrunk = initialVVH - vv.height > 100;
      const focused = isEditable(document.activeElement);
      setHideForKeyboard(shrunk || focused);
    };
    window.visualViewport?.addEventListener('resize', onVVResize);

    return () => {
      document.removeEventListener('focusin', onFocusChange);
      document.removeEventListener('focusout', onFocusChange);
      window.visualViewport?.removeEventListener('resize', onVVResize);
    };
  }, []);

  if (hideForKeyboard) return null;
  // Exactly two items around a center FAB
  const left = items[0] ?? defaultItems[0];
  const right = items[1] ?? defaultItems[1];

  const content = (
    <nav
      aria-label="Primary"
      className="bg-card/90 supports-[backdrop-filter]:bg-card/60 fixed inset-x-0 bottom-0 z-[9999] border-t backdrop-blur sm:hidden"
      style={{ position: 'fixed', left: 0, right: 0, bottom: 0 }}
    >
      <div className="relative">
        {/* Grid rail: 3 columns with center reserved for FAB */}
        <div className="grid h-16 grid-cols-3 items-center px-6">
          <div className="h-full w-full">
            <Link
              to={left.to}
              className={clsx(
                'group text-muted-foreground [&.active]:text-primary inline-flex h-full w-full flex-col items-center justify-center gap-1 text-xs'
              )}
              activeProps={{ className: 'active' }}
              preload="intent"
            >
              {left.icon({ className: 'h-5 w-5' })}
              <span>{left.label}</span>
            </Link>
          </div>

          <div aria-hidden />

          <div className="h-full w-full">
            <Link
              to={right.to}
              className={clsx(
                'group text-muted-foreground [&.active]:text-primary inline-flex h-full w-full flex-col items-center justify-center gap-1 text-xs'
              )}
              activeProps={{ className: 'active' }}
              preload="intent"
            >
              {right.icon({ className: 'h-5 w-5' })}
              <span>{right.label}</span>
            </Link>
          </div>
        </div>

        {/* Floating center action with visible caption */}
        <div className="pointer-events-none absolute -top-5 left-1/2 flex -translate-x-1/2 flex-col items-center">
          <Link
            to={addTo}
            aria-label={addLabel}
            title={addLabel}
            className="bg-primary text-primary-foreground pointer-events-auto inline-flex h-14 w-14 items-center justify-center rounded-full border shadow-lg ring-1 shadow-black/20 ring-black/5"
            preload="intent"
          >
            <UserPlus className="h-6 w-6 text-white" strokeWidth={2.25} />
          </Link>
          <span className="text-primary mt-1 text-[11px] font-medium">
            {addLabel}
          </span>
        </div>

        {/* Safe area inset padding */}
        <div className="h-[max(env(safe-area-inset-bottom),0px)]" />
      </div>
    </nav>
  );

  // Ensure fixed positioning isn't affected by ancestor layout by portaling to body
  if (typeof document !== 'undefined' && document.body) {
    return createPortal(content, document.body);
  }
  return content;
}
