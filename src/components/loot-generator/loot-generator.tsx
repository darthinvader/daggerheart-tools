import {
  Check,
  Coins,
  Copy,
  Dices,
  FlaskConical,
  Gift,
  Shield,
  Sword,
} from 'lucide-react';
import { useCallback, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn, copyToClipboard } from '@/lib/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

type Tier = 'tier1' | 'tier2' | 'tier3' | 'tier4';
type Category = 'mixed' | 'weapons' | 'armor' | 'consumables' | 'gold';
type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary';

interface WeaponEntry {
  name: string;
  damage: string;
  range: string;
  trait: string;
  features: string[];
}

interface ArmorEntry {
  name: string;
  feature: string;
  thresholds: { major: number; severe: number };
}

interface ConsumableEntry {
  name: string;
  description: string;
  rarity: Rarity;
}

interface GoldRange {
  min: number;
  max: number;
  denomination: string;
}

interface GeneratedWeapon {
  type: 'weapon';
  item: WeaponEntry;
}

interface GeneratedArmor {
  type: 'armor';
  item: ArmorEntry;
}

interface GeneratedConsumable {
  type: 'consumable';
  item: ConsumableEntry;
}

interface GeneratedGold {
  type: 'gold';
  amount: number;
  denomination: string;
}

type GeneratedItem =
  | GeneratedWeapon
  | GeneratedArmor
  | GeneratedConsumable
  | GeneratedGold;

// ─── Loot Tables ─────────────────────────────────────────────────────────────

