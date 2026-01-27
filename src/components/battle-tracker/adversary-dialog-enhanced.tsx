import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Crosshair,
  Filter,
  Heart,
  Plus,
  Search,
  Shield,
  Skull,
  Swords,
  X,
  Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Adversary } from '@/lib/schemas/adversaries';

const TIER_OPTIONS = ['All', '1', '2', '3', '4'] as const;
const ROLE_OPTIONS = [
  'All',
  'Bruiser',
  'Horde',
  'Leader',
  'Minion',
  'Ranged',
  'Skulk',
  'Social',
  'Solo',
  'Standard',
  'Support',
] as const;

// ============== Style Constants ==============

const TIER_COLORS: Record<string, string> = {
  '1': 'bg-green-500/20 text-green-700 dark:text-green-400',
  '2': 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
  '3': 'bg-orange-500/20 text-orange-700 dark:text-orange-400',
  '4': 'bg-red-500/20 text-red-700 dark:text-red-400',
};

const ROLE_ICONS: Record<string, string> = {
  Bruiser: '💪',
  Horde: '👥',
  Leader: '👑',
  Minion: '🐀',
  Ranged: '🎯',
  Skulk: '🥷',
  Social: '💬',
  Solo: '⭐',
  Standard: '⚔️',
  Support: '🛡️',
};

const FEATURE_TYPE_COLORS: Record<string, string> = {
  Passive: 'bg-gray-500/20 text-gray-700 dark:text-gray-300',
  Action: 'bg-green-500/20 text-green-700 dark:text-green-400',
  Reaction: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
  Feature: 'bg-purple-500/20 text-purple-700 dark:text-purple-400',
};

// ============== Helper Components ==============

function AdversaryBadge({ adversary }: { adversary: Adversary }) {
  const thresholdDisplay =
    typeof adversary.thresholds === 'string'
      ? adversary.thresholds
      : `${adversary.thresholds.major}/${adversary.thresholds.severe}${adversary.thresholds.massive ? `/${adversary.thresholds.massive}` : ''}`;

  return (
    <div className="mt-1 flex flex-wrap gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={`text-xs ${TIER_COLORS[adversary.tier] ?? ''}`}>
            T{adversary.tier}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>Tier {adversary.tier}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className="text-xs">
            <Crosshair className="mr-1 size-3" />
            {adversary.difficulty}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>Difficulty to hit</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className="text-xs text-red-600 dark:text-red-400"
          >
            <Heart className="mr-1 size-3" />
            {adversary.hp}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>Hit Points</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className="text-xs text-purple-600 dark:text-purple-400"
          >
            <Zap className="mr-1 size-3" />
            {adversary.stress}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>Stress</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className="text-xs text-amber-600 dark:text-amber-400"
          >
            <Shield className="mr-1 size-3" />
            {thresholdDisplay}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>Damage Thresholds (Major/Severe)</TooltipContent>
      </Tooltip>
    </div>
  );
}

function AdversaryAttackPanel({ attack }: { attack: Adversary['attack'] }) {
  return (
    <div className="rounded-md border border-red-500/20 bg-red-500/10 p-2">
      <p className="flex items-center gap-1 text-xs font-medium text-red-700 dark:text-red-400">
        <Swords className="size-3" /> Attack
      </p>
      <p className="text-foreground mt-1 text-sm font-medium">{attack.name}</p>
      <p className="text-muted-foreground text-xs">
        {attack.modifier} · {attack.range} · {attack.damage}
      </p>
    </div>
  );
}

function AdversaryThresholdsPanel({
  thresholds,
}: {
  thresholds: Adversary['thresholds'];
}) {
  return (
    <div className="rounded-md border border-blue-500/20 bg-blue-500/10 p-2">
      <p className="flex items-center gap-1 text-xs font-medium text-blue-700 dark:text-blue-400">
        <Shield className="size-3" /> Damage Thresholds
      </p>
      <p className="text-foreground mt-1 text-sm font-medium">
        {typeof thresholds === 'string' ? (
          thresholds
        ) : (
          <>
            Major:{' '}
            <span className="text-yellow-600 dark:text-yellow-400">
              {thresholds.major}
            </span>
            {' / '}Severe:{' '}
            <span className="text-red-600 dark:text-red-400">
              {thresholds.severe}
            </span>
            {thresholds.massive && (
              <>
                {' '}
                / Massive:{' '}
                <span className="text-purple-600 dark:text-purple-400">
                  {thresholds.massive}
                </span>
              </>
            )}
          </>
        )}
      </p>
    </div>
  );
}

