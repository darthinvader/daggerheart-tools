import { useState } from 'react';

import { InventoryDisplay, type InventoryState } from '@/components/inventory';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Consumable, UtilityItem } from '@/lib/schemas/equipment';

const makeUtilityItem = (
  name: string,
  tier: string,
  rarity: string
): UtilityItem => ({
  name,
  tier,
  category: 'Utility',
  rarity,
  isConsumable: false,
  maxQuantity: 1,
  usageType: 'unlimited',
  features: [],
  metadata: { source: 'SRD' },
});

const makeConsumable = (
  name: string,
  tier: string,
  rarity: string,
  effect: string,
  maxQty = 5
): Consumable => ({
  name,
  tier,
  category: 'Consumable',
  rarity,
  isConsumable: true,
  maxQuantity: maxQty,
  effect,
  features: [],
  metadata: { source: 'SRD' },
});

const SAMPLE_FULL: InventoryState = {
  maxSlots: 50,
  items: [
    {
      id: '1',
      item: makeConsumable('Healing Potion', '1', 'Common', 'Restore 1d6 HP'),
      quantity: 3,
      isEquipped: false,
      location: 'backpack',
    },
    {
      id: '2',
      item: makeUtilityItem('Rope (50 ft)', '1', 'Common'),
      quantity: 1,
      isEquipped: true,
      location: 'equipped',
    },
    {
      id: '3',
      item: makeConsumable(
        'Torch',
        '1',
        'Common',
        'Provides light for 1 hour',
        10
      ),
      quantity: 5,
      isEquipped: false,
      location: 'backpack',
    },
    {
      id: '4',
      item: makeConsumable('Rations', '1', 'Common', 'One day of food'),
      quantity: 7,
      isEquipped: false,
      location: 'backpack',
    },
    {
      id: '5',
      item: makeUtilityItem('Spellbook', '2', 'Uncommon'),
      quantity: 1,
      isEquipped: true,
      location: 'equipped',
    },
    {
      id: '6',
      item: makeUtilityItem('Ruby Gemstone', '3', 'Rare'),
      quantity: 1,
      isEquipped: false,
      location: 'backpack',
      isCustom: true,
    },
  ],
};

const SAMPLE_MINIMAL: InventoryState = {
  maxSlots: 30,
  items: [
    {
      id: '1',
      item: makeUtilityItem('Waterskin', '1', 'Common'),
      quantity: 1,
      isEquipped: false,
      location: 'backpack',
    },
  ],
};

const SAMPLE_EMPTY: InventoryState = {
  maxSlots: 50,
  items: [],
};

export function InventoryDisplayDemo() {
  const [fullInventory, setFullInventory] =
    useState<InventoryState>(SAMPLE_FULL);
  const [minimalInventory, setMinimalInventory] =
    useState<InventoryState>(SAMPLE_MINIMAL);
  const [emptyInventory, setEmptyInventory] =
    useState<InventoryState>(SAMPLE_EMPTY);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold">🎒 Inventory Display Demo</h2>
        <p className="text-muted-foreground">
          Showcases the InventoryDisplay component with edit modal capability.
          Click the Edit button to manage items.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Badge
                variant="secondary"
                className="border-amber-500/30 bg-amber-500/10 text-amber-600"
              >
                📦 Full Inventory
              </Badge>
              <span className="text-muted-foreground font-normal">
                Multiple items across categories
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <InventoryDisplay
              inventory={fullInventory}
              onChange={setFullInventory}
            />
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Badge
                  variant="secondary"
                  className="border-slate-500/30 bg-slate-500/10 text-slate-600"
                >
                  📋 Minimal
                </Badge>
                <span className="text-muted-foreground font-normal">
                  Just basics
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <InventoryDisplay
                inventory={minimalInventory}
                onChange={setMinimalInventory}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Badge variant="outline">Empty State</Badge>
                <span className="text-muted-foreground font-normal">
                  No items
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <InventoryDisplay
                inventory={emptyInventory}
                onChange={setEmptyInventory}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
