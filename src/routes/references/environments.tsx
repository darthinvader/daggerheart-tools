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
import { ENVIRONMENTS } from '@/lib/data/environments';
import type { Environment } from '@/lib/schemas/environments';

export const Route = createFileRoute('/references/environments')({
  component: EnvironmentsReferencePage,
  pendingComponent: () => <ReferencePageSkeleton showFilters={false} />,
  errorComponent: ({ error }: ErrorComponentProps) => (
    <div className="text-destructive p-6">Error: {error.message}</div>
  ),
});

type EnvironmentItem = (typeof ENVIRONMENTS)[number];

const tierOrder: Environment['tier'][] = ['1', '2', '3', '4'];
const typeOrder: Environment['type'][] = [
  'Exploration',
  'Event',
  'Social',
  'Traversal',
];

const tierColors: Record<Environment['tier'], string> = {
  '1': 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40',
  '2': 'bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-500/40',
  '3': 'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/40',
  '4': 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/40',
};

const typeColors: Record<Environment['type'], string> = {
  Exploration: 'bg-sky-500/20 text-sky-700 dark:text-sky-300 border-sky-500/40',
  Event: 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/40',
  Social:
    'bg-violet-500/20 text-violet-700 dark:text-violet-300 border-violet-500/40',
  Traversal:
    'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40',
};

const defaultBadgeColor = 'bg-muted/50 text-foreground border-border';

const tierEmojis: Record<Environment['tier'], string> = {
  '1': '🌱',
  '2': '🌿',
  '3': '🔥',
  '4': '⚡',
};

const typeEmojis: Record<Environment['type'], string> = {
  Exploration: '🧭',
  Event: '🎭',
  Social: '🗣️',
  Traversal: '🧗',
};

const typeDescriptions: Record<Environment['type'], string> = {
  Exploration: 'Discovery-focused scenes and investigation play.',
  Event: 'High-impact moments and scene-defining turns.',
  Social: 'Negotiation, tension, and social stakes.',
  Traversal: 'Movement, obstacles, and hazardous paths.',
};

