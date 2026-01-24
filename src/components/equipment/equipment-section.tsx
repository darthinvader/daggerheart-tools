import { Search, X } from 'lucide-react';
import type { ComponentType } from 'react';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Check, type LucideProps } from '@/lib/icons';

const TIER_OPTIONS = ['1', '2', '3', '4'] as const;

type IconComponent = ComponentType<LucideProps>;

interface EquipmentSectionProps<T extends { name: string; tier: string }> {
  title: string;
  icon: IconComponent;
  items: T[];
  selectedItem: T | null;
  onSelect: (item: T | null) => void;
  renderCard: (
    item: T,
    isSelected: boolean,
    onSelect: () => void
  ) => React.ReactNode;
  emptyMessage?: string;
  allowedTiers?: string[];
}

export function EquipmentSection<T extends { name: string; tier: string }>({
  title,
  icon: _Icon,
  items,
  selectedItem,
  onSelect,
  renderCard,
  emptyMessage = 'No items available',
  allowedTiers,
}: EquipmentSectionProps<T>) {
  void _Icon;
  const [search, setSearch] = useState('');
  const initialTier =
    allowedTiers && allowedTiers.length === 1 ? allowedTiers[0] : 'all';
  const [tierFilter, setTierFilter] = useState<string>(initialTier);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const inAllowedTier =
        !allowedTiers || allowedTiers.length === 0
          ? true
          : allowedTiers.includes(item.tier);
      const matchesTier = tierFilter === 'all' || item.tier === tierFilter;
      const matchesSearch =
        search === '' || item.name.toLowerCase().includes(search.toLowerCase());
      return inAllowedTier && matchesTier && matchesSearch;
    });
  }, [items, tierFilter, search, allowedTiers]);

  const handleClearSelection = () => {
    onSelect(null);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col space-y-3">
      {/* Selected Item Display - Compact inline preview */}
      {selectedItem && (
        <div className="bg-primary/5 border-primary/20 flex items-center justify-between gap-3 rounded-lg border-2 px-3 py-2">
          <div className="flex items-center gap-2">
            <Check className="text-primary h-4 w-4" />
            <span className="font-medium">{selectedItem.name}</span>
            <Badge variant="outline" className="text-xs">
              Tier {selectedItem.tier}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSelection}
            className="text-muted-foreground hover:text-destructive h-6 px-2 text-xs"
          >
            <X className="mr-1 h-3 w-3" />
            Clear
          </Button>
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-50 flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Search ${title.toLowerCase()}...`}
            className="h-9 pl-8"
          />
          {search && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearch('')}
              className="absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        {(!allowedTiers || allowedTiers.length > 1) && (
          <Select value={tierFilter} onValueChange={setTierFilter}>
            <SelectTrigger className="h-9 w-30">
              <SelectValue placeholder="Tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              {TIER_OPTIONS.map(t => (
                <SelectItem key={t} value={t}>
                  Tier {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Badge variant="secondary" className="text-xs">
          {filteredItems.length} items
        </Badge>
      </div>

      {/* Items Grid */}
      <ScrollArea className="min-h-60 flex-1 rounded-md border">
        <div className="grid gap-2 p-2 sm:grid-cols-2 sm:gap-3 sm:p-3 lg:grid-cols-3">
          {filteredItems.length === 0 ? (
            <div className="text-muted-foreground col-span-full py-8 text-center text-sm">
              {search || tierFilter !== 'all'
                ? 'No matching items found'
                : emptyMessage}
            </div>
          ) : (
            filteredItems.map(item =>
              renderCard(item, item.name === selectedItem?.name, () =>
                onSelect(item.name === selectedItem?.name ? null : item)
              )
            )
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
