import { cn } from '@/lib/utils';

interface UsageCounterProps {
  current: number;
  max: number;
  onChange?: (newCurrent: number) => void;
  size?: 'sm' | 'md';
}

export function UsageCounter({
  current,
  max,
  onChange,
  size = 'sm',
}: UsageCounterProps) {
  const pipSize = size === 'sm' ? 'size-2.5' : 'size-3.5';

  function handlePipClick(index: number) {
    if (!onChange) return;
    // Clicking a filled pip at the boundary toggles it off;
    // clicking any pip sets uses to that pip's 1-based index.
    const newValue = index + 1 === current ? index : index + 1;
    onChange(newValue);
  }

  return (
    <div
      className="flex items-center gap-1"
      role="group"
      aria-label={`${current} of ${max} uses remaining`}
    >
      {Array.from({ length: max }, (_, i) => {
        const filled = i < current;
        return (
          <button
            key={i}
            type="button"
            disabled={!onChange}
            onClick={() => handlePipClick(i)}
            aria-label={`Use ${i + 1} of ${max}`}
            className={cn(
              'rounded-full border transition-colors',
              pipSize,
              filled
                ? 'border-emerald-500 bg-emerald-500'
                : 'border-muted-foreground/40 bg-transparent',
              onChange &&
                'cursor-pointer hover:border-emerald-400 hover:bg-emerald-400/30'
            )}
          />
        );
      })}
    </div>
  );
}
