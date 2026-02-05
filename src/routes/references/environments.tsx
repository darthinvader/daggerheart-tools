// Environments reference page with page-specific detail components

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
  useDeferredSheetContent,
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
  ResponsiveSheet,
  ResponsiveSheetContent,
  ResponsiveSheetHeader,
  ResponsiveSheetTitle,
} from '@/components/ui/responsive-sheet';
import { SheetContentSkeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { ENVIRONMENTS } from '@/lib/data/environments';
import {
  Brain,
  Compass,
  DynamicIcon,
  EnvironmentTierIcons,
  EnvironmentTypeIcons,
  getIcon,
  Sparkles,
  Swords,
  Target,
  TreePine,
} from '@/lib/icons';
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

// Text labels for select options (can't use icons in <option> elements)
const tierLabels: Record<Environment['tier'], string> = {
  '1': '[T1]',
  '2': '[T2]',
  '3': '[T3]',
  '4': '[T4]',
};

const typeLabels: Record<Environment['type'], string> = {
  Exploration: '●',
  Event: '●',
  Social: '●',
  Traversal: '●',
};

// Icon helper components for badges
function TierIcon({
  tier,
  className = 'size-3 mr-1',
}: {
  tier: string;
  className?: string;
}) {
  const icon = getIcon(EnvironmentTierIcons, tier);
  return <DynamicIcon icon={icon} className={className} />;
}

function TypeIcon({
  type,
  className = 'size-3 mr-1',
}: {
  type: string;
  className?: string;
}) {
  const icon = getIcon(EnvironmentTypeIcons, type, 'default');
  return <DynamicIcon icon={icon} className={className} />;
}

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

const loadAllEnvironments = () => [...ENVIRONMENTS];

type EnvironmentSortKey = 'name' | 'tier' | 'type';

const ENVIRONMENT_SORTERS: Record<
  EnvironmentSortKey,
  (a: EnvironmentItem, b: EnvironmentItem) => number
> = {
  name: (a, b) => a.name.localeCompare(b.name),
  tier: (a, b) => tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier),
  type: (a, b) => a.type.localeCompare(b.type),
};

function getEnvironmentSearchText(environment: EnvironmentItem) {
  const impulses = environment.impulses.join(' ').toLowerCase();
  const adversaries = environment.potentialAdversaries.join(' ').toLowerCase();
  const features = environment.features
    .map(feature => formatFeature(feature).toLowerCase())
    .join(' ');
  return [
    environment.name,
    environment.description,
    environment.type,
    impulses,
    adversaries,
    features,
  ]
    .join(' ')
    .toLowerCase();
}

function filterEnvironments(
  items: EnvironmentItem[],
  search: string,
  tierFilter: Environment['tier'] | 'all',
  typeFilter: Environment['type'] | 'all'
) {
  return items.filter(environment => {
    if (tierFilter !== 'all' && environment.tier !== tierFilter) return false;
    if (typeFilter !== 'all' && environment.type !== typeFilter) return false;
    if (!search) return true;
    return getEnvironmentSearchText(environment).includes(search.toLowerCase());
  });
}

function sortEnvironments(
  items: EnvironmentItem[],
  sortBy: EnvironmentSortKey,
  sortDir: 'asc' | 'desc'
) {
  const sorted = [...items].sort(ENVIRONMENT_SORTERS[sortBy]);
  return sortDir === 'asc' ? sorted : sorted.reverse();
}

type EnvironmentsHeaderProps = {
  filteredCount: number;
  totalCount: number;
  tierFilter: Environment['tier'] | 'all';
  typeFilter: Environment['type'] | 'all';
  sortBy: EnvironmentSortKey;
  sortDir: 'asc' | 'desc';
  search: string;
  onTierFilterChange: (value: Environment['tier'] | 'all') => void;
  onTypeFilterChange: (value: Environment['type'] | 'all') => void;
  onSortByChange: (value: EnvironmentSortKey) => void;
  onSortDirChange: (value: 'asc' | 'desc') => void;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
};

