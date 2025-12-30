import { cn } from '@/lib/utils';

import { COUNTDOWN_TYPE_STYLES } from './constants';
import type { Countdown } from './types';

interface CountdownSegmentsProps {
  countdown: Countdown;
  onToggle?: (index: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export function CountdownSegments({
  countdown,
  onToggle,
  size = 'md',
}: CountdownSegmentsProps) {
  const styles = COUNTDOWN_TYPE_STYLES[countdown.type];
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {Array.from({ length: countdown.segments }).map((_, i) => {
        const isFilled = i < countdown.filled;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onToggle?.(i)}
            disabled={!onToggle}
            className={cn(
              'rounded-full ring-2 transition-all',
              sizeClasses[size],
              styles.ring,
              isFilled ? styles.fill : 'bg-background',
              onToggle && 'cursor-pointer hover:scale-110'
            )}
            aria-label={`Segment ${i + 1} of ${countdown.segments}: ${isFilled ? 'filled' : 'empty'}`}
          />
        );
      })}
    </div>
  );
}
