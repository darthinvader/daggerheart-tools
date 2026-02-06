import { Crown, Flame, Sprout, Sword } from 'lucide-react';

import type { ProgressionState } from '@/components/shared/progression-display';
import { cn } from '@/lib/utils';

interface QuickLevelBadgeProps {
  progression: ProgressionState;
  className?: string;
}

const TIER_LABELS: Record<string, string> = {
  '1': 'Novice',
  '2-4': 'Adventurer',
  '5-7': 'Veteran',
  '8-10': 'Legend',
};

const TIER_ICONS: Record<string, React.ElementType> = {
  '1': Sprout,
  '2-4': Sword,
  '5-7': Flame,
  '8-10': Crown,
};

/**
 * Compact level & tier badge shown in the hero section.
 */
export function QuickLevelBadge({
  progression,
  className,
}: QuickLevelBadgeProps) {
  const TierIcon = TIER_ICONS[progression.currentTier] ?? Sword;
  const tierLabel = TIER_LABELS[progression.currentTier] ?? '';

  return (
    <div className={cn('quick-level-badge', className)}>
      <TierIcon className="quick-level-badge-icon" />
      <span className="quick-level-badge-level">
        Lv {progression.currentLevel}
      </span>
      <span className="quick-level-badge-divider">·</span>
      <span className="quick-level-badge-tier">{tierLabel}</span>
    </div>
  );
}
