/**
 * AddAdversaryDialog Section Components
 *
 * Extracted section components for AddAdversaryDialogEnhanced to reduce complexity.
 */
import { Check, Filter, Search, Trash2, X } from 'lucide-react';

import { AdversarySelectCard } from '@/components/battle-tracker/adversary-card-shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { TIERS } from '@/lib/constants';
import type { Adversary } from '@/lib/schemas/adversaries';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

export const TIER_OPTIONS = ['All', ...TIERS] as const;
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

export { GM_COMBAT_TIPS, ROLE_OPTIONS };

// ─────────────────────────────────────────────────────────────────────────────
// Search and Filters Section
// ─────────────────────────────────────────────────────────────────────────────

interface SearchFiltersSectionProps {
  search: string;
  tierFilter: string;
  roleFilter: string;
  showFilters: boolean;
  activeFilters: number;
  onSearchChange: (value: string) => void;
  onTierChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onToggleFilters: () => void;
  onClearFilters: () => void;
}

export function SearchFiltersSection({
  search,
  tierFilter,
  roleFilter,
  showFilters,
  activeFilters,
  onSearchChange,
  onTierChange,
  onRoleChange,
  onToggleFilters,
  onClearFilters,
}: SearchFiltersSectionProps) {
  return (
    <div className="space-y-3 border-b p-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search by name or description..."
            className="pl-9"
          />
        </div>
        <Button
          variant={showFilters ? 'secondary' : 'outline'}
          size="icon"
          onClick={onToggleFilters}
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
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="mr-1 size-3" /> Clear
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Tier</Label>
            <Select value={tierFilter} onValueChange={onTierChange}>
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
            <Select value={roleFilter} onValueChange={onRoleChange}>
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
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Results Grid Section
// ─────────────────────────────────────────────────────────────────────────────

interface ResultsGridSectionProps {
  filtered: Adversary[];
  totalSelected: number;
  expandedId: string | null;
  viewingAdversary: Adversary | null;
  selections: Map<string, number>;
  onViewAdversary: (adversary: Adversary) => void;
  onToggleExpand: (name: string) => void;
  onIncrement: (name: string) => void;
  onDecrement: (name: string) => void;
}

export function ResultsGridSection({
  filtered,
  totalSelected,
  expandedId,
  viewingAdversary,
  selections,
  onViewAdversary,
  onToggleExpand,
  onIncrement,
  onDecrement,
}: ResultsGridSectionProps) {
  return (
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
              onClick={() => onViewAdversary(adv)}
              className={cn(
                'cursor-pointer rounded-lg transition-all',
                viewingAdversary?.name === adv.name && 'ring-primary ring-2'
              )}
            >
              <AdversarySelectCard
                adversary={adv}
                isExpanded={expandedId === adv.name}
                selectedCount={selections.get(adv.name) ?? 0}
                onToggleExpand={() => onToggleExpand(adv.name)}
                onIncrement={() => onIncrement(adv.name)}
                onDecrement={() => onDecrement(adv.name)}
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
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Selection Panel Section
// ─────────────────────────────────────────────────────────────────────────────

interface SelectionPanelSectionProps {
  selections: Map<string, number>;
  totalSelected: number;
  onRemove: (name: string) => void;
  onClearAll: () => void;
  onAddSelected: () => void;
}

export function SelectionPanelSection({
  selections,
  totalSelected,
  onRemove,
  onClearAll,
  onAddSelected,
}: SelectionPanelSectionProps) {
  if (totalSelected === 0) return null;

  return (
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
                onClick={() => onRemove(name)}
                className="hover:bg-muted rounded p-0.5"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            <Trash2 className="mr-1 size-3" />
            Clear
          </Button>
          <Button size="sm" onClick={onAddSelected}>
            <Check className="mr-1 size-4" />
            Add {totalSelected} Adversar
            {totalSelected === 1 ? 'y' : 'ies'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Help Sidebar Section
// ─────────────────────────────────────────────────────────────────────────────

interface HelpSidebarSectionProps {
  show: boolean;
  viewingAdversary: Adversary | null;
}

export function HelpSidebarSection({
  show,
  viewingAdversary,
}: HelpSidebarSectionProps) {
  if (!show || viewingAdversary) return null;

  return (
    <div className="hidden min-h-0 w-80 flex-col border-l md:flex">
      <div className="bg-muted/30 shrink-0 border-b px-4 py-3">
        <h3 className="font-semibold">Combat Quick Reference</h3>
        <p className="text-muted-foreground text-xs">Daggerheart GM tips</p>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-3 p-4">
          {GM_COMBAT_TIPS.map(tip => (
            <div key={tip.title} className="space-y-1">
              <p className="text-sm font-medium">{tip.title}</p>
              <p className="text-muted-foreground text-xs">{tip.content}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
