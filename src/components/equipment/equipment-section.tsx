import { Search, X } from 'lucide-react';

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

const TIER_OPTIONS = ['1', '2', '3', '4'] as const;

interface EquipmentSectionProps<T extends { name: string; tier: string }> {
  title: string;
  icon: string;
  items: T[];
  selectedItem: T | null;
  onSelect: (item: T | null) => void;
  renderCard: (
    item: T,
    isSelected: boolean,
    onSelect: () => void
  ) => React.ReactNode;
  emptyMessage?: string;
}

export function EquipmentSection<T extends { name: string; tier: string }>({
  title,
  icon: _icon,
  items,
  selectedItem,
  onSelect,
  renderCard,
  emptyMessage = 'No items available',
}: EquipmentSectionProps<T>) {
  void _icon;
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesTier = tierFilter === 'all' || item.tier === tierFilter;
      const matchesSearch =
        search === '' || item.name.toLowerCase().includes(search.toLowerCase());
      return matchesTier && matchesSearch;
    });
  }, [items, tierFilter, search]);

  const handleClearSelection = () => {
    onSelect(null);
  };

  return (
    <div className="space-y-3">
      {/* Selected Item Display */}
      {selectedItem && (
        <div className="relative">
          <div className="bg-primary/5 border-primary/20 rounded-lg border-2 p-1">
            <div className="mb-1 flex items-center justify-between px-2 pt-1">
              <span className="text-primary text-xs font-medium">
                ✓ Selected
              </span>
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
            {renderCard(selectedItem, true, () => {})}
          </div>
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
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
        <Select value={tierFilter} onValueChange={setTierFilter}>
          <SelectTrigger className="h-9 w-[120px]">
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
        <Badge variant="secondary" className="text-xs">
          {filteredItems.length} items
        </Badge>
      </div>

      {/* Items Grid */}
      <ScrollArea className="h-[320px] rounded-md border">
        <div className="grid gap-2 p-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
