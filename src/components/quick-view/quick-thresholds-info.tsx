import type { ThresholdsSettings } from '@/lib/schemas/character-state';
import { cn } from '@/lib/utils';

interface QuickThresholdsInfoProps {
  thresholds: ThresholdsSettings;
  className?: string;
}

function ThresholdValue({
  label,
  value,
  colorClass,
}: {
  label: string;
  value: number;
  colorClass: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-0.5 sm:gap-1">
        <span className={cn('text-[10px] sm:text-xs', colorClass)}>
          {label}
        </span>
        <span className={cn('text-sm font-bold sm:text-base', colorClass)}>
          {value}+
        </span>
      </div>
    </div>
  );
}

/**
 * Display damage thresholds in QuickView.
 *
 * NOTE: thresholds.values are already the final calculated values when auto
 * is enabled. They include armor base + level bonus + equipment modifiers.
 * We simply display them as-is without adding extra modifiers.
 */
export function QuickThresholdsInfo({
  thresholds,
  className,
}: QuickThresholdsInfoProps) {
  return (
    <div
      className={cn(
        'bg-card flex flex-wrap items-center justify-center gap-2 rounded-lg border p-2 sm:gap-4 sm:p-3',
        className
      )}
    >
      <span className="text-muted-foreground text-[10px] sm:text-sm">
        Thresholds:
      </span>
      <div className="flex items-center gap-2 sm:gap-3">
        <ThresholdValue
          label="Major"
          value={thresholds.values.major}
          colorClass="text-yellow-500"
        />
        <ThresholdValue
          label="Severe"
          value={thresholds.values.severe}
          colorClass="text-orange-500"
        />
        {thresholds.enableCritical && thresholds.values.critical && (
          <div className="flex items-center gap-0.5 sm:gap-1">
            <span className="text-[10px] text-red-500 sm:text-xs">Massive</span>
            <span className="text-sm font-bold text-red-500 sm:text-base">
              {thresholds.values.critical}+
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
