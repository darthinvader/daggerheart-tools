import {
  BookOpen,
  Check,
  Filter,
  PlusCircle,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { AdversarySelectCard } from '@/components/battle-tracker/adversary-card-shared';
import { AdversaryDetailPanel } from '@/components/battle-tracker/adversary-detail-panel';
import { CustomAdversaryBuilder } from '@/components/battle-tracker/custom-adversary-builder';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import type { Adversary } from '@/lib/schemas/adversaries';
import { cn } from '@/lib/utils';

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
  // Selection state: Map of adversary name → quantity to add
  const [selections, setSelections] = useState<Map<string, number>>(new Map());
  // Detail panel state
  const [viewingAdversary, setViewingAdversary] = useState<Adversary | null>(
    null
  );
  // Custom builder state
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);
  // Custom adversaries added during this session
  const [customAdversaries, setCustomAdversaries] = useState<Adversary[]>([]);

  // Combine SRD adversaries with custom ones
  const allAdversaries = useMemo(() => {
    return [...customAdversaries, ...adversaries];
  }, [adversaries, customAdversaries]);

  const filtered = useMemo(() => {
    return allAdversaries.filter(adv => {
      const matchesSearch =
        search === '' ||
        adv.name.toLowerCase().includes(search.toLowerCase()) ||
        adv.description.toLowerCase().includes(search.toLowerCase());
      const matchesTier = tierFilter === 'All' || adv.tier === tierFilter;
      const matchesRole = roleFilter === 'All' || adv.role === roleFilter;
      return matchesSearch && matchesTier && matchesRole;
    });
  }, [allAdversaries, search, tierFilter, roleFilter]);

  const activeFilters =
    (tierFilter !== 'All' ? 1 : 0) + (roleFilter !== 'All' ? 1 : 0);

  const clearFilters = () => {
    setTierFilter('All');
    setRoleFilter('All');
    setSearch('');
  };

  const updateSelection = useCallback((name: string, delta: number) => {
    setSelections(prev => {
      const next = new Map(prev);
      const current = next.get(name) ?? 0;
      const newCount = current + delta;
      if (newCount <= 0) {
        next.delete(name);
      } else {
        next.set(name, newCount);
      }
      return next;
    });
  }, []);

  const removeSelection = useCallback((name: string) => {
    setSelections(prev => {
      const next = new Map(prev);
      next.delete(name);
      return next;
    });
  }, []);

  const clearAllSelections = useCallback(() => {
    setSelections(new Map());
  }, []);

  const totalSelected = useMemo(() => {
    let total = 0;
    selections.forEach(count => {
      total += count;
    });
    return total;
  }, [selections]);

  const handleAddSelected = useCallback(() => {
    selections.forEach((count, name) => {
      const adv = allAdversaries.find(a => a.name === name);
      if (adv) {
        for (let i = 0; i < count; i++) {
          onAdd(adv);
        }
      }
    });
    setSelections(new Map());
    onOpenChange(false);
  }, [selections, allAdversaries, onAdd, onOpenChange]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        setSelections(new Map());
        setViewingAdversary(null);
      }
      onOpenChange(open);
    },
    [onOpenChange]
  );

  const handleAddCustomAdversary = useCallback((adversary: Adversary) => {
    setCustomAdversaries(prev => [adversary, ...prev]);
    // Auto-select the custom adversary
    setSelections(prev => {
      const next = new Map(prev);
      next.set(adversary.name, 1);
      return next;
    });
    setShowCustomBuilder(false);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-[95vw] flex-col gap-0 p-0">
        <DialogHeader className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Add Adversaries</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCustomBuilder(true)}
                className="gap-1.5"
              >
                <PlusCircle className="size-4" />
                Custom
              </Button>
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
          </div>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Main Content */}
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
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
                  {totalSelected > 0 && (
                    <span className="text-primary ml-2 font-medium">
                      · {totalSelected} selected
                    </span>
                  )}
                </p>
                <div
                  className={cn(
                    'grid gap-3 sm:grid-cols-2',
                    viewingAdversary ? 'lg:grid-cols-2' : 'lg:grid-cols-3'
                  )}
                >
                  {filtered.map(adv => (
                    <div
                      key={adv.name}
                      onClick={() => setViewingAdversary(adv)}
                      className={cn(
                        'cursor-pointer rounded-lg transition-all',
                        viewingAdversary?.name === adv.name &&
                          'ring-primary ring-2'
                      )}
                    >
                      <AdversarySelectCard
                        adversary={adv}
                        isExpanded={expandedId === adv.name}
                        selectedCount={selections.get(adv.name) ?? 0}
                        onToggleExpand={() =>
                          setExpandedId(
                            expandedId === adv.name ? null : adv.name
                          )
                        }
                        onIncrement={() => updateSelection(adv.name, 1)}
                        onDecrement={() => updateSelection(adv.name, -1)}
                      />
                    </div>
                  ))}
                </div>
                {filtered.length === 0 && (
                  <div className="text-muted-foreground py-12 text-center">
                    No adversaries match your search
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Selection Panel */}
            {totalSelected > 0 && (
              <div className="bg-muted/50 border-t p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-muted-foreground text-sm font-medium">
                    Selected:
                  </span>
                  <div className="flex flex-1 flex-wrap gap-2">
                    {Array.from(selections.entries()).map(([name, count]) => (
                      <Badge
                        key={name}
                        variant="secondary"
                        className="gap-1.5 py-1 pr-1 pl-2"
                      >
                        <span>
                          {name} ×{count}
                        </span>
                        <button
                          onClick={() => removeSelection(name)}
                          className="hover:bg-muted rounded p-0.5"
                        >
                          <X className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllSelections}
                    >
                      <Trash2 className="mr-1 size-3" />
                      Clear
                    </Button>
                    <Button size="sm" onClick={handleAddSelected}>
                      <Check className="mr-1 size-4" />
                      Add {totalSelected} Adversar
                      {totalSelected === 1 ? 'y' : 'ies'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Adversary Detail Panel */}
          {viewingAdversary && (
            <AdversaryDetailPanel
              adversary={viewingAdversary}
              onClose={() => setViewingAdversary(null)}
              onAdd={() => updateSelection(viewingAdversary.name, 1)}
              canAdd
            />
          )}

          {/* Help Sidebar */}
          {showHelp && !viewingAdversary && (
            <div className="hidden min-h-0 w-80 flex-col border-l md:flex">
              <div className="bg-muted/30 shrink-0 border-b px-4 py-3">
                <h3 className="font-semibold">Combat Quick Reference</h3>
                <p className="text-muted-foreground text-xs">
                  Daggerheart GM tips
                </p>
              </div>
              <ScrollArea className="min-h-0 flex-1">
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

      <CustomAdversaryBuilder
        isOpen={showCustomBuilder}
        onOpenChange={setShowCustomBuilder}
        onSave={handleAddCustomAdversary}
      />
    </Dialog>
  );
}
