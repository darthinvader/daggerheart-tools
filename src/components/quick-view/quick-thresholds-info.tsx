import type { ThresholdsSettings } from '@/lib/schemas/character-state';
import { cn } from '@/lib/utils';

interface QuickThresholdsInfoProps {
  thresholds: ThresholdsSettings;
  className?: string;
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
    <div className={cn('quick-thresholds-card', className)}>
      <div className="quick-threshold-item">
        <span className="quick-threshold-pip bg-yellow-500/20 text-yellow-500" />
        <div className="quick-threshold-data">
          <span className="quick-threshold-value text-yellow-500">
            {thresholds.values.major}+
          </span>
          <span className="quick-threshold-label">Major</span>
        </div>
      </div>
      <div className="quick-thresholds-divider" />
      <div className="quick-threshold-item">
        <span className="quick-threshold-pip bg-orange-500/20 text-orange-500" />
        <div className="quick-threshold-data">
          <span className="quick-threshold-value text-orange-500">
            {thresholds.values.severe}+
          </span>
          <span className="quick-threshold-label">Severe</span>
        </div>
      </div>
      {thresholds.enableCritical && thresholds.values.critical && (
        <>
          <div className="quick-thresholds-divider" />
          <div className="quick-threshold-item">
            <span className="quick-threshold-pip bg-red-500/20 text-red-500" />
            <div className="quick-threshold-data">
              <span className="quick-threshold-value text-red-500">
                {thresholds.values.critical}+
              </span>
              <span className="quick-threshold-label">Massive</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
