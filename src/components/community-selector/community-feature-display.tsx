import { Slash, Zap } from 'lucide-react';

import { FeatureIcon } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import { ICON_SIZE_MD } from '@/lib/icons';
import type { CommunityFeature } from '@/lib/schemas/identity';
import { cn } from '@/lib/utils';

import { getCommunityColors } from './community-config';

interface CommunityFeatureDisplayProps {
  feature: CommunityFeature;
  communityName?: string;
  className?: string;
  /** Whether this feature's bonuses are activated */
  isActivated?: boolean;
  /** Callback when the activate/deactivate button is clicked */
  onToggleActivated?: () => void;
}

export function CommunityFeatureDisplay({
  feature,
  communityName,
  className,
  isActivated = true,
  onToggleActivated,
}: CommunityFeatureDisplayProps) {
  const colors = communityName
    ? getCommunityColors(communityName)
    : {
        border: 'border-emerald-200 dark:border-emerald-800',
        bg: 'bg-emerald-50 dark:bg-emerald-950/30',
        text: 'text-emerald-700 dark:text-emerald-400',
        accent: 'text-emerald-900 dark:text-emerald-200',
      };

  return (
    <div
      className={cn(
        'group relative rounded-lg border p-4',
        colors.border,
        colors.bg,
        className
      )}
    >
      {/* Activate/Deactivate button */}
      {onToggleActivated && (
        <div className="absolute top-2 right-2">
          <SmartTooltip
            content={isActivated ? 'Deactivate bonuses' : 'Activate bonuses'}
          >
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'size-6',
                isActivated
                  ? 'text-amber-600 hover:text-amber-700'
                  : 'text-muted-foreground'
              )}
              aria-pressed={isActivated}
              onClick={e => {
                e.stopPropagation();
                onToggleActivated();
              }}
            >
              {isActivated ? (
                <Zap size={ICON_SIZE_MD} />
              ) : (
                <Slash size={ICON_SIZE_MD} />
              )}
            </Button>
          </SmartTooltip>
        </div>
      )}

      <h4
        className={cn(
          'mb-2 flex items-center gap-2 font-semibold',
          colors.text
        )}
      >
        <FeatureIcon />
        {feature.name}
      </h4>
      <p className={cn('text-sm', colors.accent)}>{feature.description}</p>
    </div>
  );
}