const LOOT_TABLES = {
  weapons: {
    tier1: [
      {
        name: 'Rusty Sword',
        damage: '1d6',
        range: 'Melee',
        trait: 'Strength',
        features: ['Physical'],
      },
      {
        name: 'Short Bow',
        damage: '1d6',
        range: 'Far',
        trait: 'Finesse',
        features: ['Physical'],
      },
      {
        name: 'Wooden Staff',
        damage: '1d4',
        range: 'Melee',
        trait: 'Knowledge',
        features: ['Magic'],
      },
      {
        name: 'Hunting Knife',
        damage: '1d4',
        range: 'Very Close',
        trait: 'Finesse',
        features: ['Physical', 'Quick'],
      },
      {
        name: 'Sling',
        damage: '1d4',
        range: 'Close',
        trait: 'Agility',
        features: ['Physical'],
      },
    ],
    tier2: [
      {
        name: 'Steel Longsword',
        damage: '1d8',
        range: 'Melee',
        trait: 'Strength',
        features: ['Physical', 'Reliable'],
      },
      {
        name: 'Composite Bow',
        damage: '1d8',
        range: 'Far',
        trait: 'Finesse',
        features: ['Physical'],
      },
      {
        name: 'Crystal Wand',
        damage: '1d6',
        range: 'Close',
        trait: 'Knowledge',
        features: ['Magic', 'Channeling'],
      },
      {
        name: 'War Hammer',
        damage: '1d10',
        range: 'Melee',
        trait: 'Strength',
        features: ['Physical', 'Heavy'],
      },
      {
        name: 'Rapier',
        damage: '1d8',
        range: 'Melee',
        trait: 'Finesse',
        features: ['Physical', 'Quick'],
      },
    ],
    tier3: [
      {
        name: 'Enchanted Greatsword',
        damage: '2d6',
        range: 'Melee',
        trait: 'Strength',
        features: ['Magic', 'Brutal'],
      },
      {
        name: 'Arcane Longbow',
        damage: '1d10',
        range: 'Far',
        trait: 'Finesse',
        features: ['Magic', 'Reliable'],
      },
      {
        name: 'Staff of Elements',
        damage: '1d10',
        range: 'Close',
        trait: 'Knowledge',
        features: ['Magic', 'Channeling', 'Burning'],
      },
      {
        name: 'Shadow Daggers',
        damage: '1d8+1d6',
        range: 'Very Close',
        trait: 'Agility',
        features: ['Magic', 'Paired', 'Quick'],
      },
      {
        name: 'Warding Mace',
        damage: '1d10',
        range: 'Melee',
        trait: 'Strength',
        features: ['Magic', 'Protective'],
      },
    ],
    tier4: [
      {
        name: 'Vorpal Blade',
        damage: '2d8',
        range: 'Melee',
        trait: 'Strength',
        features: ['Magic', 'Sharp', 'Brutal'],
      },
      {
        name: 'Bow of the Stars',
        damage: '2d6',
        range: 'Far',
        trait: 'Finesse',
        features: ['Magic', 'Hopeful', 'Reliable'],
      },
      {
        name: 'Doomstaff',
        damage: '2d8',
        range: 'Close',
        trait: 'Knowledge',
        features: ['Magic', 'Channeling', 'Timeslowing'],
      },
      {
        name: 'Twin Phantoms',
        damage: '2d6',
        range: 'Very Close',
        trait: 'Agility',
        features: ['Magic', 'Paired', 'Quick', 'Shifting'],
      },
      {
        name: 'Titan Hammer',
        damage: '2d10',
        range: 'Melee',
        trait: 'Strength',
        features: ['Magic', 'Very Heavy', 'Brutal'],
      },
    ],
  },
  armor: {
    tier1: [
      {
        name: 'Leather Armor',
        feature: 'Flexible',
        thresholds: { major: 3, severe: 6 },
      },
      {
        name: 'Padded Vest',
        feature: 'Quiet',
        thresholds: { major: 2, severe: 5 },
      },
      {
        name: 'Chain Shirt',
        feature: 'Resilient',
        thresholds: { major: 4, severe: 7 },
      },
    ],
    tier2: [
      {
        name: 'Scale Mail',
        feature: 'Reinforced',
        thresholds: { major: 5, severe: 9 },
      },
      {
        name: 'Studded Leather',
        feature: 'Flexible',
        thresholds: { major: 4, severe: 8 },
      },
      {
        name: 'Breastplate',
        feature: 'Warded',
        thresholds: { major: 6, severe: 10 },
      },
    ],
    tier3: [
      {
        name: 'Mithril Chain',
        feature: 'Shifting',
        thresholds: { major: 7, severe: 12 },
      },
      {
        name: 'Dragon Scale',
        feature: 'Fortified',
        thresholds: { major: 8, severe: 13 },
      },
      {
        name: 'Enchanted Plate',
        feature: 'Impenetrable',
        thresholds: { major: 9, severe: 14 },
      },
    ],
    tier4: [
      {
        name: 'Celestial Armor',
        feature: 'Sheltering',
        thresholds: { major: 10, severe: 16 },
      },
      {
        name: 'Abyssal Plate',
        feature: 'Barrier',
        thresholds: { major: 12, severe: 18 },
      },
      {
        name: 'Phoenix Mantle',
        feature: 'Deflecting',
        thresholds: { major: 11, severe: 17 },
      },
    ],
  },
  consumables: {
    all: [
      {
        name: 'Healing Potion',
        description: 'Restore 1d6 HP',
        rarity: 'common' as const,
      },
      {
        name: 'Antidote',
        description: 'Remove Poisoned condition',
        rarity: 'common' as const,
      },
      {
        name: 'Smoke Bomb',
        description: 'Create cover in Very Close range',
        rarity: 'common' as const,
      },
      {
        name: 'Scroll of Protection',
        description: 'Gain +2 to evasion for one scene',
        rarity: 'uncommon' as const,
      },
      {
        name: 'Elixir of Courage',
        description: 'Gain advantage on next Presence roll',
        rarity: 'uncommon' as const,
      },
      {
        name: 'Greater Healing Potion',
        description: 'Restore 2d6 HP',
        rarity: 'rare' as const,
      },
      {
        name: 'Potion of Invisibility',
        description: 'Become invisible for one round',
        rarity: 'rare' as const,
      },
      {
        name: 'Phoenix Feather',
        description: 'Auto-revive at 1 HP once',
        rarity: 'legendary' as const,
      },
    ],
  },
  gold: {
    tier1: { min: 1, max: 5, denomination: 'handfuls' },
    tier2: { min: 3, max: 10, denomination: 'handfuls' },
    tier3: { min: 1, max: 5, denomination: 'bags' },
    tier4: { min: 2, max: 8, denomination: 'bags' },
  },
} satisfies {
  weapons: Record<Tier, WeaponEntry[]>;
  armor: Record<Tier, ArmorEntry[]>;
  consumables: { all: ConsumableEntry[] };
  gold: Record<Tier, GoldRange>;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rollGold(range: GoldRange): GeneratedGold {
  const amount =
    Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  return { type: 'gold', amount, denomination: range.denomination };
}

function generateItem(tier: Tier, category: Category): GeneratedItem {
  if (category === 'gold') {
    return rollGold(LOOT_TABLES.gold[tier]);
  }
  if (category === 'weapons') {
    return { type: 'weapon', item: pickRandom(LOOT_TABLES.weapons[tier]) };
  }
  if (category === 'armor') {
    return { type: 'armor', item: pickRandom(LOOT_TABLES.armor[tier]) };
  }
  if (category === 'consumables') {
    return {
      type: 'consumable',
      item: pickRandom(LOOT_TABLES.consumables.all),
    };
  }

  // "mixed" — pick a random category
  const categories: Category[] = ['weapons', 'armor', 'consumables', 'gold'];
  return generateItem(tier, pickRandom(categories));
}

function generateLoot(
  tier: Tier,
  count: number,
  category: Category
): GeneratedItem[] {
  return Array.from({ length: count }, () => generateItem(tier, category));
}

// ─── Rarity colors ──────────────────────────────────────────────────────────

const RARITY_CLASSES: Record<Rarity, string> = {
  common: 'bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200',
  uncommon:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  rare: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  legendary:
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
};

// ─── Clipboard formatting ───────────────────────────────────────────────────

function formatItemText(item: GeneratedItem): string {
  switch (item.type) {
    case 'weapon':
      return `⚔️ ${item.item.name} — ${item.item.damage} (${item.item.range}) [${item.item.trait}] Features: ${item.item.features.join(', ')}`;
    case 'armor':
      return `🛡️ ${item.item.name} — ${item.item.feature} | Major ${item.item.thresholds.major} / Severe ${item.item.thresholds.severe}`;
    case 'consumable':
      return `🧪 ${item.item.name} (${item.item.rarity}) — ${item.item.description}`;
    case 'gold':
      return `💰 ${item.amount} ${item.denomination} of gold`;
  }
}

function formatLootText(items: GeneratedItem[]): string {
  return ['=== Loot Drop ===', ...items.map(formatItemText)].join('\n');
}

// ─── Item Cards ──────────────────────────────────────────────────────────────

function WeaponCard({ item }: { item: WeaponEntry }) {
  return (
    <Card className="gap-3 py-4">
      <CardHeader className="gap-1 pb-0">
        <div className="flex items-center gap-2">
          <Sword className="size-4 shrink-0 text-orange-500" />
          <CardTitle className="text-sm">{item.name}</CardTitle>
        </div>
        <Badge variant="outline" className="w-fit text-xs">
          Weapon
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
          <span>
            Damage: <strong className="text-foreground">{item.damage}</strong>
          </span>
          <span>
            Range: <strong className="text-foreground">{item.range}</strong>
          </span>
          <span>
            Trait: <strong className="text-foreground">{item.trait}</strong>
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {item.features.map(f => (
            <Badge key={f} variant="secondary" className="text-xs">
              {f}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ArmorCard({ item }: { item: ArmorEntry }) {
  return (
    <Card className="gap-3 py-4">
      <CardHeader className="gap-1 pb-0">
        <div className="flex items-center gap-2">
          <Shield className="size-4 shrink-0 text-sky-500" />
          <CardTitle className="text-sm">{item.name}</CardTitle>
        </div>
        <Badge variant="outline" className="w-fit text-xs">
          Armor
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
          <span>
            Feature: <strong className="text-foreground">{item.feature}</strong>
          </span>
        </div>
        <div className="text-muted-foreground flex gap-3">
          <span>
            Major:{' '}
            <strong className="text-foreground">{item.thresholds.major}</strong>
          </span>
          <span>
            Severe:{' '}
            <strong className="text-foreground">
              {item.thresholds.severe}
            </strong>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function ConsumableCard({ item }: { item: ConsumableEntry }) {
  return (
    <Card className="gap-3 py-4">
      <CardHeader className="gap-1 pb-0">
        <div className="flex items-center gap-2">
          <FlaskConical className="size-4 shrink-0 text-emerald-500" />
          <CardTitle className="text-sm">{item.name}</CardTitle>
        </div>
        <Badge
          className={cn(
            'w-fit border-transparent text-xs',
            RARITY_CLASSES[item.rarity]
          )}
        >
          {item.rarity}
        </Badge>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        {item.description}
      </CardContent>
    </Card>
  );
}

function GoldCard({
  amount,
  denomination,
}: {
  amount: number;
  denomination: string;
}) {
  return (
    <Card className="gap-3 py-4">
      <CardHeader className="gap-1 pb-0">
        <div className="flex items-center gap-2">
          <Coins className="size-4 shrink-0 text-amber-500" />
          <CardTitle className="text-sm">Gold</CardTitle>
        </div>
        <Badge variant="outline" className="w-fit text-xs">
          Currency
        </Badge>
      </CardHeader>
      <CardContent className="text-sm">
        <span className="font-semibold text-amber-600 dark:text-amber-400">
          {amount} {denomination}
        </span>{' '}
        of gold
      </CardContent>
    </Card>
  );
}

function LootItemCard({ item }: { item: GeneratedItem }) {
  switch (item.type) {
    case 'weapon':
      return <WeaponCard item={item.item} />;
    case 'armor':
      return <ArmorCard item={item.item} />;
    case 'consumable':
      return <ConsumableCard item={item.item} />;
    case 'gold':
      return <GoldCard amount={item.amount} denomination={item.denomination} />;
  }
}

// ─── Main Component ──────────────────────────────────────────────────────────

const TIER_OPTIONS = [
  { value: 'tier1', label: 'Tier 1' },
  { value: 'tier2', label: 'Tier 2' },
  { value: 'tier3', label: 'Tier 3' },
  { value: 'tier4', label: 'Tier 4' },
] as const;

const CATEGORY_OPTIONS = [
  { value: 'mixed', label: 'Mixed' },
  { value: 'weapons', label: 'Weapons' },
  { value: 'armor', label: 'Armor' },
  { value: 'consumables', label: 'Consumables' },
  { value: 'gold', label: 'Gold Only' },
] as const;

export default function LootGenerator() {
  const [open, setOpen] = useState(false);
  const [tier, setTier] = useState<Tier>('tier1');
  const [count, setCount] = useState(3);
  const [category, setCategory] = useState<Category>('mixed');
  const [results, setResults] = useState<GeneratedItem[]>([]);
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(() => {
    const clamped = Math.max(1, Math.min(5, count));
    setResults(generateLoot(tier, clamped, category));
    setCopied(false);
  }, [tier, count, category]);

  const handleCopy = useCallback(async () => {
    if (results.length === 0) return;
    await copyToClipboard(formatLootText(results), 'Loot copied to clipboard!');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [results]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Gift className="mr-2 size-4" />
          Generate Loot
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Loot Drop Generator</DialogTitle>
          <DialogDescription>
            Generate random loot for your Daggerheart session.
          </DialogDescription>
        </DialogHeader>

        {/* Controls */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="loot-tier">Tier</Label>
            <Select value={tier} onValueChange={v => setTier(v as Tier)}>
              <SelectTrigger id="loot-tier" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIER_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="loot-count">Items</Label>
            <Input
              id="loot-count"
              type="number"
              min={1}
              max={5}
              value={count}
              onChange={e => setCount(Number(e.target.value))}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="loot-category">Category</Label>
            <Select
              value={category}
              onValueChange={v => setCategory(v as Category)}
            >
              <SelectTrigger id="loot-category" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleGenerate} className="w-full">
          <Dices className="mr-2 size-4" />
          {results.length > 0 ? 'Roll Again' : 'Generate'}
        </Button>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              {results.map((item, idx) => (
                <LootItemCard key={idx} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        {results.length > 0 && (
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="mr-2 size-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-2 size-4" />
                  Copy to Clipboard
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
