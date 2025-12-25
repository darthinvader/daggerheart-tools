import { SmartTooltip } from '@/components/ui/smart-tooltip';
import { cn } from '@/lib/utils';

import { ThresholdChip } from './threshold-chip';

interface ThresholdsDisplayProps {
  minor: number;
  severe: number;
  major?: number;
  showMajor?: boolean;
  className?: string;
}

export function ThresholdsDisplay({
  minor,
  severe,
  major,
  showMajor = false,
  className,
}: ThresholdsDisplayProps) {
  const effectiveMajor = major ?? severe * 2;
  const displayMajor = showMajor && effectiveMajor > 0;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        Thresholds
      </div>

      <div className="flex items-center gap-1">
        <SmartTooltip content="Damage below Minor threshold has no lasting effect.">
          <span className="text-muted-foreground bg-muted inline-flex size-6 cursor-help items-center justify-center rounded border font-mono text-xs">
            1
          </span>
        </SmartTooltip>

        <ThresholdChip kind="minor" value={minor} />

        <SmartTooltip content="Damage at or above Minor but below Severe.">
          <span className="text-muted-foreground bg-muted inline-flex size-6 cursor-help items-center justify-center rounded border font-mono text-xs">
            2
          </span>
        </SmartTooltip>

        <ThresholdChip kind="severe" value={severe} />

        <SmartTooltip
          content={
            displayMajor
              ? 'Damage at or above Severe but below Major.'
              : 'Damage at or above Severe threshold.'
          }
        >
          <span className="text-muted-foreground bg-muted inline-flex size-6 cursor-help items-center justify-center rounded border font-mono text-xs">
            3
          </span>
        </SmartTooltip>

        {displayMajor && (
          <>
            <ThresholdChip kind="major" value={effectiveMajor} />
            <SmartTooltip content="Damage at or above Major threshold. Devastating!">
              <span className="text-muted-foreground bg-muted inline-flex size-6 cursor-help items-center justify-center rounded border font-mono text-xs">
                4
              </span>
            </SmartTooltip>
          </>
        )}
      </div>

      <p className="text-muted-foreground text-xs">
        Damage below{' '}
        <strong className="text-amber-600 dark:text-amber-400">{minor}</strong>{' '}
        has no effect. At{' '}
        <strong className="text-amber-600 dark:text-amber-400">{minor}+</strong>{' '}
        mark 1 HP. At{' '}
        <strong className="text-orange-600 dark:text-orange-400">
          {severe}+
        </strong>{' '}
        mark 2 HP.
        {displayMajor && (
          <>
            {' '}
            At{' '}
            <strong className="text-red-600 dark:text-red-400">
              {effectiveMajor}+
            </strong>{' '}
            mark 3 HP.
          </>
        )}
      </p>
    </div>
  );
}
