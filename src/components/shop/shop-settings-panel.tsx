import { Search, Store, Trash2, X } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import {
  ALL_CATEGORIES,
  CATEGORY_CONFIG,
  type ItemCategory,
  RARITY_CONFIG,
} from '@/components/inventory/constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { formatGoldAmount } from '@/features/shop/gold-math';
import {
  ALL_ARMOR_MODIFICATIONS,
  ALL_CONSUMABLES,
  ALL_RECIPES,
  ALL_RELICS,
  ALL_UTILITY_ITEMS,
  ALL_WEAPON_MODIFICATIONS,
} from '@/lib/data/equipment';
import type { Campaign, ShopSettings } from '@/lib/schemas/campaign';
import type { AnyItem, Rarity } from '@/lib/schemas/equipment';
import { cn } from '@/lib/utils';

import { GoldPriceInput } from './gold-price-input';

const ALL_ITEMS: AnyItem[] = [
  ...ALL_UTILITY_ITEMS,
  ...ALL_CONSUMABLES,
  ...ALL_RELICS,
  ...ALL_WEAPON_MODIFICATIONS,
  ...ALL_ARMOR_MODIFICATIONS,
  ...ALL_RECIPES,
];

const ALL_RARITIES: Rarity[] = ['Common', 'Uncommon', 'Rare', 'Legendary'];

interface ShopSettingsPanelProps {
  shopEnabled: boolean;
  shopSettings: ShopSettings | undefined;
  onUpdate: (
    updates: Partial<Pick<Campaign, 'shopEnabled' | 'shopSettings'>>
  ) => void;
}

