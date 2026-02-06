import type { Countdown } from '@/components/countdown-tracker';
import { cn } from '@/lib/utils';

interface QuickCountdownsProps {
  countdowns: Countdown[];
  className?: string;
}

const TYPE_COLORS: Record<string, string> = {
  threat: 'quick-countdown-threat',
  opportunity: 'quick-countdown-opportunity',
  neutral: 'quick-countdown-neutral',
};

/**
 * Mini countdown tracker showing active countdowns as segmented rings.
 * Only renders when there are incomplete countdowns.
 */
export function QuickCountdowns({
  countdowns,
  className,
}: QuickCountdownsProps) {
  const active = countdowns.filter(c => c.filled < c.segments);

  if (active.length === 0) return null;

  return (
    <div className={cn('quick-countdowns-strip', className)}>
      {active.map(cd => {
        const percent =
          cd.segments > 0 ? Math.round((cd.filled / cd.segments) * 100) : 0;
        const typeClass = TYPE_COLORS[cd.type] ?? 'quick-countdown-neutral';

        return (
          <div
            key={cd.id}
            className={cn('quick-countdown-item', typeClass)}
            title={cd.description ?? cd.name}
          >
            {/* Circular progress ring */}
            <svg className="quick-countdown-ring" viewBox="0 0 36 36">
              <circle
                className="quick-countdown-ring-track"
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                strokeWidth="3"
              />
              <circle
                className="quick-countdown-ring-fill"
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                strokeWidth="3"
                strokeDasharray={`${percent} ${100 - percent}`}
                strokeDashoffset="25"
                strokeLinecap="round"
              />
            </svg>
            <div className="quick-countdown-info">
              <span className="quick-countdown-name">{cd.name}</span>
              <span className="quick-countdown-progress">
                {cd.filled}/{cd.segments}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
