import { Star, Zap } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { CLASS_BG_COLORS, CLASS_COLORS } from '@/lib/schemas/class-selection';
import type { SubclassFeature } from '@/lib/schemas/core';
import { cn } from '@/lib/utils';

export type UpgradeOption = {
  className: string;
  subclassName: string;
  feature: SubclassFeature;
  upgradeType: 'specialization' | 'mastery';
};

type UpgradeOptionCardProps = {
  option: UpgradeOption;
  isSelected: boolean;
  onSelect: () => void;
};

export function UpgradeOptionCard({
  option,
  isSelected,
  onSelect,
}: UpgradeOptionCardProps) {
  return (
    <div
      className={cn(
        'cursor-pointer rounded-lg border p-3 transition-colors',
        isSelected
          ? `border-2 ${CLASS_BG_COLORS[option.className] ?? 'border-primary bg-primary/10'}`
          : 'hover:bg-muted/50'
      )}
      onClick={onSelect}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className={cn('font-medium', CLASS_COLORS[option.className])}>
          {option.feature.name}
        </span>
        <Badge
          variant={option.upgradeType === 'mastery' ? 'default' : 'secondary'}
          className="gap-1"
        >
          {option.upgradeType === 'mastery' ? (
            <>
              <Star className="size-3" /> Mastery
            </>
          ) : (
            <>
              <Zap className="size-3" /> Specialization
            </>
          )}
        </Badge>
        {option.feature.level && (
          <Badge variant="outline">Level {option.feature.level}+</Badge>
        )}
      </div>
      <p className="text-muted-foreground mt-2 text-sm">
        {option.feature.description}
      </p>
    </div>
  );
}