export function ShopSettingsPanel({
  shopEnabled,
  shopSettings,
  onUpdate,
}: ShopSettingsPanelProps) {
  const settings = shopSettings ?? {
    priceMultiplier: 1,
    categoryMultipliers: {},
    itemPriceOverrides: {},
    showCoins: false,
  };

  const [multiplier, setMultiplier] = useState(
    String(settings.priceMultiplier)
  );

  // Override browser state
  const [overrideSearch, setOverrideSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<ItemCategory[]>(
    []
  );
  const [selectedRarities, setSelectedRarities] = useState<Rarity[]>([]);
  const [showBrowser, setShowBrowser] = useState(false);

  const handleToggle = useCallback(
    (enabled: boolean) => {
      onUpdate({ shopEnabled: enabled });
    },
    [onUpdate]
  );

  const handleMultiplierChange = useCallback(
    (raw: string) => {
      setMultiplier(raw);
      // Fire onUpdate immediately so changes save on every keystroke
      const value = Number.parseFloat(raw);
      if (!Number.isNaN(value) && value >= 0) {
        onUpdate({
          shopSettings: { ...settings, priceMultiplier: value },
        });
      }
    },
    [settings, onUpdate]
  );

  const handleMultiplierBlur = useCallback(() => {
    // Snap display to canonical value if invalid
    const value = Number.parseFloat(multiplier);
    if (Number.isNaN(value) || value < 0) {
      setMultiplier(String(settings.priceMultiplier));
    }
  }, [multiplier, settings]);

  const handleShowCoinsChange = useCallback(
    (showCoins: boolean) => {
      onUpdate({
        shopSettings: { ...settings, showCoins },
      });
    },
    [settings, onUpdate]
  );

  const overrides = settings.itemPriceOverrides ?? {};

  const handleSetOverride = useCallback(
    (itemName: string, price: number) => {
      onUpdate({
        shopSettings: {
          ...settings,
          itemPriceOverrides: { ...overrides, [itemName]: price },
        },
      });
    },
    [settings, overrides, onUpdate]
  );

  const handleRemoveOverride = useCallback(
    (itemName: string) => {
      const next = { ...overrides };
      delete next[itemName];
      onUpdate({
        shopSettings: { ...settings, itemPriceOverrides: next },
      });
    },
    [settings, overrides, onUpdate]
  );

  const toggleCategory = (cat: ItemCategory) =>
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  const toggleRarity = (r: Rarity) =>
    setSelectedRarities(prev =>
      prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]
    );

  // Filtered items — apply search, category, rarity, exclude already overridden
  const browserItems = useMemo(() => {
    let result = ALL_ITEMS.filter(i => !(i.name in overrides));

    if (selectedCategories.length > 0) {
      result = result.filter(i =>
        selectedCategories.includes(
          (i as { category?: string }).category as ItemCategory
        )
      );
    }

    if (selectedRarities.length > 0) {
      result = result.filter(i =>
        selectedRarities.includes(i.rarity as Rarity)
      );
    }

    if (overrideSearch.trim()) {
      const lower = overrideSearch.toLowerCase();
      result = result.filter(
        i =>
          i.name.toLowerCase().includes(lower) ||
          i.description?.toLowerCase().includes(lower) ||
          i.features?.some(f => f.name.toLowerCase().includes(lower))
      );
    }

    return result;
  }, [overrides, selectedCategories, selectedRarities, overrideSearch]);

  const overrideEntries = Object.entries(overrides);
  const activeFilterCount = selectedCategories.length + selectedRarities.length;

  return (
    <div className="space-y-6">
      {/* Enable toggle card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5 text-amber-500" />
              <CardTitle className="text-lg">Shop</CardTitle>
            </div>
            <Switch
              id="shop-toggle"
              checked={shopEnabled}
              onCheckedChange={handleToggle}
            />
          </div>
          <CardDescription>
            Enable a shop for players in this campaign. Players can browse and
            purchase items using their gold.
          </CardDescription>
        </CardHeader>
      </Card>

      {shopEnabled && (
        <>
          {/* Pricing configuration */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Pricing Configuration</CardTitle>
              <CardDescription>
                Set global pricing rules that apply to all items in the shop.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="price-multiplier"
                  className="text-sm font-medium"
                >
                  Global Price Multiplier
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="price-multiplier"
                    type="number"
                    min="0"
                    step="0.1"
                    value={multiplier}
                    onChange={e => handleMultiplierChange(e.target.value)}
                    onBlur={handleMultiplierBlur}
                    className="w-28"
                  />
                  <span className="text-muted-foreground text-sm">
                    ×{' '}
                    {Number.parseFloat(multiplier) === 1
                      ? 'Normal prices'
                      : Number.parseFloat(multiplier) > 1
                        ? 'More expensive'
                        : 'Cheaper'}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs">
                  Applied to all items. Individual overrides below take
                  precedence.
                </p>
              </div>

              <Separator />

              {/* Show coins toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Show Coins</Label>
                  <p className="text-muted-foreground text-xs">
                    Display the coins denomination (1/10 of a handful) for
                    characters in this campaign.
                  </p>
                </div>
                <Switch
                  checked={settings.showCoins ?? false}
                  onCheckedChange={handleShowCoinsChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Per-item price overrides */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">
                    Per-Item Price Overrides
                    {overrideEntries.length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {overrideEntries.length}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Set custom prices for specific items. These override the
                    global multiplier.
                  </CardDescription>
                </div>
                <Button
                  variant={showBrowser ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowBrowser(!showBrowser)}
                  className="gap-1.5"
                >
                  <Search className="h-3.5 w-3.5" />
                  {showBrowser ? 'Close' : 'Add Override'}
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Existing overrides */}
              {overrideEntries.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Active Overrides
                  </Label>
                  <ScrollArea className="max-h-64">
                    <div className="space-y-1.5">
                      {overrideEntries.map(([name, price]) => {
                        const item = ALL_ITEMS.find(i => i.name === name);
                        const category = (
                          item as { category?: string } | undefined
                        )?.category as ItemCategory | undefined;
                        const catConfig = category
                          ? CATEGORY_CONFIG[category]
                          : null;
                        const CatIcon = catConfig?.icon;
                        return (
                          <div
                            key={name}
                            className="bg-muted/30 space-y-2 rounded-lg border p-3"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  {CatIcon && (
                                    <CatIcon
                                      className={cn(
                                        'size-4 shrink-0',
                                        catConfig?.color
                                      )}
                                    />
                                  )}
                                  <span className="truncate text-sm font-medium">
                                    {name}
                                  </span>
                                  {item && (
                                    <>
                                      <Badge
                                        variant="outline"
                                        className="text-[10px]"
                                      >
                                        T{item.tier}
                                      </Badge>
                                      <Badge
                                        variant="outline"
                                        className={cn(
                                          'text-[10px]',
                                          RARITY_CONFIG[item.rarity as Rarity]
                                            ?.color
                                        )}
                                      >
                                        {item.rarity}
                                      </Badge>
                                    </>
                                  )}
                                </div>
                                {item?.description && (
                                  <p className="text-muted-foreground mt-1 line-clamp-1 text-xs">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive h-7 w-7 shrink-0"
                                onClick={() => handleRemoveOverride(name)}
                                aria-label={`Remove override for ${name}`}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-3">
                              <GoldPriceInput
                                compact
                                value={price}
                                onChange={v => handleSetOverride(name, v)}
                                showCoins={settings.showCoins}
                              />
                              <span className="text-muted-foreground text-xs whitespace-nowrap">
                                = {formatGoldAmount(price)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {overrideEntries.length === 0 && !showBrowser && (
                <p className="text-muted-foreground py-4 text-center text-sm">
                  No per-item overrides set. Click &ldquo;Add Override&rdquo; to
                  set custom prices for specific items.
                </p>
              )}

              {/* Item browser for adding overrides */}
              {showBrowser && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Browse Items</Label>

                    {/* Search bar */}
                    <div className="relative">
                      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                      <Input
                        placeholder="Search by name, description, or feature..."
                        value={overrideSearch}
                        onChange={e => setOverrideSearch(e.target.value)}
                        className="pl-9"
                      />
                      {overrideSearch && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2"
                          onClick={() => setOverrideSearch('')}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>

                    {/* Filter chips */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1.5">
                        {ALL_CATEGORIES.map(cat => {
                          const config = CATEGORY_CONFIG[cat];
                          return (
                            <Badge
                              key={cat}
                              variant={
                                selectedCategories.includes(cat)
                                  ? 'default'
                                  : 'outline'
                              }
                              className={cn(
                                'cursor-pointer text-xs transition-all',
                                selectedCategories.includes(cat) &&
                                  `${config.bgColor} ${config.color}`
                              )}
                              onClick={() => toggleCategory(cat)}
                            >
                              <config.icon className="mr-1 size-3" />
                              {cat}
                            </Badge>
                          );
                        })}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {ALL_RARITIES.map(r => {
                          const config = RARITY_CONFIG[r];
                          return (
                            <Badge
                              key={r}
                              variant={
                                selectedRarities.includes(r)
                                  ? 'default'
                                  : 'outline'
                              }
                              className={cn(
                                'cursor-pointer text-xs transition-all',
                                selectedRarities.includes(r) && config?.color
                              )}
                              onClick={() => toggleRarity(r)}
                            >
                              {r}
                            </Badge>
                          );
                        })}
                        {activeFilterCount > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 px-2 text-xs"
                            onClick={() => {
                              setSelectedCategories([]);
                              setSelectedRarities([]);
                            }}
                          >
                            Clear filters
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Results count */}
                    <p className="text-muted-foreground text-xs">
                      {browserItems.length} item
                      {browserItems.length !== 1 ? 's' : ''} found
                    </p>

                    {/* Results list */}
                    <ScrollArea className="h-72 rounded-md border">
                      <div className="divide-y">
                        {browserItems.map(item => (
                          <ItemOverrideRow
                            key={item.name}
                            item={item}
                            onSelect={handleSetOverride}
                            showCoins={settings.showCoins}
                          />
                        ))}
                        {browserItems.length === 0 && (
                          <p className="text-muted-foreground py-8 text-center text-sm">
                            No items match your search
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

/** A single item row in the override browser */
function ItemOverrideRow({
  item,
  onSelect,
  showCoins,
}: {
  item: AnyItem;
  onSelect: (name: string, price: number) => void;
  showCoins?: boolean;
}) {
  const [priceHandfuls, setPriceHandfuls] = useState(item.cost ?? 1);
  const rarityConfig = RARITY_CONFIG[item.rarity as Rarity];
  const category = (item as { category?: string }).category as ItemCategory;
  const catConfig = category ? CATEGORY_CONFIG[category] : null;
  const CatIcon = catConfig?.icon;

  return (
    <div className="hover:bg-accent/50 space-y-2 px-3 py-3 transition-colors">
      <div className="flex items-start gap-2">
        {CatIcon && (
          <div
            className={cn(
              'flex size-7 shrink-0 items-center justify-center rounded-full',
              catConfig?.bgColor
            )}
          >
            <CatIcon className={cn('size-3.5', catConfig?.color)} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{item.name}</span>
            <Badge variant="outline" className="text-[10px]">
              T{item.tier}
            </Badge>
            <Badge
              variant="outline"
              className={cn('text-[10px]', rarityConfig?.color)}
            >
              {item.rarity}
            </Badge>
          </div>
          {item.description && (
            <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs">
              {item.description}
            </p>
          )}
          {item.features && item.features.length > 0 && (
            <div className="mt-1 space-y-0.5">
              {item.features.slice(0, 2).map((f, i) => (
                <p key={i} className="text-muted-foreground text-xs">
                  <span className="text-foreground font-medium">{f.name}</span>
                  {f.description && <>: {f.description}</>}
                </p>
              ))}
              {item.features.length > 2 && (
                <p className="text-muted-foreground text-[10px]">
                  +{item.features.length - 2} more feature
                  {item.features.length - 2 > 1 ? 's' : ''}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 pl-9">
        <GoldPriceInput
          compact
          value={priceHandfuls}
          onChange={setPriceHandfuls}
          showCoins={showCoins}
        />
        <span className="text-muted-foreground text-xs whitespace-nowrap">
          = {formatGoldAmount(priceHandfuls)}
        </span>
        <Button
          size="sm"
          variant="secondary"
          className="ml-auto h-7"
          onClick={() => onSelect(item.name, priceHandfuls)}
        >
          Set
        </Button>
      </div>
    </div>
  );
}
