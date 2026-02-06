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
import { Sparkles } from '@/lib/icons';
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
    <div className={cn('quick-conditions-card', className)}>
      {/* Header with add button */}
      <div className="quick-conditions-header">
        <span className="quick-conditions-count">
          {conditions.items.length === 0
            ? 'No conditions'
            : `${conditions.items.length} active`}
        </span>
        {onChange && (
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="quick-conditions-add-btn"
              >
                <Plus className="size-3.5" />
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

      {/* Conditions list */}
      {conditions.items.length === 0 ? (
        <p className="quick-conditions-empty">
          <Sparkles className="size-3.5" /> All clear
        </p>
      ) : (
        <div className="quick-conditions-list">
          {conditions.items.map((condition, idx) => (
            <Badge
              key={idx}
              variant="secondary"
              className="quick-condition-badge"
            >
              {condition}
              {onChange && (
                <button
                  onClick={() => handleRemove(idx)}
                  className="quick-condition-remove"
                >
                  <X className="size-2.5" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
