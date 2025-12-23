import { ChevronDown, ChevronUp, Plus, Search, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface InventoryHeaderProps {
  totalItems: number;
  maxSlots: number;
  unlimitedSlots: boolean;
  unlimitedQuantity: boolean;
  onUnlimitedSlotsChange: (v: boolean) => void;
  onUnlimitedQuantityChange: (v: boolean) => void;
  onMaxSlotsChange: (delta: number) => void;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  onCustomClick: () => void;
  onAddClick: () => void;
}

export function InventoryHeader({
  totalItems,
  maxSlots,
  unlimitedSlots,
  unlimitedQuantity,
  onUnlimitedSlotsChange,
  onUnlimitedQuantityChange,
  onMaxSlotsChange,
  searchQuery,
  onSearchChange,
  onCustomClick,
  onAddClick,
}: InventoryHeaderProps) {
  return (
    <CardHeader className="pb-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🎒</span>Inventory
          {unlimitedSlots ? (
            <Badge variant="secondary">{totalItems}/∞ items</Badge>
          ) : (
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={() => onMaxSlotsChange(-5)}
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
              <Badge variant="secondary">
                {totalItems}/{maxSlots}
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={() => onMaxSlotsChange(5)}
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
            </div>
          )}
        </CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onCustomClick}>
            <Sparkles className="mr-1 h-4 w-4" />
            Custom Item
          </Button>
          <Button size="sm" onClick={onAddClick}>
            <Plus className="mr-1 h-4 w-4" />
            Add Items
          </Button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={unlimitedSlots ? 'default' : 'outline'}
          onClick={() => onUnlimitedSlotsChange(!unlimitedSlots)}
          className="text-xs"
        >
          {unlimitedSlots ? '∞ Slots ON' : '∞ Slots'}
        </Button>
        <Button
          size="sm"
          variant={unlimitedQuantity ? 'default' : 'outline'}
          onClick={() => onUnlimitedQuantityChange(!unlimitedQuantity)}
          className="text-xs"
        >
          {unlimitedQuantity ? '∞ Qty ON' : '∞ Qty'}
        </Button>
      </div>

      <div className="relative mt-2">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="🔍 Search your inventory..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
    </CardHeader>
  );
}
