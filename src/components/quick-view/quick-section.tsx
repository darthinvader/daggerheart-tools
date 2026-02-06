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
          className="quick-section-toggle"
          aria-expanded={isOpen}
        >
          <span>{label}</span>
          <ChevronDown className="quick-section-chevron" />
        </button>
      )}
      {isOpen && (
        <div className="animate-fade-up flex-1 *:h-full">{children}</div>
      )}
    </div>
  );
}
