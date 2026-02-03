import { Slash, Zap } from 'lucide-react';

import { FeatureIcon, SecondaryFeatureIcon } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import { useCoarsePointer } from '@/hooks/use-coarse-pointer';
import { ICON_SIZE_MD } from '@/lib/icons';
import type { AncestryFeature } from '@/lib/schemas/identity';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  feature: AncestryFeature;
  variant: 'primary' | 'secondary';
  showLabel?: boolean;
  className?: string;
  /** Whether this feature's bonuses are activated */
  isActivated?: boolean;
  /** Callback when the activate/deactivate button is clicked */
  onToggleActivated?: () => void;
}

const VARIANT_STYLES = {
  primary: {
    container:
      'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30',
    heading: 'text-amber-700 dark:text-amber-400',
    text: 'text-amber-900 dark:text-amber-200',
    icon: FeatureIcon,
  },
  secondary: {
    container:
      'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30',
    heading: 'text-blue-700 dark:text-blue-400',
    text: 'text-blue-900 dark:text-blue-200',
    icon: SecondaryFeatureIcon,
  },
} as const;

export function FeatureCard({
  feature,
  variant,
  showLabel = true,
  className,
  isActivated = true,
  onToggleActivated,
}: FeatureCardProps) {
  const styles = VARIANT_STYLES[variant];
  const Icon = styles.icon;
  const label = variant === 'primary' ? 'Primary' : 'Secondary';
  const isCoarse = useCoarsePointer();

  return (
    <div
      className={cn(
        'group relative rounded-lg border p-4',
        styles.container,
        className
      )}
    >
      {/* Activate/Deactivate button */}
      {onToggleActivated && (
        <div
          className={cn(
            'absolute top-2 right-2 transition-opacity',
            isCoarse ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          )}
        >
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
          styles.heading
        )}
      >
        <Icon />
        {showLabel && `${label}: `}
        {feature.name}
      </h4>
      <p className={cn('text-sm', styles.text)}>{feature.description}</p>
    </div>
  );
}
