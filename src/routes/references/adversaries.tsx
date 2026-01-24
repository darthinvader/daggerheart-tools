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

const roleEmojis: Record<string, string> = {
  Bruiser: '💥',
  Horde: '🐜',
  Leader: '👑',
  Minion: '🪶',
  Ranged: '🏹',
  Skulk: '🕶️',
  Social: '🗣️',
  Solo: '⚔️',
  Standard: '🛡️',
  Support: '✨',
};

const tierEmojis: Record<Adversary['tier'], string> = {
  '1': '🌟',
  '2': '🔥',
  '3': '⚡',
  '4': '💀',
};

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
}

function TooltipLabel({ label, tooltip, className }: TooltipLabelProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={`cursor-help underline decoration-dotted underline-offset-2 ${className ?? ''}`}
        >
          {label}:
        </span>
      </TooltipTrigger>
      <TooltipContent sideOffset={6}>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

const loadAllAdversaries = () => [...ADVERSARIES];

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
      <div className="h-2 bg-linear-to-r from-fuchsia-500 via-red-500 to-orange-500" />
      <CardHeader className={compact ? 'pb-2' : undefined}>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className={compact ? 'text-lg' : 'text-2xl'}>
            <span className="mr-2">🧿</span>
            {adversary.name}
          </CardTitle>
          <Badge variant="outline" className={`text-xs ${tierBadge}`}>
            {tierEmojis[adversary.tier]} Tier {adversary.tier}
          </Badge>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className={`text-xs ${roleBadge}`}>
                {roleEmojis[adversary.role] ?? '🧩'} {adversary.role}
              </Badge>
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>
              {getRoleDescription(adversary.role)}
            </TooltipContent>
          </Tooltip>
        </div>
        <CardDescription
          className={`text-muted-foreground ${compact ? 'line-clamp-2 text-xs' : 'mt-2 text-sm'}`}
        >
          {adversary.description}
        </CardDescription>
      </CardHeader>
      <CardContent className={compact ? 'space-y-2 pt-0' : 'space-y-4'}>
        <div className="text-muted-foreground grid grid-cols-2 gap-2 text-xs">
          <div>
            <TooltipLabel
              label="🎯 Difficulty"
              tooltip="Target number to meet or beat on rolls against this adversary."
              className="font-semibold"
            />{' '}
            {adversary.difficulty}
          </div>
          <div>
            <TooltipLabel
              label="🧱 Thresholds"
              tooltip="Major/Severe/Massive damage thresholds. Massive is typically double Severe if not listed."
              className="font-semibold"
            />{' '}
            {formatThresholds(adversary.thresholds)}
          </div>
          <div>
            <TooltipLabel
              label="❤️ HP"
              tooltip="Hit Points tracked for defeating this adversary."
              className="font-semibold"
            />{' '}
            {adversary.hp}
          </div>
          <div>
            <TooltipLabel
              label="💢 Stress"
              tooltip="Stress track used for special actions and reactions."
              className="font-semibold"
            />{' '}
            {adversary.stress}
          </div>
        </div>
        <div className="text-xs">
          <TooltipLabel
            label="⚔️ ATK"
            tooltip="Attack modifier, name, range, and damage type (phy/mag)."
            className="font-semibold"
          />{' '}
          {adversary.attack.modifier} {adversary.attack.name} ·{' '}
          {adversary.attack.range} · {adversary.attack.damage}
        </div>
        {!compact && adversary.features.length > 0 && (
          <div className="text-muted-foreground space-y-1 text-xs">
            <TooltipLabel
              label="✨ Features"
              tooltip="Special actions, reactions, or passive abilities for this adversary."
              className="font-semibold"
            />
            <ul className="list-disc space-y-1 pl-4">
              {adversary.features.slice(0, 3).map((feature, idx) => (
                <li key={idx} className="line-clamp-2">
                  {formatFeature(feature)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AdversaryDetail({ adversary }: { adversary: AdversaryItem }) {
  const tierBadge = tierColors[adversary.tier] ?? defaultBadgeColor;
  const roleBadge = roleColors[adversary.role] ?? defaultBadgeColor;

  return (
    <div className="space-y-6">
      <div className="-mx-4 -mt-4 bg-linear-to-r from-fuchsia-500 via-red-500 to-orange-500 p-6">
        <h2 className="text-3xl font-bold text-white">🐉 {adversary.name}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge className="border-white/30 bg-white/20 text-white">
            {tierEmojis[adversary.tier]} Tier {adversary.tier}
          </Badge>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge className="border-white/30 bg-white/20 text-white">
                {roleEmojis[adversary.role] ?? '🧩'} {adversary.role}
              </Badge>
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>
              {getRoleDescription(adversary.role)}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <p className="text-muted-foreground">{adversary.description}</p>

      <div>
        <h4 className="mb-2 font-semibold">
          <TooltipLabel
            label="🧭 Motives & Tactics"
            tooltip="Guidance for how this adversary behaves and prioritizes targets."
            className="font-semibold"
          />
        </h4>
        <p className="text-muted-foreground text-sm">
          {adversary.motivesAndTactics}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <TooltipLabel
            label="🎯 Difficulty"
            tooltip="Target number to meet or beat on rolls against this adversary."
            className="font-semibold"
          />{' '}
          {adversary.difficulty}
        </div>
        <div>
          <TooltipLabel
            label="🧱 Thresholds"
            tooltip="Major/Severe/Massive damage thresholds. Massive is typically double Severe if not listed."
            className="font-semibold"
          />{' '}
          {formatThresholds(adversary.thresholds)}
        </div>
        <div>
          <TooltipLabel
            label="❤️ HP"
            tooltip="Hit Points tracked for defeating this adversary."
            className="font-semibold"
          />{' '}
          {adversary.hp}
        </div>
        <div>
          <TooltipLabel
            label="💢 Stress"
            tooltip="Stress track used for special actions and reactions."
            className="font-semibold"
          />{' '}
          {adversary.stress}
        </div>
      </div>

      <div className="rounded-lg border border-red-500/30 bg-linear-to-r from-red-500/10 to-rose-500/10 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Badge className={`border-red-500/40 ${tierBadge}`}>⚔️ Attack</Badge>
        </div>
        <p className="text-sm">
          <TooltipLabel
            label="⚔️ ATK"
            tooltip="Attack modifier, name, range, and damage type (phy/mag)."
            className="font-semibold"
          />{' '}
          {adversary.attack.modifier} {adversary.attack.name} ·{' '}
          {adversary.attack.range} · {adversary.attack.damage}
        </p>
      </div>

      {adversary.experiences.length > 0 && (
        <div>
          <h4 className="mb-2 font-semibold">
            <TooltipLabel
              label="🧠 Experiences"
              tooltip="Training or background bonuses that add to rolls."
              className="font-semibold"
            />
          </h4>
          <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-sm">
            {adversary.experiences.map((experience, idx) => (
              <li key={idx}>{formatExperience(experience)}</li>
            ))}
          </ul>
        </div>
      )}

      {adversary.features.length > 0 && (
        <div>
          <h4 className="mb-2 font-semibold">
            <TooltipLabel
              label="✨ Features"
              tooltip="Special actions, reactions, or passive abilities for this adversary."
              className="font-semibold"
            />
          </h4>
          <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-sm">
            {adversary.features.map((feature, idx) => (
              <li key={idx}>{formatFeature(feature)}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className={`text-xs ${tierBadge}`}>
          {tierEmojis[adversary.tier]} Tier {adversary.tier}
        </Badge>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className={`text-xs ${roleBadge}`}>
              {roleEmojis[adversary.role] ?? '🧩'} {adversary.role}
            </Badge>
          </TooltipTrigger>
          <TooltipContent sideOffset={6}>
            {getRoleDescription(adversary.role)}
          </TooltipContent>
        </Tooltip>
      </div>
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
  const [sortBy, setSortBy] = React.useState<'name' | 'tier' | 'role'>('name');
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc');
  const [selectedAdversary, setSelectedAdversary] =
    React.useState<AdversaryItem | null>(null);

  const { data: allAdversaries, isLoading: isInitialLoading } =
    useDeferredLoad(loadAllAdversaries);

  const totalCount = allAdversaries?.length ?? 0;

  const filteredAdversaries = React.useMemo(() => {
    if (!allAdversaries) return [];
    let result = [...allAdversaries];

    if (tierFilter !== 'all') {
      result = result.filter(adversary => adversary.tier === tierFilter);
    }

    if (roleFilter !== 'all') {
      result = result.filter(adversary => adversary.role === roleFilter);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(adversary => {
        const experiences = adversary.experiences
          .map(exp => formatExperience(exp).toLowerCase())
          .join(' ');
        const features = adversary.features
          .map(feature => formatFeature(feature).toLowerCase())
          .join(' ');
        return (
          adversary.name.toLowerCase().includes(searchLower) ||
          adversary.description.toLowerCase().includes(searchLower) ||
          adversary.motivesAndTactics.toLowerCase().includes(searchLower) ||
          adversary.role.toLowerCase().includes(searchLower) ||
          adversary.attack.name.toLowerCase().includes(searchLower) ||
          experiences.includes(searchLower) ||
          features.includes(searchLower)
        );
      });
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'tier':
          cmp = tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier);
          break;
        case 'role':
          cmp = a.role.localeCompare(b.role);
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
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
      <div className="shrink-0 border-b bg-linear-to-r from-fuchsia-500/10 via-red-500/10 to-orange-500/10 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="bg-linear-to-r from-fuchsia-500 via-red-500 to-orange-500 bg-clip-text text-2xl font-bold text-transparent">
              👹 Adversaries Reference
            </h1>
            <ResultsCounter
              filtered={filteredAdversaries.length}
              total={totalCount}
              label="adversaries"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <select
                value={tierFilter}
                onChange={e =>
                  setTierFilter(e.target.value as Adversary['tier'] | 'all')
                }
                className="bg-background h-9 rounded-md border px-2 text-sm"
                aria-label="Filter by tier"
              >
                <option value="all">All tiers</option>
                {tierOrder.map(tier => (
                  <option key={tier} value={tier}>
                    {tierEmojis[tier]} Tier {tier}
                  </option>
                ))}
              </select>
              <select
                value={roleFilter}
                onChange={e =>
                  setRoleFilter(e.target.value as Adversary['role'] | 'all')
                }
                className="bg-background h-9 rounded-md border px-2 text-sm"
                aria-label="Filter by role"
              >
                <option value="all">All roles</option>
                {Object.keys(roleColors)
                  .sort((a, b) => a.localeCompare(b))
                  .map(role => (
                    <option key={role} value={role}>
                      {roleEmojis[role] ?? '🧩'} {role}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={e =>
                  setSortBy(e.target.value as 'name' | 'tier' | 'role')
                }
                className="bg-background h-9 rounded-md border px-2 text-sm"
                aria-label="Sort adversaries"
              >
                <option value="name">Name</option>
                <option value="tier">Tier</option>
                <option value="role">Role</option>
              </select>
              <Button
                variant="ghost"
                size="icon"
                className="size-9"
                onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
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
            <div className="relative w-full sm:w-64">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                placeholder="Search adversaries..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pr-9 pl-9"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="relative min-h-0 flex-1 overflow-y-auto">
        {isFiltering && (
          <div className="bg-background/60 absolute inset-0 z-10 flex items-start justify-center pt-20 backdrop-blur-[1px]">
            <div className="bg-background rounded-lg border p-4 shadow-lg">
              <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
            </div>
          </div>
        )}
        <div className="p-4">
          {isMobile ? (
            <div className="grid grid-cols-1 gap-3">
              {deferredAdversaries.map(adversary => (
                <AdversaryCard
                  key={adversary.name}
                  adversary={adversary}
                  compact
                  onClick={() => setSelectedAdversary(adversary)}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {deferredAdversaries.map(adversary => (
                <AdversaryCard
                  key={adversary.name}
                  adversary={adversary}
                  onClick={() => setSelectedAdversary(adversary)}
                />
              ))}
            </div>
          )}

          {deferredAdversaries.length === 0 && !isFiltering && (
            <div className="text-muted-foreground py-12 text-center">
              <p>No adversaries match your filters.</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearch('');
                  setTierFilter('all');
                  setRoleFilter('all');
                }}
                className="mt-2"
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>

      <BackToTop scrollRef={scrollRef} />

      <Sheet
        open={selectedAdversary !== null}
        onOpenChange={open => !open && setSelectedAdversary(null)}
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
                    <DetailCloseButton
                      onClose={() => setSelectedAdversary(null)}
                    />
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
    </div>
  );
}
