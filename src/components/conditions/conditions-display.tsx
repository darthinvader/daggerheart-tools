import { Plus, Sparkles, X, Zap } from 'lucide-react';
import { useCallback, useState } from 'react';

import { CONDITION_SUGGESTIONS } from '@/components/identity-editor/trait-suggestions';
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

function ConditionInput({
  conditions,
  onAdd,
  onClose,
}: {
  conditions: ConditionsState;
  onAdd: (condition: string) => void;
  onClose: () => void;
}) {
  const [newCondition, setNewCondition] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);

  const filteredSuggestions = CONDITION_SUGGESTIONS.filter(
    s =>
      s.toLowerCase().includes(newCondition.toLowerCase()) &&
      !conditions.items.some(item => item.toLowerCase() === s.toLowerCase())
  );

  const handleAdd = (name?: string) => {
    const conditionName = name ?? newCondition;
    if (!conditionName.trim()) return;
    const trimmed = conditionName.trim();
    if (conditions.items.includes(trimmed)) return;
    onAdd(trimmed);
    setNewCondition('');
    onClose();
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Condition..."
          value={newCondition}
          onChange={e => {
            setNewCondition(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          className="h-8 text-sm"
          autoFocus
        />
        <Button
          size="sm"
          onClick={() => handleAdd()}
          disabled={!newCondition.trim()}
          className="h-8"
        >
          Add
        </Button>
      </div>
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="max-h-48 overflow-auto rounded-md border">
          {filteredSuggestions.map(suggestion => (
            <button
              key={suggestion}
              type="button"
              className="hover:bg-muted w-full px-3 py-1 text-left text-sm"
              onClick={() => handleAdd(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
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
  const [popoverOpen, setPopoverOpen] = useState(false);

  if (conditions.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Sparkles className="size-10 opacity-50" />
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
            <PopoverContent className="w-72 p-2">
              <ConditionInput
                conditions={conditions}
                onAdd={onAdd}
                onClose={() => setPopoverOpen(false)}
              />
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
          <PopoverContent className="w-72 p-2" align="start">
            <ConditionInput
              conditions={conditions}
              onAdd={onAdd}
              onClose={() => setPopoverOpen(false)}
            />
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
        <Zap className="size-5" />
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
