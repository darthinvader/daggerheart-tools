import { SmartTooltip } from '@/components/ui/smart-tooltip';
import { cn } from '@/lib/utils';

export type ThresholdKind = 'major' | 'severe' | 'massiveDamage';

interface ThresholdChipProps {
  kind: ThresholdKind;
  value: number;
  className?: string;
}

const CHIP_CONFIG: Record<
  ThresholdKind,
  { label: string; abbr: string; color: string; description: string }
> = {
  major: {
    label: 'Major',
    abbr: 'M',
    color:
      'bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/40',
    description: 'Major damage. Significant hits that require attention.',
  },
  severe: {
    label: 'Severe',
    abbr: 'S',
    color:
      'bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/40',
    description:
      'Severe damage. Wounds that leave lasting marks and require rest.',
  },
  massiveDamage: {
    label: 'Massive Damage',
    abbr: 'MD',
    color: 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/40',
    description: 'Massive damage. Critical injuries that threaten your life.',
  },
};

export function ThresholdChip({ kind, value, className }: ThresholdChipProps) {
  const config = CHIP_CONFIG[kind];

  return (
    <SmartTooltip
      side="top"
      className="max-w-xs"
      content={
        <div className="space-y-1">
          <p className="font-semibold">{config.label} Threshold</p>
          <p className="text-muted-foreground text-xs">{config.description}</p>
        </div>
      }
    >
      <span
        className={cn(
          'inline-flex cursor-help items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold tabular-nums transition-colors',
          config.color,
          className
        )}
        aria-label={`${config.label} threshold: ${value}`}
      >
        <span className="font-bold">{config.abbr}</span>
        <span className="opacity-60">:</span>
        <span>{value}</span>
      </span>
    </SmartTooltip>
  );
}
