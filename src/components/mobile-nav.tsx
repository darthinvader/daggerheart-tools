import { clsx } from 'clsx';
import { Home, Plus, Users } from 'lucide-react';

import type { ReactNode } from 'react';

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
  addTo = '/characters/new/identity',
}: MobileNavBarProps) {
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

        {/* Floating center Add button */}
        <Link
          to={addTo}
          aria-label="Add new"
          className="bg-primary text-primary-foreground absolute -top-5 left-1/2 inline-flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border shadow-lg ring-1 shadow-black/20 ring-black/5"
          preload="intent"
        >
          <Plus className="h-6 w-6" />
        </Link>

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
