import { Plus, X } from 'lucide-react';
import { useCallback, useState } from 'react';

import type { ConditionsState } from '@/components/conditions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface QuickConditionsInfoProps {
  conditions: ConditionsState;
  onChange?: (conditions: ConditionsState) => void;
  className?: string;
}

export function QuickConditionsInfo({
  conditions,
  onChange,
  className,
}: QuickConditionsInfoProps) {
  const [newCondition, setNewCondition] = useState('');
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleAdd = useCallback(() => {
    if (!newCondition.trim() || !onChange) return;
    const trimmed = newCondition.trim();
    if (conditions.items.includes(trimmed)) return;
    onChange({ items: [...conditions.items, trimmed] });
    setNewCondition('');
    setPopoverOpen(false);
  }, [newCondition, conditions, onChange]);

  const handleRemove = useCallback(
    (idx: number) => {
      onChange?.({ items: conditions.items.filter((_, i) => i !== idx) });
    },
    [conditions, onChange]
  );

  return (
    <div className={cn('bg-card rounded-lg border p-3', className)}>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">⚡</span>
          <span className="font-semibold">Conditions</span>
        </div>
        {onChange && (
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <Plus className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2" align="end">
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

      {conditions.items.length === 0 ? (
        <p className="text-muted-foreground text-center text-sm">
          ✨ No conditions
        </p>
      ) : (
        <div className="flex flex-wrap gap-1">
          {conditions.items.map((condition, idx) => (
            <Badge
              key={idx}
              variant="secondary"
              className="gap-1 py-0.5 text-xs"
            >
              {condition}
              {onChange && (
                <button
                  onClick={() => handleRemove(idx)}
                  className="hover:bg-destructive/20 ml-0.5 rounded-full"
                >
                  <X className="size-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
