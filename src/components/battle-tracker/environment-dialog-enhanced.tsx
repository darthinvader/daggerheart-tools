import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Crosshair,
  Filter,
  MapPin,
  Plus,
  Search,
  Skull,
  Sparkles,
  TreePine,
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
import type { Environment } from '@/lib/schemas/environments';

const TIER_OPTIONS = ['All', '1', '2', '3', '4'] as const;
const TYPE_OPTIONS = [
  'All',
  'Exploration',
  'Event',
  'Social',
  'Traversal',
] as const;

// ============== Style Constants ==============

const TIER_COLORS: Record<string, string> = {
  '1': 'bg-green-500/20 text-green-700 dark:text-green-400',
  '2': 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
  '3': 'bg-orange-500/20 text-orange-700 dark:text-orange-400',
  '4': 'bg-red-500/20 text-red-700 dark:text-red-400',
};

const TYPE_ICONS: Record<string, string> = {
  Wilderness: '🌲',
  Urban: '🏛️',
  Dungeon: '🏰',
  Supernatural: '✨',
  Aquatic: '🌊',
  Social: '💬',
};

const FEATURE_TYPE_COLORS: Record<string, string> = {
  Passive: 'bg-gray-500/20 text-gray-700 dark:text-gray-300',
  Action: 'bg-green-500/20 text-green-700 dark:text-green-400',
  Reaction: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
  Feature: 'bg-purple-500/20 text-purple-700 dark:text-purple-400',
};

// ============== Helper Components ==============

function EnvironmentBadges({ environment }: { environment: Environment }) {
  return (
    <div className="mt-1 flex flex-wrap gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={`text-xs ${TIER_COLORS[environment.tier] ?? ''}`}>
            T{environment.tier}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>Tier {environment.tier}</TooltipContent>
      </Tooltip>
      <Badge variant="outline" className="text-xs">
        <MapPin className="mr-1 size-3" />
        {environment.type}
      </Badge>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className="text-xs">
            <Crosshair className="mr-1 size-3" />
            {environment.difficulty}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>Difficulty</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className="text-xs text-purple-600 dark:text-purple-400"
          >
            <Zap className="mr-1 size-3" />
            {environment.features.length}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>{environment.features.length} Features</TooltipContent>
      </Tooltip>
    </div>
  );
}

type EnvironmentFeature =
  | string
  | { name: string; type?: string; description?: string };

function getEnvFeatureType(f: EnvironmentFeature): string {
  if (typeof f === 'string') {
    if (f.includes('Passive')) return 'Passive';
    if (f.includes('Action')) return 'Action';
    if (f.includes('Reaction')) return 'Reaction';
    return 'Feature';
  }
  return f.type ?? 'Feature';
}

