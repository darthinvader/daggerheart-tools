import { Minus, Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ClassLevelCardProps {
  className: string;
  level: number;
  minLevel: number;
  maxLevel: number;
  isPrimary: boolean;
  onLevelChange: (delta: number) => void;
  onRemove?: () => void;
}

export function ClassLevelCard({
  className,
  level,
  minLevel,
  maxLevel,
  isPrimary,
  onLevelChange,
  onRemove,
}: ClassLevelCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        isPrimary ? 'bg-primary/5 border-primary/30' : 'bg-secondary/5'
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{className}</span>
          <Badge variant={isPrimary ? 'default' : 'secondary'}>
            {isPrimary ? 'Primary' : 'Secondary'}
          </Badge>
        </div>
        {!isPrimary && onRemove && (
          <Button variant="ghost" size="sm" onClick={onRemove}>
            Remove
          </Button>
        )}
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onLevelChange(-1)}
          disabled={level <= minLevel}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <div className="text-center">
          <div className="text-3xl font-bold">{level}</div>
          <div className="text-muted-foreground text-xs">Level</div>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onLevelChange(1)}
          disabled={level >= maxLevel}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
