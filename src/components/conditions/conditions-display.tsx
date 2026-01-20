import { Plus, X } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface ConditionsState {
  items: string[];
}

interface ConditionsDisplayProps {
  conditions: ConditionsState;
  onChange?: (conditions: ConditionsState) => void;
  className?: string;
  readOnly?: boolean;
}

function ConditionsDetailedDisplay({
  conditions,
  onAdd,
  onRemove,
}: {
  conditions: ConditionsState;
  onAdd?: (condition: string) => void;
  onRemove?: (idx: number) => void;
}) {
  const [newCondition, setNewCondition] = useState('');
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleAdd = useCallback(() => {
    if (!newCondition.trim() || !onAdd) return;
    const trimmed = newCondition.trim();
    if (conditions.items.includes(trimmed)) return;
    onAdd(trimmed);
    setNewCondition('');
    setPopoverOpen(false);
  }, [newCondition, conditions.items, onAdd]);

  if (conditions.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <span className="text-4xl opacity-50">✨</span>
        <p className="text-muted-foreground mt-2">No conditions</p>
        <p className="text-muted-foreground mb-4 text-sm">
          Your character is in good shape!
        </p>
        {onAdd && (
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-1 size-4" />
                Add Condition
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Condition..."
                  value={newCondition}
                  onChange={e => setNewCondition(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAdd()}
                  className="h-8 text-sm"
                />
                <Button
                  size="sm"
                  onClick={handleAdd}
                  disabled={!newCondition.trim()}
                  className="h-8"
                >
                  Add
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {conditions.items.map((condition, idx) => (
          <Badge
            key={idx}
            variant="secondary"
            className="gap-1 px-3 py-1 text-sm"
          >
            {condition}
            {onRemove && (
              <button
                onClick={() => onRemove(idx)}
                className="hover:bg-destructive/20 ml-1 rounded-full"
              >
                <X className="size-3" />
              </button>
            )}
          </Badge>
        ))}
      </div>
      {onAdd && (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 gap-1">
              <Plus className="size-4" />
              Add
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2" align="start">
            <div className="flex gap-2">
              <Input
                placeholder="Condition..."
                value={newCondition}
                onChange={e => setNewCondition(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                className="h-8 text-sm"
              />
              <Button
                size="sm"
                onClick={handleAdd}
                disabled={!newCondition.trim()}
                className="h-8"
              >
                Add
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}

export function ConditionsDisplay({
  conditions,
  onChange,
  className,
  readOnly = false,
}: ConditionsDisplayProps) {
  const handleAdd = useCallback(
    (condition: string) => {
      onChange?.({ items: [...conditions.items, condition] });
    },
    [conditions, onChange]
  );

  const handleRemove = useCallback(
    (idx: number) => {
      onChange?.({ items: conditions.items.filter((_, i) => i !== idx) });
    },
    [conditions, onChange]
  );

  return (
    <div className={cn('bg-card rounded-lg border p-4', className)}>
      <div className="mb-3 flex items-center gap-2">
        <span className="text-lg">⚡</span>
        <h3 className="font-semibold">Conditions</h3>
      </div>
      <ConditionsDetailedDisplay
        conditions={conditions}
        onAdd={!readOnly && onChange ? handleAdd : undefined}
        onRemove={!readOnly && onChange ? handleRemove : undefined}
      />
    </div>
  );
}
