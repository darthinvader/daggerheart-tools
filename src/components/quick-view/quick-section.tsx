import {
  Activity,
  Backpack,
  ChevronDown,
  Coins,
  Dna,
  Home,
  Library,
  PawPrint,
  Scroll,
  Shield,
  Sword,
  Target,
  Zap,
} from 'lucide-react';
import type { ReactNode } from 'react';

import type { QuickViewSections } from '@/lib/schemas/quick-view';
import { cn } from '@/lib/utils';

type QuickSectionKey = keyof QuickViewSections;

const SECTION_ICONS: Record<string, React.ElementType> = {
  traits: Activity,
  vitals: Shield,
  coreScores: Target,
  combat: Target,
  thresholds: Zap,
  ancestry: Dna,
  community: Home,
  class: Sword,
  gold: Coins,
  conditions: Zap,
  companion: PawPrint,
  experiences: Library,
  equipment: Shield,
  loadout: Scroll,
  inventory: Backpack,
};

interface QuickSectionProps {
  id: QuickSectionKey;
  label: string;
  icon?: string;
  isOpen: boolean;
  isMobile: boolean;
  onToggle: (id: QuickSectionKey) => void;
  className?: string;
  children: ReactNode;
}

export function QuickSection({
  id,
  label,
  icon,
  isOpen,
  isMobile,
  onToggle,
  className,
  children,
}: QuickSectionProps) {
  const IconComponent = icon ? SECTION_ICONS[icon] : undefined;

  return (
    <div className={cn('quick-section', className)}>
      {isMobile && (
        <button
          type="button"
          onClick={() => onToggle(id)}
          className="quick-section-toggle"
          aria-expanded={isOpen}
        >
          <span className="quick-section-toggle-label">
            {IconComponent && (
              <IconComponent className="quick-section-toggle-icon" />
            )}
            <span>{label}</span>
          </span>
          <ChevronDown className="quick-section-chevron" />
        </button>
      )}
      {isOpen && <div className="quick-section-content">{children}</div>}
    </div>
  );
}
