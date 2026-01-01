import type { ThresholdsSettings } from '@/lib/schemas/character-state';
import { cn } from '@/lib/utils';

interface QuickThresholdsInfoProps {
  thresholds: ThresholdsSettings;
  className?: string;
}

export function QuickThresholdsInfo({
  thresholds,
  className,
}: QuickThresholdsInfoProps) {
  return (
    <div
      className={cn(
        'bg-card flex items-center justify-center gap-4 rounded-lg border p-3',
        className
      )}
    >
      <span className="text-muted-foreground text-sm">Damage Thresholds:</span>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <span className="text-xs text-yellow-500">Major</span>
          <span className="font-bold text-yellow-500">
            {thresholds.values.major}+
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-orange-500">Severe</span>
          <span className="font-bold text-orange-500">
            {thresholds.values.severe}+
          </span>
        </div>
        {thresholds.enableCritical && thresholds.values.critical && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-red-500">Critical</span>
            <span className="font-bold text-red-500">
              {thresholds.values.critical}+
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
