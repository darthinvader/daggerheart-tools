import { Minus, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CompanionStatCardProps {
  label: string;
  emoji: string;
  color: string;
  current: number;
  max: number;
  onChange?: (current: number) => void;
  readOnly?: boolean;
}

export function CompanionStatCard({
  label,
  emoji,
  color,
  current,
  max,
  onChange,
  readOnly,
}: CompanionStatCardProps) {
  const handleDecrement = () => {
    if (current > 0) onChange?.(current - 1);
  };

  const handleIncrement = () => {
    if (current < max) onChange?.(current + 1);
  };

  return (
    <div className="flex flex-col items-center rounded-lg border p-2">
      <span className="text-lg">{emoji}</span>
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className={cn('text-lg font-bold', color)}>
        {current}/{max}
      </span>
      {!readOnly && onChange && (
        <div className="mt-1 flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="size-6"
            onClick={handleDecrement}
            disabled={current <= 0}
          >
            <Minus className="size-3" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-6"
            onClick={handleIncrement}
            disabled={current >= max}
          >
            <Plus className="size-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
