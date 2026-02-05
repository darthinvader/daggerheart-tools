import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';

import type { QuickViewSections } from '@/lib/schemas/quick-view';
import { cn } from '@/lib/utils';

type QuickSectionKey = keyof QuickViewSections;

interface QuickSectionProps {
  id: QuickSectionKey;
  label: string;
  isOpen: boolean;
  isMobile: boolean;
  onToggle: (id: QuickSectionKey) => void;
  className?: string;
  children: ReactNode;
}

export function QuickSection({
  id,
  label,
  isOpen,
  isMobile,
  onToggle,
  className,
  children,
}: QuickSectionProps) {
  return (
    <div className={cn('flex flex-col space-y-1.5 sm:space-y-2', className)}>
      {isMobile && (
        <button
          type="button"
          onClick={() => onToggle(id)}
          className={cn(
            'flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-colors sm:px-3 sm:py-2 sm:text-sm',
            isOpen
              ? 'bg-primary/10 text-primary'
              : 'bg-muted/40 text-foreground hover:bg-muted/60'
          )}
          aria-expanded={isOpen}
        >
          <span>{label}</span>
          <ChevronDown
            className={cn(
              'h-3.5 w-3.5 transition-transform duration-200 sm:h-4 sm:w-4',
              !isOpen && '-rotate-90'
            )}
          />
        </button>
      )}
      {isOpen && (
        <div className="animate-in fade-in slide-in-from-top-1 flex-1 duration-200 *:h-full">
          {children}
        </div>
      )}
    </div>
  );
}