function getTypeDescription(type: Environment['type']) {
  return typeDescriptions[type] ?? 'Environment type.';
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

const loadAllEnvironments = () => [...ENVIRONMENTS];

function formatDifficulty(difficulty: Environment['difficulty']) {
  return typeof difficulty === 'number' ? difficulty : difficulty;
}

function formatFeature(feature: Environment['features'][number]) {
  if (typeof feature === 'string') return feature;
  const type = feature.type ? `${feature.type}: ` : '';
  return `${feature.name} — ${type}${feature.description}`;
}

function EnvironmentCard({
  environment,
  compact = false,
  onClick,
}: {
  environment: EnvironmentItem;
  compact?: boolean;
  onClick: () => void;
}) {
  const tierBadge = tierColors[environment.tier] ?? defaultBadgeColor;
  const typeBadge = typeColors[environment.type] ?? defaultBadgeColor;

  return (
    <Card
      className="hover:border-primary/50 group h-full cursor-pointer overflow-hidden transition-all hover:scale-[1.01] hover:shadow-xl"
      onClick={onClick}
    >
      <div className="h-2 bg-linear-to-r from-emerald-500 via-teal-500 to-sky-500" />
      <CardHeader className={compact ? 'pb-2' : undefined}>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className={compact ? 'text-lg' : 'text-2xl'}>
            <span className="mr-2">🏞️</span>
            {environment.name}
          </CardTitle>
          <Badge variant="outline" className={`text-xs ${tierBadge}`}>
            {tierEmojis[environment.tier]} Tier {environment.tier}
          </Badge>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className={`text-xs ${typeBadge}`}>
                {typeEmojis[environment.type] ?? '🧩'} {environment.type}
              </Badge>
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>
              {getTypeDescription(environment.type)}
            </TooltipContent>
          </Tooltip>
        </div>
        <CardDescription
          className={`text-muted-foreground ${compact ? 'line-clamp-2 text-xs' : 'mt-2 text-sm'}`}
        >
          {environment.description}
        </CardDescription>
      </CardHeader>
      <CardContent className={compact ? 'space-y-2 pt-0' : 'space-y-4'}>
        <div className="text-muted-foreground grid grid-cols-2 gap-2 text-xs">
          <div>
            <TooltipLabel
              label="🎯 Difficulty"
              tooltip="Target number to meet or beat in this environment."
              className="font-semibold"
            />{' '}
            {formatDifficulty(environment.difficulty)}
          </div>
          <div>
            <TooltipLabel
              label="🧠 Impulses"
              tooltip="Narrative goals or behaviors the environment pushes toward."
              className="font-semibold"
            />{' '}
            {environment.impulses.length}
          </div>
        </div>
        {!compact && environment.features.length > 0 && (
          <div className="text-muted-foreground space-y-1 text-xs">
            <TooltipLabel
              label="✨ Features"
              tooltip="Actions, reactions, or passive effects for the scene."
              className="font-semibold"
            />
            <ul className="list-disc space-y-1 pl-4">
              {environment.features.slice(0, 3).map((feature, idx) => (
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

function EnvironmentDetail({ environment }: { environment: EnvironmentItem }) {
  const tierBadge = tierColors[environment.tier] ?? defaultBadgeColor;
  const typeBadge = typeColors[environment.type] ?? defaultBadgeColor;

  return (
    <div className="space-y-6">
      <div className="-mx-4 -mt-4 bg-linear-to-r from-emerald-500 via-teal-500 to-sky-500 p-6">
        <h2 className="text-3xl font-bold text-white">🏞️ {environment.name}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge className="border-white/30 bg-white/20 text-white">
            {tierEmojis[environment.tier]} Tier {environment.tier}
          </Badge>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge className="border-white/30 bg-white/20 text-white">
                {typeEmojis[environment.type] ?? '🧩'} {environment.type}
              </Badge>
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>
              {getTypeDescription(environment.type)}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <p className="text-muted-foreground">{environment.description}</p>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <TooltipLabel
            label="🎯 Difficulty"
            tooltip="Target number to meet or beat in this environment."
            className="font-semibold"
          />{' '}
          {formatDifficulty(environment.difficulty)}
        </div>
        <div>
          <TooltipLabel
            label="🧭 Type"
            tooltip="Scene style this environment supports most naturally."
            className="font-semibold"
          />{' '}
          {environment.type}
        </div>
      </div>

      <div>
        <h4 className="mb-2 font-semibold">
          <TooltipLabel
            label="🧠 Impulses"
            tooltip="Narrative goals or behaviors the environment pushes toward."
            className="font-semibold"
          />
        </h4>
        <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-sm">
          {environment.impulses.map((impulse, idx) => (
            <li key={idx}>{impulse}</li>
          ))}
        </ul>
      </div>

      {environment.potentialAdversaries.length > 0 && (
        <div>
          <h4 className="mb-2 font-semibold">
            <TooltipLabel
              label="⚔️ Potential Adversaries"
              tooltip="Common adversaries that appear in this environment."
              className="font-semibold"
            />
          </h4>
          <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-sm">
            {environment.potentialAdversaries.map((entry, idx) => (
              <li key={idx}>{entry}</li>
            ))}
          </ul>
        </div>
      )}

      {environment.features.length > 0 && (
        <div>
          <h4 className="mb-2 font-semibold">
            <TooltipLabel
              label="✨ Features"
              tooltip="Actions, reactions, or passive effects for the scene."
              className="font-semibold"
            />
          </h4>
          <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-sm">
            {environment.features.map((feature, idx) => (
              <li key={idx}>{formatFeature(feature)}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className={`text-xs ${tierBadge}`}>
          {tierEmojis[environment.tier]} Tier {environment.tier}
        </Badge>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className={`text-xs ${typeBadge}`}>
              {typeEmojis[environment.type] ?? '🧩'} {environment.type}
            </Badge>
          </TooltipTrigger>
          <TooltipContent sideOffset={6}>
            {getTypeDescription(environment.type)}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

function EnvironmentsReferencePage() {
  const isMobile = useIsMobile();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [search, setSearch] = React.useState('');
  const [tierFilter, setTierFilter] = React.useState<
    Environment['tier'] | 'all'
  >('all');
  const [typeFilter, setTypeFilter] = React.useState<
    Environment['type'] | 'all'
  >('all');
  const [sortBy, setSortBy] = React.useState<'name' | 'tier' | 'type'>('name');
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc');
  const [selectedEnvironment, setSelectedEnvironment] =
    React.useState<EnvironmentItem | null>(null);

  const { data: allEnvironments, isLoading: isInitialLoading } =
    useDeferredLoad(loadAllEnvironments);

  const totalCount = allEnvironments?.length ?? 0;

  const filteredEnvironments = React.useMemo(() => {
    if (!allEnvironments) return [];
    let result = [...allEnvironments];

    if (tierFilter !== 'all') {
      result = result.filter(environment => environment.tier === tierFilter);
    }

    if (typeFilter !== 'all') {
      result = result.filter(environment => environment.type === typeFilter);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(environment => {
        const impulses = environment.impulses.join(' ').toLowerCase();
        const adversaries = environment.potentialAdversaries
          .join(' ')
          .toLowerCase();
        const features = environment.features
          .map(feature => formatFeature(feature).toLowerCase())
          .join(' ');
        return (
          environment.name.toLowerCase().includes(searchLower) ||
          environment.description.toLowerCase().includes(searchLower) ||
          environment.type.toLowerCase().includes(searchLower) ||
          impulses.includes(searchLower) ||
          adversaries.includes(searchLower) ||
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
        case 'type':
          cmp = a.type.localeCompare(b.type);
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [allEnvironments, tierFilter, typeFilter, search, sortBy, sortDir]);

  const { deferredItems: deferredEnvironments, isPending: isFiltering } =
    useDeferredItems(filteredEnvironments);

  useKeyboardNavigation({
    items: deferredEnvironments,
    selectedItem: selectedEnvironment,
    onSelect: setSelectedEnvironment,
    onClose: () => setSelectedEnvironment(null),
  });

  if (isInitialLoading) {
    return <ReferencePageSkeleton showFilters={false} />;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b bg-linear-to-r from-emerald-500/10 via-teal-500/10 to-sky-500/10 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="bg-linear-to-r from-emerald-500 via-teal-500 to-sky-500 bg-clip-text text-2xl font-bold text-transparent">
              � Environments Reference
            </h1>
            <ResultsCounter
              filtered={filteredEnvironments.length}
              total={totalCount}
              label="environments"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <select
                value={tierFilter}
                onChange={e =>
                  setTierFilter(e.target.value as Environment['tier'] | 'all')
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
                value={typeFilter}
                onChange={e =>
                  setTypeFilter(e.target.value as Environment['type'] | 'all')
                }
                className="bg-background h-9 rounded-md border px-2 text-sm"
                aria-label="Filter by type"
              >
                <option value="all">All types</option>
                {typeOrder.map(type => (
                  <option key={type} value={type}>
                    {typeEmojis[type]} {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={e =>
                  setSortBy(e.target.value as 'name' | 'tier' | 'type')
                }
                className="bg-background h-9 rounded-md border px-2 text-sm"
                aria-label="Sort environments"
              >
                <option value="name">Name</option>
                <option value="tier">Tier</option>
                <option value="type">Type</option>
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
                placeholder="Search environments..."
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
              {deferredEnvironments.map(environment => (
                <EnvironmentCard
                  key={environment.name}
                  environment={environment}
                  compact
                  onClick={() => setSelectedEnvironment(environment)}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {deferredEnvironments.map(environment => (
                <EnvironmentCard
                  key={environment.name}
                  environment={environment}
                  onClick={() => setSelectedEnvironment(environment)}
                />
              ))}
            </div>
          )}

          {deferredEnvironments.length === 0 && !isFiltering && (
            <div className="text-muted-foreground py-12 text-center">
              <p>No environments match your filters.</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearch('');
                  setTierFilter('all');
                  setTypeFilter('all');
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
        open={selectedEnvironment !== null}
        onOpenChange={open => !open && setSelectedEnvironment(null)}
      >
        <SheetContent
          side="right"
          className="flex w-full flex-col p-0 sm:max-w-lg"
          hideCloseButton
        >
          {selectedEnvironment && (
            <>
              <SheetHeader className="bg-background shrink-0 border-b p-4">
                <SheetTitle className="flex items-center justify-between gap-2">
                  <span className="truncate">{selectedEnvironment.name}</span>
                  <div className="flex shrink-0 items-center gap-2">
                    <KeyboardHint />
                    <DetailCloseButton
                      onClose={() => setSelectedEnvironment(null)}
                    />
                  </div>
                </SheetTitle>
              </SheetHeader>
              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                <EnvironmentDetail environment={selectedEnvironment} />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
