import { Filter } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import type { DomainCardType } from '@/lib/schemas/domains';
import { cn } from '@/lib/utils';

import {
  CARD_LEVELS,
  CARD_TYPES,
  CARD_TYPE_EMOJIS,
  type CardFiltersState,
} from './card-filters-utils';

interface CardFiltersProps {
  filters: CardFiltersState;
  onFiltersChange: (filters: CardFiltersState) => void;
  maxLevel?: number;
}

function TypeFilterSection({
  types,
  onToggle,
  onReset,
}: {
  types: DomainCardType[];
  onToggle: (type: DomainCardType) => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Card Type</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-auto py-0.5 text-xs"
        >
          All
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {CARD_TYPES.map(type => (
          <Badge
            key={type}
            variant={types.includes(type) ? 'default' : 'outline'}
            className={cn('cursor-pointer transition-all hover:opacity-80')}
            onClick={() => onToggle(type)}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onToggle(type);
              }
            }}
          >
            {CARD_TYPE_EMOJIS[type]} {type}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function LevelFilterSection({
  levels,
  availableLevels,
  onToggle,
  onReset,
}: {
  levels: number[];
  availableLevels: number[];
  onToggle: (level: number) => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Card Level</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-auto py-0.5 text-xs"
        >
          All
        </Button>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {availableLevels.map(level => (
          <div key={level} className="flex items-center gap-1.5">
            <Checkbox
              id={`level-${level}`}
              checked={levels.includes(level)}
              onCheckedChange={() => onToggle(level)}
            />
            <Label
              htmlFor={`level-${level}`}
              className="cursor-pointer text-sm"
            >
              {level}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardFilters({
  filters,
  onFiltersChange,
  maxLevel = 10,
}: CardFiltersProps) {
  const effectiveMaxLevel = filters.showHigherLevelCards ? 10 : maxLevel;
  const activeFilterCount =
    (filters.types.length < CARD_TYPES.length ? filters.types.length : 0) +
    (filters.levels.length < effectiveMaxLevel ? filters.levels.length : 0);

  const handleTypeToggle = (type: DomainCardType) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    onFiltersChange({ ...filters, types: newTypes });
  };

  const handleLevelToggle = (level: number) => {
    const newLevels = filters.levels.includes(level)
      ? filters.levels.filter(l => l !== level)
      : [...filters.levels, level];
    onFiltersChange({ ...filters, levels: newLevels });
  };

  const handleHigherLevelToggle = (checked: boolean) => {
    const newMaxLevel = checked ? 10 : maxLevel;
    onFiltersChange({
      ...filters,
      showHigherLevelCards: checked,
      levels: CARD_LEVELS.filter(l => l <= newMaxLevel),
    });
  };

  const handleResetTypes = () =>
    onFiltersChange({ ...filters, types: [...CARD_TYPES] });

  const handleResetLevels = () =>
    onFiltersChange({
      ...filters,
      levels: CARD_LEVELS.filter(l => l <= effectiveMaxLevel),
    });

  const handleResetAll = () =>
    onFiltersChange({
      types: [...CARD_TYPES],
      levels: CARD_LEVELS.filter(l => l <= maxLevel),
      showHigherLevelCards: false,
    });

  const availableLevels = CARD_LEVELS.filter(l => l <= effectiveMaxLevel);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="h-5 min-w-5 px-1.5">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Filter Cards</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetAll}
              className="h-auto py-1 text-xs"
            >
              Reset All
            </Button>
          </div>

          <TypeFilterSection
            types={filters.types}
            onToggle={handleTypeToggle}
            onReset={handleResetTypes}
          />

          <LevelFilterSection
            levels={filters.levels}
            availableLevels={[...availableLevels]}
            onToggle={handleLevelToggle}
            onReset={handleResetLevels}
          />

          {maxLevel < 10 && (
            <div className="border-t pt-3">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="higher-level-toggle"
                  className="cursor-pointer text-sm"
                >
                  🔓 Show higher level cards
                </Label>
                <Switch
                  id="higher-level-toggle"
                  checked={filters.showHigherLevelCards}
                  onCheckedChange={handleHigherLevelToggle}
                />
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                Include cards above level {maxLevel}
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
