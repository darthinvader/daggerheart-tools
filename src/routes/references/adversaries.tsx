// Adversaries reference page with page-specific detail components

import {
  createFileRoute,
  type ErrorComponentProps,
} from '@tanstack/react-router';
import { ArrowDown, ArrowUp, Search, X } from 'lucide-react';
import * as React from 'react';

import {
  BackToTop,
  DetailCloseButton,
  KeyboardHint,
  ReferencePageSkeleton,
  ResultsCounter,
  useDeferredItems,
  useDeferredLoad,
  useKeyboardNavigation,
} from '@/components/references';
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { ADVERSARIES } from '@/lib/data/adversaries';
import {
  AdversaryRoleIcons,
  AdversaryTierIcons,
  AlertTriangle,
  Brain,
  Compass,
  DynamicIcon,
  getIcon,
  Heart,
  Layers,
  Skull,
  Sparkles,
  Swords,
  Target,
} from '@/lib/icons';
import type { Adversary } from '@/lib/schemas/adversaries';

export const Route = createFileRoute('/references/adversaries')({
  component: AdversariesReferencePage,
  pendingComponent: () => <ReferencePageSkeleton showFilters={false} />,
  errorComponent: ({ error }: ErrorComponentProps) => (
    <div className="text-destructive p-6">Error: {error.message}</div>
  ),
});

type AdversaryItem = (typeof ADVERSARIES)[number];

const tierOrder: Adversary['tier'][] = ['1', '2', '3', '4'];

const roleColors: Record<string, string> = {
  Bruiser:
    'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40',
  Horde: 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/40',
  Leader:
    'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/40',
  Minion:
    'bg-slate-500/20 text-slate-700 dark:text-slate-300 border-slate-500/40',
  Ranged: 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/40',
  Skulk: 'bg-zinc-500/20 text-zinc-700 dark:text-zinc-300 border-zinc-500/40',
  Social:
    'bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/40',
  Solo: 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/40',
  Standard:
    'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/40',
  Support:
    'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/40',
};

const tierColors: Record<Adversary['tier'], string> = {
  '1': 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40',
  '2': 'bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-500/40',
  '3': 'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/40',
  '4': 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/40',
};

const defaultBadgeColor = 'bg-muted/50 text-foreground border-border';

// Text labels for select options (can't use icons in <option> elements)
const tierLabels: Record<Adversary['tier'], string> = {
  '1': '[T1]',
  '2': '[T2]',
  '3': '[T3]',
  '4': '[T4]',
};

const roleLabels: Record<string, string> = {
  Bruiser: '●',
  Horde: '●',
  Leader: '●',
  Minion: '●',
  Ranged: '●',
  Skulk: '●',
  Social: '●',
  Solo: '●',
  Standard: '●',
  Support: '●',
};

// Icon helper components for badges
function RoleIcon({
  role,
  className = 'size-3 mr-1',
}: {
  role: string;
  className?: string;
}) {
  const icon = getIcon(AdversaryRoleIcons, role, 'default');
  return <DynamicIcon icon={icon} className={className} />;
}

function TierIcon({
  tier,
  className = 'size-3 mr-1',
}: {
  tier: string;
  className?: string;
}) {
  const icon = getIcon(AdversaryTierIcons, tier);
  return <DynamicIcon icon={icon} className={className} />;
}

const roleDescriptions: Record<string, string> = {
  Bruiser: 'Tough adversaries that deliver powerful attacks.',
  Horde: 'Groups of identical creatures acting together as a single unit.',
  Leader: 'Command and summon other adversaries.',
  Minion: 'Easily dispatched but dangerous in numbers.',
  Ranged:
    'Fragile in close encounters but can attack from a distance for high damage.',
  Skulk: 'Maneuver and exploit opportunities to ambush opponents.',
  Social:
    'Present challenges to overcome through conversation rather than combat.',
  Solo: 'Formidable challenge to a whole party, with or without support.',
  Standard:
    'Rank-and-file adversaries representative of their fictional group.',
  Support: 'Enhance allies and disrupt opponents.',
};

