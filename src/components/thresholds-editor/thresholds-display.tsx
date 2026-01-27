import { SmartTooltip } from '@/components/ui/smart-tooltip';
import { cn } from '@/lib/utils';

import { ThresholdChip } from './threshold-chip';

interface ThresholdsDisplayProps {
  major: number;
  severe: number;
  massiveDamage?: number;
  showMassiveDamage?: boolean;
  className?: string;
}

export function ThresholdsDisplay({
  major,
  severe,
  massiveDamage,
  showMassiveDamage = false,
  className,
}: ThresholdsDisplayProps) {
  const effectiveMassiveDamage = massiveDamage ?? severe * 2;
  const displayMassiveDamage = showMassiveDamage && effectiveMassiveDamage > 0;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        Thresholds
      </div>

      <div className="flex items-center gap-1">
        <SmartTooltip content="Damage below Major threshold - take 1 damage.">
          <span className="text-muted-foreground bg-muted inline-flex size-6 cursor-help items-center justify-center rounded border font-mono text-xs">
            1
          </span>
        </SmartTooltip>

        <ThresholdChip kind="major" value={major} />

        <SmartTooltip content="Damage at or above Major but below Severe - take 2 damage.">
          <span className="text-muted-foreground bg-muted inline-flex size-6 cursor-help items-center justify-center rounded border font-mono text-xs">
            2
          </span>
        </SmartTooltip>

        <ThresholdChip kind="severe" value={severe} />

        <SmartTooltip
          content={
            displayMassiveDamage
              ? 'Damage at or above Severe but below Massive Damage - take 3 damage.'
              : 'Damage at or above Severe threshold - take 3 damage.'
          }
        >
          <span className="text-muted-foreground bg-muted inline-flex size-6 cursor-help items-center justify-center rounded border font-mono text-xs">
            3
          </span>
        </SmartTooltip>

        {displayMassiveDamage && (
          <>
            <ThresholdChip
              kind="massiveDamage"
              value={effectiveMassiveDamage}
            />
            <SmartTooltip content="Damage at or above Massive Damage threshold - take 4 damage.">
              <span className="text-muted-foreground bg-muted inline-flex size-6 cursor-help items-center justify-center rounded border font-mono text-xs">
                4
              </span>
            </SmartTooltip>
          </>
        )}
      </div>

      <ul className="text-muted-foreground list-inside list-disc space-y-1 text-xs">
        <li>
          Below or equal to{' '}
          <strong className="text-amber-600 dark:text-amber-400">
            {major - 1}
          </strong>{' '}
          → 1 damage
        </li>
        <li>
          Above{' '}
          <strong className="text-amber-600 dark:text-amber-400">
            {major - 1}
          </strong>{' '}
          and below or equal to{' '}
          <strong className="text-orange-600 dark:text-orange-400">
            {severe - 1}
          </strong>{' '}
          → 2 damage
        </li>
        {displayMassiveDamage ? (
          <>
            <li>
              Above{' '}
              <strong className="text-orange-600 dark:text-orange-400">
                {severe - 1}
              </strong>{' '}
              and below or equal to{' '}
              <strong className="text-red-600 dark:text-red-400">
                {effectiveMassiveDamage - 1}
              </strong>{' '}
              → 3 damage
            </li>
            <li>
              Above or equal to{' '}
              <strong className="text-red-600 dark:text-red-400">
                {effectiveMassiveDamage}
              </strong>{' '}
              → 4 damage
            </li>
          </>
        ) : (
          <li>
            Above or equal to{' '}
            <strong className="text-orange-600 dark:text-orange-400">
              {severe}
            </strong>{' '}
            → 3 damage
          </li>
        )}
      </ul>
    </div>
  );
}
