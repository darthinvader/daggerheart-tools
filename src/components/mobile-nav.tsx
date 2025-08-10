import { clsx } from 'clsx';
import { Home, UserPlus, Users } from 'lucide-react';

import type { ReactNode } from 'react';
import * as React from 'react';

import { createPortal } from 'react-dom';

import { Link, useRouter } from '@tanstack/react-router';

import { generateId } from '@/lib/utils';
import { watchSoftKeyboard } from '@/utils/mobile';

type NavItem = {
  to: string;
  label: string;
  icon: (props: { className?: string }) => ReactNode;
};

type MobileNavBarProps = {
  items?: NavItem[];
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
  addLabel = 'New Character',
}: MobileNavBarProps) {
  const router = useRouter();
  const [hideForKeyboard, setHideForKeyboard] = React.useState(false);

  React.useEffect(() => watchSoftKeyboard(setHideForKeyboard), []);

  if (hideForKeyboard) return null;
  // Exactly two items around a center FAB
  const left = items[0] ?? defaultItems[0];
  const right = items[1] ?? defaultItems[1];

  const content = (
    <nav
      aria-label="Primary"
      className="bg-card/90 supports-[backdrop-filter]:bg-card/60 fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur sm:hidden"
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
          <button
            type="button"
            onClick={() => {
              const id = generateId();
              // Navigate directly to the new character route and replace history
              router.navigate({
                to: '/characters/$id',
                params: { id },
                replace: true,
              });
            }}
            aria-label={addLabel}
            title={addLabel}
            className="bg-primary text-primary-foreground pointer-events-auto inline-flex h-14 w-14 items-center justify-center rounded-full border shadow-lg ring-1 shadow-black/20 ring-black/5"
          >
            <UserPlus className="h-6 w-6 text-white" strokeWidth={2.25} />
          </button>
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