function EnvironmentFeatureItem({ feature }: { feature: EnvironmentFeature }) {
  const featureName =
    typeof feature === 'string' ? feature.split(' - ')[0] : feature.name;
  const featureDesc =
    typeof feature === 'string' ? feature : feature.description;
  const featureType = getEnvFeatureType(feature);

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

const GM_ENVIRONMENT_TIPS = [
  {
    title: 'Environment Purpose',
    content:
      'Environments add hazards, story beats, and terrain effects. They have Difficulty, features, and impulses that guide GM narration.',
  },
  {
    title: 'Impulses',
    content:
      'Impulses describe what the environment "wants" to do. Use them to inform GM moves and add atmosphere.',
  },
  {
    title: 'Features',
    content:
      'Environment features are Passives, Actions, or Reactions. Toggle them on/off as the scene evolves.',
  },
  {
    title: 'Potential Adversaries',
    content:
      'Each environment lists thematic adversaries. Use them to populate encounters that fit the setting.',
  },
  {
    title: 'Countdown Timers',
    content:
      'Use countdowns for rising tension: collapsing structures, approaching storms, ritual completions.',
  },
];

interface AddEnvironmentDialogEnhancedProps {
  isOpen: boolean;
  environments: Environment[];
  onOpenChange: (open: boolean) => void;
  onAdd: (environment: Environment) => void;
}

export function AddEnvironmentDialogEnhanced({
  isOpen,
  environments,
  onOpenChange,
  onAdd,
}: AddEnvironmentDialogEnhancedProps) {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return environments.filter(env => {
      const matchesSearch =
        search === '' ||
        env.name.toLowerCase().includes(search.toLowerCase()) ||
        env.description.toLowerCase().includes(search.toLowerCase());
      const matchesTier = tierFilter === 'All' || env.tier === tierFilter;
      const matchesType = typeFilter === 'All' || env.type === typeFilter;
      return matchesSearch && matchesTier && matchesType;
    });
  }, [environments, search, tierFilter, typeFilter]);

  const activeFilters =
    (tierFilter !== 'All' ? 1 : 0) + (typeFilter !== 'All' ? 1 : 0);

  const clearFilters = () => {
    setTierFilter('All');
    setTypeFilter('All');
    setSearch('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-7xl flex-col gap-0 p-0">
        <DialogHeader className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Add Environment</DialogTitle>
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
                    <Label className="text-xs">Type</Label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TYPE_OPTIONS.map(t => (
                          <SelectItem key={t} value={t}>
                            {t === 'All' ? 'All Types' : t}
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
                  {filtered.length} environment
                  {filtered.length === 1 ? '' : 's'} found
                </p>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filtered.map(env => (
                    <EnvironmentResultCard
                      key={env.name}
                      environment={env}
                      isExpanded={expandedId === env.name}
                      onToggle={() =>
                        setExpandedId(expandedId === env.name ? null : env.name)
                      }
                      onAdd={() => onAdd(env)}
                    />
                  ))}
                </div>
                {filtered.length === 0 && (
                  <div className="text-muted-foreground py-12 text-center">
                    No environments match your search
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Help Sidebar */}
          {showHelp && (
            <div className="hidden w-80 flex-col border-l md:flex">
              <div className="bg-muted/30 border-b px-4 py-3">
                <h3 className="font-semibold">Environment Guide</h3>
                <p className="text-muted-foreground text-xs">
                  Daggerheart GM tips
                </p>
              </div>
              <ScrollArea className="flex-1">
                <div className="space-y-3 p-4">
                  {GM_ENVIRONMENT_TIPS.map(tip => (
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

function EnvironmentResultCard({
  environment,
  isExpanded,
  onToggle,
  onAdd,
}: {
  environment: Environment;
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
                    <span className="shrink-0 text-lg" title={environment.type}>
                      {TYPE_ICONS[environment.type] ?? (
                        <TreePine className="size-4" />
                      )}
                    </span>
                    <p className="truncate text-sm font-semibold">
                      {environment.name}
                    </p>
                  </div>
                  <EnvironmentBadges environment={environment} />
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
            <div className="bg-muted/30 space-y-3 p-3">
              <p className="text-muted-foreground text-sm">
                {environment.description}
              </p>

              <div className="rounded-md border border-amber-500/20 bg-amber-500/10 p-2">
                <p className="mb-1 flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                  <Sparkles className="size-3" /> Impulses
                </p>
                <div className="flex flex-wrap gap-1">
                  {environment.impulses.map(imp => (
                    <Badge
                      key={imp}
                      className="bg-amber-500/20 text-xs text-amber-700 dark:text-amber-400"
                    >
                      {imp}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Potential Adversaries */}
              {environment.potentialAdversaries.length > 0 && (
                <div className="rounded-md border border-red-500/20 bg-red-500/10 p-2">
                  <p className="mb-1 flex items-center gap-1 text-xs font-medium text-red-700 dark:text-red-400">
                    <Skull className="size-3" /> Potential Adversaries
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {environment.potentialAdversaries.map((adv, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {adv}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {environment.features.length > 0 && (
                <div>
                  <p className="mb-2 flex items-center gap-1 text-xs font-medium">
                    <Zap className="size-3" /> Features (
                    {environment.features.length})
                  </p>
                  <ul className="space-y-2">
                    {environment.features.map((f, i) => (
                      <EnvironmentFeatureItem key={i} feature={f} />
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