type AdversaryFeature =
  | string
  | { name: string; type?: string; description?: string };

function getFeatureType(f: AdversaryFeature): string {
  if (typeof f === 'string') {
    if (f.includes('Passive')) return 'Passive';
    if (f.includes('Action')) return 'Action';
    if (f.includes('Reaction')) return 'Reaction';
    return 'Feature';
  }
  return f.type ?? 'Feature';
}

function AdversaryFeatureItem({ feature }: { feature: AdversaryFeature }) {
  const featureName =
    typeof feature === 'string' ? feature.split(' - ')[0] : feature.name;
  const featureDesc =
    typeof feature === 'string' ? feature : feature.description;
  const featureType = getFeatureType(feature);

  return (
    <li className="bg-background/50 rounded-md border p-2">
      <div className="mb-1 flex items-center gap-2">
        <Badge
          className={`text-xs ${FEATURE_TYPE_COLORS[featureType] ?? FEATURE_TYPE_COLORS.Feature}`}
        >
          {featureType}
        </Badge>
        <span className="text-sm font-medium">{featureName}</span>
      </div>
      <p className="text-muted-foreground text-xs leading-relaxed">
        {featureDesc}
      </p>
    </li>
  );
}

const GM_COMBAT_TIPS = [
  {
    title: 'Spotlight Flow',
    content:
      'Combat follows the spotlight—no initiative. GM moves trigger on Fear or failed rolls. Use narrative cues to engage all players.',
  },
  {
    title: 'Fear Spending',
    content:
      'Spend Fear to add Experience bonuses to adversary rolls, trigger reactions, or use Fear Features for dramatic moments.',
  },
  {
    title: 'Adversary Actions',
    content:
      "Adversaries don't make action rolls unless a feature requires it. They act on GM turns or when Fear is spent.",
  },
  {
    title: 'Battle Points',
    content:
      'Encounter budget: (3 × PC count) + 2. Solo costs 4pts, Standard 2pts, Minion 1pt. Adjust for difficulty.',
  },
  {
    title: 'Thresholds',
    content:
      'Compare damage to Major/Severe. Spend armor slots to reduce severity. Higher tiers = tougher foes.',
  },
];

interface AddAdversaryDialogEnhancedProps {
  isOpen: boolean;
  adversaries: Adversary[];
  onOpenChange: (open: boolean) => void;
  onAdd: (adversary: Adversary) => void;
}