function getRoleDescription(role: Adversary['role']) {
  return roleDescriptions[role] ?? 'Adversary role.';
}

interface TooltipLabelProps {
  label: string;
  tooltip: string;
  className?: string;
  labelIcon?: React.ComponentType<{ className?: string }>;
}

function TooltipLabel({
  label,
  tooltip,
  className,
  labelIcon: LabelIcon,
}: TooltipLabelProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={`cursor-help underline decoration-dotted underline-offset-2 ${className ?? ''}`}
        >
          {LabelIcon && <LabelIcon className="mr-1 inline-block size-3" />}
          {label}:
        </span>
      </TooltipTrigger>
      <TooltipContent sideOffset={6}>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

const loadAllAdversaries = () => [...ADVERSARIES];

type AdversarySortKey = 'name' | 'tier' | 'role';

const ADVERSARY_SORTERS: Record<
  AdversarySortKey,
  (a: AdversaryItem, b: AdversaryItem) => number
> = {
  name: (a, b) => a.name.localeCompare(b.name),
  tier: (a, b) => tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier),
  role: (a, b) => a.role.localeCompare(b.role),
};

function getAdversarySearchText(adversary: AdversaryItem) {
  const experiences = adversary.experiences
    .map(exp => formatExperience(exp).toLowerCase())
    .join(' ');
  const features = adversary.features
    .map(feature => formatFeature(feature).toLowerCase())
    .join(' ');
  return [
    adversary.name,
    adversary.description,
    adversary.motivesAndTactics,
    adversary.role,
    adversary.attack.name,
    experiences,
    features,
  ]
    .join(' ')
    .toLowerCase();
}

function filterAdversaries(
  items: AdversaryItem[],
  search: string,
  tierFilter: Adversary['tier'] | 'all',
  roleFilter: Adversary['role'] | 'all'
) {
  return items.filter(adversary => {
    if (tierFilter !== 'all' && adversary.tier !== tierFilter) return false;
    if (roleFilter !== 'all' && adversary.role !== roleFilter) return false;
    if (!search) return true;
    return getAdversarySearchText(adversary).includes(search.toLowerCase());
  });
}

function sortAdversaries(
  items: AdversaryItem[],
  sortBy: AdversarySortKey,
  sortDir: 'asc' | 'desc'
) {
  const sorted = [...items].sort(ADVERSARY_SORTERS[sortBy]);
  return sortDir === 'asc' ? sorted : sorted.reverse();
}

type AdversariesHeaderProps = {
  filteredCount: number;
  totalCount: number;
  tierFilter: Adversary['tier'] | 'all';
  roleFilter: Adversary['role'] | 'all';
  sortBy: AdversarySortKey;
  sortDir: 'asc' | 'desc';
  search: string;
  onTierFilterChange: (value: Adversary['tier'] | 'all') => void;
  onRoleFilterChange: (value: Adversary['role'] | 'all') => void;
  onSortByChange: (value: AdversarySortKey) => void;
  onSortDirChange: (value: 'asc' | 'desc') => void;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
};

