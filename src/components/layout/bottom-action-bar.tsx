import * as React from 'react';

import { cn } from '@/lib/utils';

export type BottomActionBarProps = {
  children: React.ReactNode;
  className?: string;
  /**
   * If true, reserves space for the on-screen keyboard by applying sticky positioning
   * and safe-area padding. Leave false when used inside a Drawer that manages this.
   */
  sticky?: boolean;
};

export function BottomActionBar({
  children,
  className,
  sticky = true,
}: BottomActionBarProps) {
  return (
    <div
      className={cn(
        'bg-card/90 supports-[backdrop-filter]:bg-card/60 border-t backdrop-blur',
        sticky && 'sticky bottom-0',
        'px-4 py-3',
        'pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)]',
        className
      )}
      role="region"
      aria-label="Actions"
    >
      <div className="flex items-center justify-end gap-2">{children}</div>
    </div>
  );
}