function EnvironmentsHeader({
  filteredCount,
  totalCount,
  tierFilter,
  typeFilter,
  sortBy,
  sortDir,
  search,
  onTierFilterChange,
  onTypeFilterChange,
  onSortByChange,
  onSortDirChange,
  onSearchChange,
  onClearSearch,
}: EnvironmentsHeaderProps) {
  return (
    <div className="bg-background shrink-0 border-b px-4 py-3">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <TreePine className="size-4 text-emerald-500" />
              <span className="bg-linear-to-r from-emerald-500 via-teal-500 to-sky-500 bg-clip-text text-transparent">
                Environments Reference
              </span>
            </div>
            <ResultsCounter
              filtered={filteredCount}
              total={totalCount}
              label="environments"
            />
          </div>
        </div>

        <div className="bg-muted/30 sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
          <div className="relative min-w-50 flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              placeholder="Search environments..."
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
                    e.target.value as Environment['tier'] | 'all'
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
                value={typeFilter}
                onChange={e =>
                  onTypeFilterChange(
                    e.target.value as Environment['type'] | 'all'
                  )
                }
                className="bg-background h-8 rounded-md border px-2 text-sm"
                aria-label="Filter by type"
              >
                <option value="all">All types</option>
                {typeOrder.map(type => (
                  <option key={type} value={type}>
                    {typeLabels[type]} {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-border h-6 w-px" />

            <div className="flex items-center gap-1">
              <select
                value={sortBy}
                onChange={e =>
                  onSortByChange(e.target.value as EnvironmentSortKey)
                }
                className="bg-background h-8 rounded-md border px-2 text-sm"
                aria-label="Sort environments"
              >
                <option value="name">Name</option>
                <option value="tier">Tier</option>
                <option value="type">Type</option>
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

const EnvironmentsGrid = React.memo(function EnvironmentsGrid({
  items,
  isMobile,
  onSelect,
}: {
  items: EnvironmentItem[];
  isMobile: boolean;
  onSelect: (environment: EnvironmentItem) => void;
}) {
  if (isMobile) {
    return (
      <div className="grid grid-cols-1 gap-3">
        {items.map(environment => (
          <EnvironmentCard
            key={environment.name}
            environment={environment}
            compact
            onClick={() => onSelect(environment)}
          />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map(environment => (
        <EnvironmentCard
          key={environment.name}
          environment={environment}
          onClick={() => onSelect(environment)}
        />
      ))}
    </div>
  );
});

function EnvironmentsEmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="text-muted-foreground py-12 text-center">
      <p>No environments match your filters.</p>
      <Button variant="link" onClick={onClear} className="mt-2">
        Clear filters
      </Button>
    </div>
  );
}

function EnvironmentDetailSheet({
  selectedEnvironment,
  onClose,
}: {
  selectedEnvironment: EnvironmentItem | null;
  onClose: () => void;
}) {
  const shouldRenderContent = useDeferredSheetContent(
    selectedEnvironment !== null
  );

  return (
    <ResponsiveSheet
      open={selectedEnvironment !== null}
      onOpenChange={open => !open && onClose()}
    >
      <ResponsiveSheetContent
        side="right"
        className="flex w-full flex-col p-0 sm:max-w-lg"
        hideCloseButton
      >
        {selectedEnvironment && (
          <>
            <ResponsiveSheetHeader className="bg-background shrink-0 border-b p-4">
              <ResponsiveSheetTitle className="flex items-center justify-between gap-2">
                <span className="truncate">{selectedEnvironment.name}</span>
                <div className="flex shrink-0 items-center gap-2">
                  <KeyboardHint />
                  <DetailCloseButton onClose={onClose} />
                </div>
              </ResponsiveSheetTitle>
            </ResponsiveSheetHeader>
            <div className="scroll-container-optimized min-h-0 flex-1 overflow-y-auto p-4">
              {shouldRenderContent ? (
                <EnvironmentDetail environment={selectedEnvironment} />
              ) : (
                <SheetContentSkeleton />
              )}
            </div>
          </>
        )}
      </ResponsiveSheetContent>
    </ResponsiveSheet>
  );
}

function formatDifficulty(difficulty: Environment['difficulty']) {
  return typeof difficulty === 'number' ? difficulty : difficulty;
}

function formatFeature(feature: Environment['features'][number]) {
  if (typeof feature === 'string') return feature;
  const type = feature.type ? `${feature.type}: ` : '';
  return `${feature.name} — ${type}${feature.description}`;
}

// Memoized card component for performance
const EnvironmentCard = React.memo(function EnvironmentCard({
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
      className="reference-card card-grid-item hover:border-primary/50 group h-full cursor-pointer overflow-hidden transition-all hover:scale-[1.01] hover:shadow-xl"
      onClick={onClick}
    >
      <div className="h-1 bg-linear-to-r from-emerald-500 via-teal-500 to-sky-500" />
      <CardHeader className={compact ? 'pb-2' : 'pb-3'}>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className={compact ? 'text-base' : 'text-xl'}>
            <TreePine className="mr-2 inline-block size-4" />
            {environment.name}
          </CardTitle>
          <Badge variant="outline" className={`text-xs ${tierBadge}`}>
            <TierIcon tier={environment.tier} /> Tier {environment.tier}
          </Badge>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className={`text-xs ${typeBadge}`}>
                <TypeIcon type={environment.type} /> {environment.type}
              </Badge>
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>
              {getTypeDescription(environment.type)}
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent className={compact ? 'space-y-3 pt-0' : 'space-y-4'}>
        <div className="bg-card space-y-2 rounded-lg border p-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-300">
                <TreePine className="size-3" />
                Overview
              </div>
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>
              Quick summary of the environment.
            </TooltipContent>
          </Tooltip>
          <CardDescription className={compact ? 'text-xs' : 'text-sm'}>
            {environment.description}
          </CardDescription>
        </div>

        <div className="bg-muted/40 text-muted-foreground grid grid-cols-2 gap-2 rounded-lg border p-3 text-xs">
          <div className="col-span-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-sky-700 uppercase dark:text-sky-300">
                  <Target className="size-3" />
                  Scene Stats
                </div>
              </TooltipTrigger>
              <TooltipContent sideOffset={6}>
                Core scene difficulty and counts.
              </TooltipContent>
            </Tooltip>
          </div>
          <div>
            <TooltipLabel
              label="Difficulty"
              labelIcon={Target}
              tooltip="Target number to meet or beat in this environment."
              className="font-semibold"
            />{' '}
            {formatDifficulty(environment.difficulty)}
          </div>
          <div>
            <TooltipLabel
              label="Impulses"
              labelIcon={Brain}
              tooltip="Narrative goals or behaviors the environment pushes toward."
              className="font-semibold"
            />{' '}
            {environment.impulses.length}
          </div>
          <div>
            <TooltipLabel
              label="Features"
              labelIcon={Sparkles}
              tooltip="Actions, reactions, or passive effects for the scene."
              className="font-semibold"
            />{' '}
            {environment.features.length}
          </div>
        </div>

        {environment.impulses.length > 0 && (
          <div className="bg-card space-y-2 rounded-lg border p-3 text-xs">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-300">
                  <Brain className="size-3" />
                  Impulses
                </div>
              </TooltipTrigger>
              <TooltipContent sideOffset={6}>
                Narrative goals or behaviors this environment drives.
              </TooltipContent>
            </Tooltip>
            <ul className="text-muted-foreground list-disc space-y-1 pl-4">
              {environment.impulses
                .slice(0, compact ? 2 : 3)
                .map((impulse, idx) => (
                  <li key={idx}>{impulse}</li>
                ))}
            </ul>
          </div>
        )}

        {environment.features.length > 0 && (
          <div className="bg-card space-y-2 rounded-lg border p-3 text-xs">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-300">
                  <Sparkles className="size-3" />
                  Features
                </div>
              </TooltipTrigger>
              <TooltipContent sideOffset={6}>
                Actions, reactions, or passive effects for the scene.
              </TooltipContent>
            </Tooltip>
            <ul className="text-muted-foreground list-disc space-y-1 pl-4">
              {environment.features
                .slice(0, compact ? 2 : 3)
                .map((feature, idx) => (
                  <li key={idx}>{formatFeature(feature)}</li>
                ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

function EnvironmentDetail({ environment }: { environment: EnvironmentItem }) {
  return (
    <div className="space-y-6">
      <div className="-mx-4 -mt-4 bg-linear-to-r from-emerald-600 via-teal-600 to-sky-600 p-6">
        <div className="rounded-xl bg-black/30 p-4">
          <h2 className="text-2xl font-semibold text-white drop-shadow">
            <TreePine className="mr-2 inline-block size-7" />
            {environment.name}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge className="border-slate-900/40 bg-slate-900/80 text-white">
              <TierIcon tier={environment.tier} className="mr-1 size-4" /> Tier{' '}
              {environment.tier}
            </Badge>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className="border-slate-900/40 bg-slate-900/80 text-white">
                  <TypeIcon type={environment.type} className="mr-1 size-4" />{' '}
                  {environment.type}
                </Badge>
              </TooltipTrigger>
              <TooltipContent sideOffset={6}>
                {getTypeDescription(environment.type)}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="bg-card space-y-2 rounded-lg border p-4">
        <div className="mb-1">
          <div className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-300">
            <TreePine className="size-3" />
            Overview
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          {environment.description}
        </p>
      </div>

      <div className="bg-card space-y-2 rounded-lg border p-4">
        <div className="mb-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="inline-flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-sky-700 uppercase dark:text-sky-300">
                <Target className="size-3" />
                Scene Stats
              </div>
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>
              Key scene difficulty and type.
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <TooltipLabel
              label="Difficulty"
              labelIcon={Target}
              tooltip="Target number to meet or beat in this environment."
              className="font-semibold"
            />{' '}
            {formatDifficulty(environment.difficulty)}
          </div>
          <div>
            <TooltipLabel
              label="Type"
              labelIcon={Compass}
              tooltip="Scene style this environment supports most naturally."
              className="font-semibold"
            />{' '}
            {environment.type}
          </div>
        </div>
      </div>

      {environment.impulses.length > 0 && (
        <div className="bg-card space-y-2 rounded-lg border p-4">
          <div className="mb-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-300">
                  <Brain className="size-3" />
                  Impulses
                </div>
              </TooltipTrigger>
              <TooltipContent sideOffset={6}>
                Narrative goals or behaviors the environment pushes toward.
              </TooltipContent>
            </Tooltip>
          </div>
          <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-sm">
            {environment.impulses.map((impulse, idx) => (
              <li key={idx}>{impulse}</li>
            ))}
          </ul>
        </div>
      )}

      {environment.potentialAdversaries.length > 0 && (
        <div className="bg-card space-y-2 rounded-lg border p-4">
          <div className="mb-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-rose-700 uppercase dark:text-rose-300">
                  <Swords className="size-3" />
                  Potential Adversaries
                </div>
              </TooltipTrigger>
              <TooltipContent sideOffset={6}>
                Common adversaries that appear in this environment.
              </TooltipContent>
            </Tooltip>
          </div>
          <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-sm">
            {environment.potentialAdversaries.map((entry, idx) => (
              <li key={idx}>{entry}</li>
            ))}
          </ul>
        </div>
      )}

      {environment.features.length > 0 && (
        <div className="bg-card space-y-2 rounded-lg border p-4">
          <div className="mb-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-300">
                  <Sparkles className="size-3" />
                  Features
                </div>
              </TooltipTrigger>
              <TooltipContent sideOffset={6}>
                Actions, reactions, or passive effects for the scene.
              </TooltipContent>
            </Tooltip>
          </div>
          <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-sm">
            {environment.features.map((feature, idx) => (
              <li key={idx}>{formatFeature(feature)}</li>
            ))}
          </ul>
        </div>
      )}
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
  const [sortBy, setSortBy] = React.useState<EnvironmentSortKey>('name');
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc');
  const [selectedEnvironment, setSelectedEnvironment] =
    React.useState<EnvironmentItem | null>(null);

  const handleCloseItem = React.useCallback(() => {
    React.startTransition(() => {
      setSelectedEnvironment(null);
    });
  }, []);

  const { data: allEnvironments, isLoading: isInitialLoading } =
    useDeferredLoad(loadAllEnvironments);

  const totalCount = allEnvironments?.length ?? 0;

  const filteredEnvironments = React.useMemo(() => {
    if (!allEnvironments) return [];
    const filtered = filterEnvironments(
      allEnvironments,
      search,
      tierFilter,
      typeFilter
    );
    return sortEnvironments(filtered, sortBy, sortDir);
  }, [allEnvironments, tierFilter, typeFilter, search, sortBy, sortDir]);

  const { deferredItems: deferredEnvironments, isPending: isFiltering } =
    useDeferredItems(filteredEnvironments);

  useKeyboardNavigation({
    items: deferredEnvironments,
    selectedItem: selectedEnvironment,
    onSelect: setSelectedEnvironment,
    onClose: handleCloseItem,
  });

  if (isInitialLoading) {
    return <ReferencePageSkeleton showFilters={false} />;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <EnvironmentsHeader
        filteredCount={filteredEnvironments.length}
        totalCount={totalCount}
        tierFilter={tierFilter}
        typeFilter={typeFilter}
        sortBy={sortBy}
        sortDir={sortDir}
        search={search}
        onTierFilterChange={setTierFilter}
        onTypeFilterChange={setTypeFilter}
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
          <EnvironmentsGrid
            items={deferredEnvironments}
            isMobile={isMobile}
            onSelect={setSelectedEnvironment}
          />

          {deferredEnvironments.length === 0 && !isFiltering && (
            <EnvironmentsEmptyState
              onClear={() => {
                setSearch('');
                setTierFilter('all');
                setTypeFilter('all');
              }}
            />
          )}
        </div>
      </div>

      <BackToTop scrollRef={scrollRef} />

      <EnvironmentDetailSheet
        selectedEnvironment={selectedEnvironment}
        onClose={handleCloseItem}
      />
    </div>
  );
}