function AdversariesHeader({
  filteredCount,
  totalCount,
  tierFilter,
  roleFilter,
  sortBy,
  sortDir,
  search,
  onTierFilterChange,
  onRoleFilterChange,
  onSortByChange,
  onSortDirChange,
  onSearchChange,
  onClearSearch,
}: AdversariesHeaderProps) {
  return (
    <div className="bg-background shrink-0 border-b px-4 py-3">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Skull className="size-4 text-red-500" />
              <span className="bg-linear-to-r from-red-500 to-rose-600 bg-clip-text text-transparent">
                Adversaries Reference
              </span>
            </div>
            <ResultsCounter
              filtered={filteredCount}
              total={totalCount}
              label="adversaries"
            />
          </div>
        </div>

        <div className="bg-muted/30 sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              placeholder="Search adversaries..."
              value={search}
              onChange={e => onSearchChange(e.target.value)}
              className="h-9 pr-9 pl-9"
            />
            {search && (
              <button
                onClick={onClearSearch}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <select
                value={tierFilter}
                onChange={e =>
                  onTierFilterChange(
                    e.target.value as Adversary['tier'] | 'all'
                  )
                }
                className="bg-background h-8 rounded-md border px-2 text-sm"
                aria-label="Filter by tier"
              >
                <option value="all">All tiers</option>
                {tierOrder.map(tier => (
                  <option key={tier} value={tier}>
                    {tierLabels[tier]} Tier {tier}
                  </option>
                ))}
              </select>
              <select
                value={roleFilter}
                onChange={e =>
                  onRoleFilterChange(
                    e.target.value as Adversary['role'] | 'all'
                  )
                }
                className="bg-background h-8 rounded-md border px-2 text-sm"
                aria-label="Filter by role"
              >
                <option value="all">All roles</option>
                {Object.keys(roleColors)
                  .sort((a, b) => a.localeCompare(b))
                  .map(role => (
                    <option key={role} value={role}>
                      {roleLabels[role] ?? '●'} {role}
                    </option>
                  ))}
              </select>
            </div>

            <div className="bg-border h-6 w-px" />

            <div className="flex items-center gap-1">
              <select
                value={sortBy}
                onChange={e =>
                  onSortByChange(e.target.value as AdversarySortKey)
                }
                className="bg-background h-8 rounded-md border px-2 text-sm"
                aria-label="Sort adversaries"
              >
                <option value="name">Name</option>
                <option value="tier">Tier</option>
                <option value="role">Role</option>
              </select>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() =>
                  onSortDirChange(sortDir === 'asc' ? 'desc' : 'asc')
                }
                aria-label={
                  sortDir === 'asc' ? 'Sort descending' : 'Sort ascending'
                }
              >
                {sortDir === 'asc' ? (
                  <ArrowUp className="size-4" />
                ) : (
                  <ArrowDown className="size-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdversariesGrid({
  items,
  isMobile,
  onSelect,
}: {
  items: AdversaryItem[];
  isMobile: boolean;
  onSelect: (adversary: AdversaryItem) => void;
}) {
  if (isMobile) {
    return (
      <div className="grid grid-cols-1 gap-3">
        {items.map(adversary => (
          <AdversaryCard
            key={adversary.name}
            adversary={adversary}
            compact
            onClick={() => onSelect(adversary)}
          />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map(adversary => (
        <AdversaryCard
          key={adversary.name}
          adversary={adversary}
          onClick={() => onSelect(adversary)}
        />
      ))}
    </div>
  );
}

function AdversariesEmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="text-muted-foreground py-12 text-center">
      <p>No adversaries match your filters.</p>
      <Button variant="link" onClick={onClear} className="mt-2">
        Clear filters
      </Button>
    </div>
  );
}

function AdversaryDetailSheet({
  selectedAdversary,
  onClose,
}: {
  selectedAdversary: AdversaryItem | null;
  onClose: () => void;
}) {
  return (
    <Sheet
      open={selectedAdversary !== null}
      onOpenChange={open => !open && onClose()}
    >
      <SheetContent
        side="right"
        className="flex w-full flex-col p-0 sm:max-w-lg"
        hideCloseButton
      >
        {selectedAdversary && (
          <>
            <SheetHeader className="bg-background shrink-0 border-b p-4">
              <SheetTitle className="flex items-center justify-between gap-2">
                <span className="truncate">{selectedAdversary.name}</span>
                <div className="flex shrink-0 items-center gap-2">
                  <KeyboardHint />
                  <DetailCloseButton onClose={onClose} />
                </div>
              </SheetTitle>
            </SheetHeader>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <AdversaryDetail adversary={selectedAdversary} />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function formatThresholds(thresholds: Adversary['thresholds']) {
  if (typeof thresholds === 'string') return thresholds;
  const major = thresholds.major ?? '—';
  const severe = thresholds.severe ?? '—';
  const massive =
    typeof thresholds.massive === 'number'
      ? thresholds.massive
      : typeof thresholds.severe === 'number'
        ? thresholds.severe * 2
        : '—';
  return `${major}/${severe}/${massive}`;
}

function formatExperience(exp: Adversary['experiences'][number]) {
  if (typeof exp === 'string') return exp;
  const bonus = exp.bonus >= 0 ? `+${exp.bonus}` : `${exp.bonus}`;
  const description = exp.description ? ` — ${exp.description}` : '';
  return `${exp.name} ${bonus}${description}`;
}

function formatFeature(feature: Adversary['features'][number]) {
  if (typeof feature === 'string') return feature;
  const type = feature.type ? `${feature.type}: ` : '';
  return `${feature.name} — ${type}${feature.description}`;
}

function AdversaryCard({
  adversary,
  compact = false,
  onClick,
}: {
  adversary: AdversaryItem;
  compact?: boolean;
  onClick: () => void;
}) {
  const tierBadge = tierColors[adversary.tier] ?? defaultBadgeColor;
  const roleBadge = roleColors[adversary.role] ?? defaultBadgeColor;

  return (
    <Card
      className="hover:border-primary/50 group h-full cursor-pointer overflow-hidden transition-all hover:scale-[1.01] hover:shadow-xl"
      onClick={onClick}
    >
      <div className="h-1 bg-linear-to-r from-red-500 via-rose-500 to-orange-500" />
      <CardHeader className={compact ? 'pb-2' : 'pb-3'}>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className={compact ? 'text-base' : 'text-xl'}>
            <Skull className="mr-2 inline-block size-4" />
            {adversary.name}
          </CardTitle>
          <Badge variant="outline" className={`text-xs ${tierBadge}`}>
            <TierIcon tier={adversary.tier} /> Tier {adversary.tier}
          </Badge>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className={`text-xs ${roleBadge}`}>
                <RoleIcon role={adversary.role} /> {adversary.role}
              </Badge>
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>
              {getRoleDescription(adversary.role)}
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent className={compact ? 'space-y-3 pt-0' : 'space-y-4'}>
        <div className="bg-card space-y-2 rounded-lg border p-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 text-[10px] font-semibold tracking-wide uppercase">
                <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-rose-700 dark:text-rose-300">
                  <Skull className="size-3" />
                  Overview
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>
              Quick summary of the adversary.
            </TooltipContent>
          </Tooltip>
          <CardDescription className={compact ? 'text-xs' : 'text-sm'}>
            {adversary.description}
          </CardDescription>
        </div>

        <div className="bg-muted/40 text-muted-foreground grid grid-cols-2 gap-2 rounded-lg border p-3 text-xs">
          <div className="col-span-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-300">
                  <Target className="size-3" />
                  Core Stats
                </div>
              </TooltipTrigger>
              <TooltipContent sideOffset={6}>
                Core combat stats and thresholds.
              </TooltipContent>
            </Tooltip>
          </div>
          <div>
            <TooltipLabel
              label="Difficulty"
              labelIcon={Target}
              tooltip="Target number to meet or beat on rolls against this adversary."
              className="font-semibold"
            />{' '}
            {adversary.difficulty}
          </div>
          <div>
            <TooltipLabel
              label="Thresholds"
              labelIcon={Layers}
              tooltip="Major/Severe/Massive damage thresholds. Massive is typically double Severe if not listed."
              className="font-semibold"
            />{' '}
            {formatThresholds(adversary.thresholds)}
          </div>
          <div>
            <TooltipLabel
              label="HP"
              labelIcon={Heart}
              tooltip="Hit Points tracked for defeating this adversary."
              className="font-semibold"
            />{' '}
            {adversary.hp}
          </div>
          <div>
            <TooltipLabel
              label="Stress"
              labelIcon={AlertTriangle}
              tooltip="Stress track used for special actions and reactions."
              className="font-semibold"
            />{' '}
            {adversary.stress}
          </div>
        </div>

        <div className="bg-card space-y-2 rounded-lg border p-3 text-xs">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-red-700 uppercase dark:text-red-300">
                <Swords className="size-3" />
                Attack
              </div>
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>
              Attack modifier, name, range, and damage.
            </TooltipContent>
          </Tooltip>
          <div className="text-muted-foreground text-[10px] font-semibold tracking-wide uppercase">
            Attack Profile
          </div>
          <div className="text-xs">
            <span className="text-foreground font-semibold">
              {adversary.attack.modifier} {adversary.attack.name}
            </span>
            <span className="text-muted-foreground"> · </span>
            <span>{adversary.attack.range}</span>
            <span className="text-muted-foreground"> · </span>
            <span>{adversary.attack.damage}</span>
          </div>
        </div>

        <div className="bg-card space-y-2 rounded-lg border p-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-blue-700 uppercase dark:text-blue-300">
                <Compass className="size-3" />
                Behavior
              </div>
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>
              How this adversary behaves in encounters.
            </TooltipContent>
          </Tooltip>
          <div className="text-muted-foreground text-[10px] font-semibold tracking-wide uppercase">
            Motives & Tactics
          </div>
          <p className="text-muted-foreground text-xs">
            {adversary.motivesAndTactics}
          </p>
        </div>

        {adversary.experiences.length > 0 && (
          <div className="bg-card space-y-2 rounded-lg border p-3 text-xs">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-violet-700 uppercase dark:text-violet-300">
                  <Brain className="size-3" />
                  Experiences
                </div>
              </TooltipTrigger>
              <TooltipContent sideOffset={6}>
                Training or background bonuses.
              </TooltipContent>
            </Tooltip>
            <ul className="text-muted-foreground list-disc space-y-1 pl-4">
              {adversary.experiences.map((experience, idx) => (
                <li key={idx}>{formatExperience(experience)}</li>
              ))}
            </ul>
          </div>
        )}

        {adversary.features.length > 0 && (
          <div className="bg-card space-y-2 rounded-lg border p-3 text-xs">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-300">
                  <Sparkles className="size-3" />
                  Features
                </div>
              </TooltipTrigger>
              <TooltipContent sideOffset={6}>
                Special actions, reactions, or passives.
              </TooltipContent>
            </Tooltip>
            <ul className="text-muted-foreground list-disc space-y-1 pl-4">
              {adversary.features.map((feature, idx) => (
                <li key={idx}>{formatFeature(feature)}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AdversaryDetailHeader({ adversary }: { adversary: AdversaryItem }) {
  return (
    <div className="-mx-4 -mt-4 bg-linear-to-r from-red-600 via-rose-600 to-orange-600 p-6">
      <div className="rounded-xl bg-black/25 p-4">
        <h2 className="text-2xl font-semibold text-white drop-shadow">
          <Skull className="mr-2 inline-block size-7" />
          {adversary.name}
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge className="border-slate-900/40 bg-slate-900/80 text-white">
            <TierIcon tier={adversary.tier} className="mr-1 size-4" /> Tier{' '}
            {adversary.tier}
          </Badge>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge className="border-slate-900/40 bg-slate-900/80 text-white">
                <RoleIcon role={adversary.role} className="mr-1 size-4" />{' '}
                {adversary.role}
              </Badge>
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>
              {getRoleDescription(adversary.role)}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

function AdversaryStatsGrid({ adversary }: { adversary: AdversaryItem }) {
  return (
    <div className="bg-card grid grid-cols-2 gap-4 rounded-lg border p-4 text-sm">
      <div className="col-span-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-300">
              <Target className="size-3" />
              Core Stats
            </div>
          </TooltipTrigger>
          <TooltipContent sideOffset={6}>
            Core combat stats and thresholds.
          </TooltipContent>
        </Tooltip>
      </div>
      <div>
        <TooltipLabel
          label="Difficulty"
          labelIcon={Target}
          tooltip="Target number to meet or beat on rolls against this adversary."
          className="font-semibold"
        />{' '}
        {adversary.difficulty}
      </div>
      <div>
        <TooltipLabel
          label="Thresholds"
          labelIcon={Layers}
          tooltip="Major/Severe/Massive damage thresholds. Massive is typically double Severe if not listed."
          className="font-semibold"
        />{' '}
        {formatThresholds(adversary.thresholds)}
      </div>
      <div>
        <TooltipLabel
          label="HP"
          labelIcon={Heart}
          tooltip="Hit Points tracked for defeating this adversary."
          className="font-semibold"
        />{' '}
        {adversary.hp}
      </div>
      <div>
        <TooltipLabel
          label="Stress"
          labelIcon={AlertTriangle}
          tooltip="Stress track used for special actions and reactions."
          className="font-semibold"
        />{' '}
        {adversary.stress}
      </div>
    </div>
  );
}

function AdversaryAttackPanel({ adversary }: { adversary: AdversaryItem }) {
  return (
    <div className="rounded-lg border border-red-500/30 bg-linear-to-r from-red-500/10 to-rose-500/10 p-4">
      <div className="mb-2 flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-red-700 uppercase dark:text-red-300">
              <Swords className="size-3" />
              Attack
            </div>
          </TooltipTrigger>
          <TooltipContent sideOffset={6}>
            Attack modifier, name, range, and damage.
          </TooltipContent>
        </Tooltip>
      </div>
      <p className="text-sm">
        <TooltipLabel
          label="ATK"
          labelIcon={Swords}
          tooltip="Attack modifier, name, range, and damage type (phy/mag)."
          className="font-semibold"
        />{' '}
        {adversary.attack.modifier} {adversary.attack.name} ·{' '}
        {adversary.attack.range} · {adversary.attack.damage}
      </p>
    </div>
  );
}

function AdversaryExperiences({ adversary }: { adversary: AdversaryItem }) {
  if (adversary.experiences.length === 0) return null;
  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="mb-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-violet-700 uppercase dark:text-violet-300">
              <Brain className="size-3" />
              Experiences
            </div>
          </TooltipTrigger>
          <TooltipContent sideOffset={6}>
            Training or background bonuses that add to rolls.
          </TooltipContent>
        </Tooltip>
      </div>
      <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-sm">
        {adversary.experiences.map((experience, idx) => (
          <li key={idx}>{formatExperience(experience)}</li>
        ))}
      </ul>
    </div>
  );
}

function AdversaryFeatures({ adversary }: { adversary: AdversaryItem }) {
  if (adversary.features.length === 0) return null;
  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="mb-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-300">
              <Sparkles className="size-3" />
              Features
            </div>
          </TooltipTrigger>
          <TooltipContent sideOffset={6}>
            Special actions, reactions, or passive abilities.
          </TooltipContent>
        </Tooltip>
      </div>
      <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-sm">
        {adversary.features.map((feature, idx) => (
          <li key={idx}>{formatFeature(feature)}</li>
        ))}
      </ul>
    </div>
  );
}

function AdversaryDetail({ adversary }: { adversary: AdversaryItem }) {
  return (
    <div className="space-y-6">
      <AdversaryDetailHeader adversary={adversary} />

      <div className="bg-card space-y-2 rounded-lg border p-4">
        <div className="mb-1">
          <div className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-rose-700 uppercase dark:text-rose-300">
            <Skull className="size-3" />
            Overview
          </div>
        </div>
        <p className="text-muted-foreground text-sm">{adversary.description}</p>
      </div>

      <div className="bg-card space-y-2 rounded-lg border p-4">
        <div className="mb-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-blue-700 uppercase dark:text-blue-300">
                <Compass className="size-3" />
                Motives & Tactics
              </div>
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>
              Guidance for how this adversary behaves and prioritizes targets.
            </TooltipContent>
          </Tooltip>
        </div>
        <p className="text-muted-foreground text-sm">
          {adversary.motivesAndTactics}
        </p>
      </div>

      <AdversaryStatsGrid adversary={adversary} />

      <AdversaryAttackPanel adversary={adversary} />

      <AdversaryExperiences adversary={adversary} />

      <AdversaryFeatures adversary={adversary} />
    </div>
  );
}

function AdversariesReferencePage() {
  const isMobile = useIsMobile();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [search, setSearch] = React.useState('');
  const [tierFilter, setTierFilter] = React.useState<Adversary['tier'] | 'all'>(
    'all'
  );
  const [roleFilter, setRoleFilter] = React.useState<Adversary['role'] | 'all'>(
    'all'
  );
  const [sortBy, setSortBy] = React.useState<AdversarySortKey>('name');
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc');
  const [selectedAdversary, setSelectedAdversary] =
    React.useState<AdversaryItem | null>(null);

  const { data: allAdversaries, isLoading: isInitialLoading } =
    useDeferredLoad(loadAllAdversaries);

  const totalCount = allAdversaries?.length ?? 0;

  const filteredAdversaries = React.useMemo(() => {
    if (!allAdversaries) return [];
    const filtered = filterAdversaries(
      allAdversaries,
      search,
      tierFilter,
      roleFilter
    );
    return sortAdversaries(filtered, sortBy, sortDir);
  }, [allAdversaries, tierFilter, roleFilter, search, sortBy, sortDir]);

  const { deferredItems: deferredAdversaries, isPending: isFiltering } =
    useDeferredItems(filteredAdversaries);

  useKeyboardNavigation({
    items: deferredAdversaries,
    selectedItem: selectedAdversary,
    onSelect: setSelectedAdversary,
    onClose: () => setSelectedAdversary(null),
  });

  if (isInitialLoading) {
    return <ReferencePageSkeleton showFilters={false} />;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AdversariesHeader
        filteredCount={filteredAdversaries.length}
        totalCount={totalCount}
        tierFilter={tierFilter}
        roleFilter={roleFilter}
        sortBy={sortBy}
        sortDir={sortDir}
        search={search}
        onTierFilterChange={setTierFilter}
        onRoleFilterChange={setRoleFilter}
        onSortByChange={setSortBy}
        onSortDirChange={setSortDir}
        onSearchChange={setSearch}
        onClearSearch={() => setSearch('')}
      />

      <div ref={scrollRef} className="relative min-h-0 flex-1 overflow-y-auto">
        {isFiltering && (
          <div className="bg-background/60 absolute inset-0 z-10 flex items-start justify-center pt-20 backdrop-blur-[1px]">
            <div className="bg-background rounded-lg border p-4 shadow-lg">
              <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
            </div>
          </div>
        )}
        <div className="p-4">
          <AdversariesGrid
            items={deferredAdversaries}
            isMobile={isMobile}
            onSelect={setSelectedAdversary}
          />

          {deferredAdversaries.length === 0 && !isFiltering && (
            <AdversariesEmptyState
              onClear={() => {
                setSearch('');
                setTierFilter('all');
                setRoleFilter('all');
              }}
            />
          )}
        </div>
      </div>

      <BackToTop scrollRef={scrollRef} />

      <AdversaryDetailSheet
        selectedAdversary={selectedAdversary}
        onClose={() => setSelectedAdversary(null)}
      />
    </div>
  );
}
