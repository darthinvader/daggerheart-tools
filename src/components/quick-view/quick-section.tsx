import { ChevronDown, ChevronRight } from 'lucide-react';
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
    <div className={cn('flex flex-col space-y-2', className)}>
      {isMobile && (
        <button
          type="button"
          onClick={() => onToggle(id)}
          className="bg-muted/40 flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-semibold"
          aria-expanded={isOpen}
        >
          <span>{label}</span>
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      )}
      {isOpen && <div className="flex-1 *:h-full">{children}</div>}
    </div>
  );
}