export function AddAdversaryDialogEnhanced({
  isOpen,
  adversaries,
  onOpenChange,
  onAdd,
}: AddAdversaryDialogEnhancedProps) {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('All');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return adversaries.filter(adv => {
      const matchesSearch =
        search === '' ||
        adv.name.toLowerCase().includes(search.toLowerCase()) ||
        adv.description.toLowerCase().includes(search.toLowerCase());
      const matchesTier = tierFilter === 'All' || adv.tier === tierFilter;
      const matchesRole = roleFilter === 'All' || adv.role === roleFilter;
      return matchesSearch && matchesTier && matchesRole;
    });
  }, [adversaries, search, tierFilter, roleFilter]);

  const activeFilters =
    (tierFilter !== 'All' ? 1 : 0) + (roleFilter !== 'All' ? 1 : 0);

  const clearFilters = () => {
    setTierFilter('All');
    setRoleFilter('All');
    setSearch('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-7xl flex-col gap-0 p-0">
        <DialogHeader className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Add Adversary</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHelp(!showHelp)}
              className="gap-1.5"
            >
              <BookOpen className="size-4" />
              {showHelp ? 'Hide' : 'GM'} Help
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Main Content */}
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            {/* Search and Filters */}
            <div className="space-y-3 border-b p-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                  <Input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name or description..."
                    className="pl-9"
                  />
                </div>
                <Button
                  variant={showFilters ? 'secondary' : 'outline'}
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                  className="relative"
                >
                  <Filter className="size-4" />
                  {activeFilters > 0 && (
                    <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-xs">
                      {activeFilters}
                    </span>
                  )}
                </Button>
                {activeFilters > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="mr-1 size-3" /> Clear
                  </Button>
                )}
              </div>

              {showFilters && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Tier</Label>
                    <Select value={tierFilter} onValueChange={setTierFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIER_OPTIONS.map(t => (
                          <SelectItem key={t} value={t}>
                            {t === 'All' ? 'All Tiers' : `Tier ${t}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Role</Label>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLE_OPTIONS.map(r => (
                          <SelectItem key={r} value={r}>
                            {r === 'All' ? 'All Roles' : r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            {/* Results */}
            <ScrollArea className="min-h-0 flex-1">
              <div className="p-4">
                <p className="text-muted-foreground mb-3 text-sm">
                  {filtered.length} adversar
                  {filtered.length === 1 ? 'y' : 'ies'} found
                </p>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filtered.map(adv => (
                    <AdversaryResultCard
                      key={adv.name}
                      adversary={adv}
                      isExpanded={expandedId === adv.name}
                      onToggle={() =>
                        setExpandedId(expandedId === adv.name ? null : adv.name)
                      }
                      onAdd={() => onAdd(adv)}
                    />
                  ))}
                </div>
                {filtered.length === 0 && (
                  <div className="text-muted-foreground py-12 text-center">
                    No adversaries match your search
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Help Sidebar */}
          {showHelp && (
            <div className="hidden w-80 flex-col border-l md:flex">
              <div className="bg-muted/30 border-b px-4 py-3">
                <h3 className="font-semibold">Combat Quick Reference</h3>
                <p className="text-muted-foreground text-xs">
                  Daggerheart GM tips
                </p>
              </div>
              <ScrollArea className="flex-1">
                <div className="space-y-3 p-4">
                  {GM_COMBAT_TIPS.map(tip => (
                    <div key={tip.title} className="space-y-1">
                      <p className="text-sm font-medium">{tip.title}</p>
                      <p className="text-muted-foreground text-xs">
                        {tip.content}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AdversaryResultCard({
  adversary,
  isExpanded,
  onToggle,
  onAdd,
}: {
  adversary: Adversary;
  isExpanded: boolean;
  onToggle: () => void;
  onAdd: () => void;
}) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        <Collapsible open={isExpanded} onOpenChange={onToggle}>
          <div className="flex items-start gap-2 p-3">
            <CollapsibleTrigger asChild>
              <button className="flex min-w-0 flex-1 items-center gap-3 text-left">
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="shrink-0 text-lg" title={adversary.role}>
                      {ROLE_ICONS[adversary.role] ?? '⚔️'}
                    </span>
                    <p className="truncate text-sm font-semibold">
                      {adversary.name}
                    </p>
                  </div>
                  <AdversaryBadge adversary={adversary} />
                </div>
                {isExpanded ? (
                  <ChevronUp className="text-muted-foreground size-4 shrink-0" />
                ) : (
                  <ChevronDown className="text-muted-foreground size-4 shrink-0" />
                )}
              </button>
            </CollapsibleTrigger>
            <Button size="icon" onClick={onAdd} className="size-8 shrink-0">
              <Plus className="size-4" />
            </Button>
          </div>
          <CollapsibleContent>
            <Separator />
            <div className="bg-muted/30 space-y-3 p-3 pt-3">
              <p className="text-muted-foreground text-sm">
                {adversary.description}
              </p>

              {adversary.motivesAndTactics && (
                <div className="rounded-md border border-amber-500/20 bg-amber-500/10 p-2">
                  <p className="flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                    <Skull className="size-3" /> Motives & Tactics
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {adversary.motivesAndTactics}
                  </p>
                </div>
              )}

              <div className="grid gap-2 sm:grid-cols-2">
                <AdversaryAttackPanel attack={adversary.attack} />
                <AdversaryThresholdsPanel thresholds={adversary.thresholds} />
              </div>

              {adversary.experiences && adversary.experiences.length > 0 && (
                <div>
                  <p className="mb-1 text-xs font-medium">Experiences</p>
                  <div className="flex flex-wrap gap-1">
                    {adversary.experiences.map((exp, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {typeof exp === 'string'
                          ? exp
                          : `${exp.name} +${exp.bonus}`}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {adversary.features.length > 0 && (
                <div>
                  <p className="mb-2 flex items-center gap-1 text-xs font-medium">
                    <Zap className="size-3" /> Features (
                    {adversary.features.length})
                  </p>
                  <ul className="space-y-2">
                    {adversary.features.map((f, i) => (
                      <AdversaryFeatureItem key={i} feature={f} />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
