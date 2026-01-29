// Classes reference page with page-specific detail components

import { createFileRoute } from '@tanstack/react-router';
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  type LucideIcon,
  Search,
  X,
} from 'lucide-react';
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  ALL_CLASSES,
  type GameClass,
  type GameSubclass,
} from '@/lib/data/classes';
import {
  Backpack,
  HelpCircle,
  Layers,
  Link2,
  Shield,
  Sparkles,
  Star,
  Target,
} from '@/lib/icons';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/references/classes')({
  component: ClassesReferencePage,
});

// Domain color mappings
const domainColors: Record<string, string> = {
  Arcana:
    'bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/30',
  Blade: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30',
  Bone: 'bg-stone-500/10 text-stone-700 dark:text-stone-400 border-stone-500/30',
  Codex:
    'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
  Grace: 'bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/30',
  Midnight:
    'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/30',
  Sage: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
  Splendor:
    'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30',
  Valor:
    'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30',
};

// Class-specific gradient colors
const classGradients: Record<string, string> = {
  Bard: 'from-pink-500 to-rose-600',
  Druid: 'from-green-500 to-emerald-600',
  Guardian: 'from-slate-500 to-zinc-600',
  Ranger: 'from-lime-500 to-green-600',
  Rogue: 'from-purple-500 to-violet-600',
  Seraph: 'from-yellow-400 to-amber-500',
  Sorcerer: 'from-red-500 to-orange-600',
  Warrior: 'from-red-600 to-rose-700',
  Wizard: 'from-blue-500 to-indigo-600',
};

const featureTypeColors: Record<string, string> = {
  foundation:
    'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
  specialization:
    'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30',
  mastery:
    'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30',
  active:
    'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
};

const featureBorderColors: Record<string, string> = {
  foundation: '#10b981',
  specialization: '#3b82f6',
  mastery: '#8b5cf6',
  active: '#f59e0b',
};

type SectionLabelProps = {
  label: string;
  tooltip: string;
  icon: LucideIcon;
  className?: string;
};

function SectionLabel({
  label,
  tooltip,
  icon: Icon,
  className,
}: SectionLabelProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase',
            className
          )}
        >
          <Icon className="size-3" />
          {label}
        </div>
      </TooltipTrigger>
      <TooltipContent sideOffset={6}>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

interface ClassOutlineProps {
  classes: readonly GameClass[];
  selectedClass: string | null;
  onSelectClass: (name: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
}

function ClassOutline({
  classes,
  selectedClass,
  onSelectClass,
  search,
  onSearchChange,
}: ClassOutlineProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Search */}
      <div className="shrink-0 border-b p-4">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search classes..."
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            className="pr-9 pl-9"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="text-muted-foreground shrink-0 border-b px-4 py-2 text-sm">
        {classes.length} of {ALL_CLASSES.length} classes
      </div>

      {/* Class list - scrollable */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="space-y-1 p-2">
          {classes.map(gameClass => {
            const isSelected = selectedClass === gameClass.name;
            return (
              <button
                key={gameClass.name}
                onClick={() => onSelectClass(gameClass.name)}
                className={cn(
                  'w-full rounded-md px-3 py-2 text-left text-sm transition-colors',
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{gameClass.name}</span>
                  <ChevronRight className="size-4 opacity-50" />
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {gameClass.domains.slice(0, 2).map(domain => (
                    <span
                      key={domain}
                      className={cn(
                        'rounded px-1.5 py-0.5 text-xs',
                        isSelected
                          ? 'bg-primary-foreground/20 text-primary-foreground'
                          : domainColors[domain]
                      )}
                    >
                      {domain}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SubclassCard({ subclass }: { subclass: GameSubclass }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const spellcastTrait =
    'spellcastTrait' in subclass ? subclass.spellcastTrait : null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card
        className={cn(
          'transition-all hover:shadow-md',
          isOpen && 'ring-primary/20 ring-2'
        )}
      >
        <CollapsibleTrigger className="w-full text-left">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  {subclass.name}
                  <ChevronDown
                    className={cn(
                      'size-4 transition-transform',
                      isOpen && 'rotate-180'
                    )}
                  />
                </CardTitle>
                <CardDescription className="mt-1">
                  {subclass.description}
                </CardDescription>
              </div>
              {spellcastTrait && (
                <Badge variant="outline" className="shrink-0">
                  {spellcastTrait}
                </Badge>
              )}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-2">
            <div className="space-y-3">
              {subclass.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-muted/50 rounded-lg border-l-4 p-3"
                  style={{
                    borderLeftColor:
                      featureBorderColors[feature.type] ??
                      featureBorderColors.active,
                  }}
                >
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <span className="font-semibold">{feature.name}</span>
                    <div className="flex shrink-0 gap-1.5">
                      <Badge
                        variant="outline"
                        className={
                          featureTypeColors[feature.type] ??
                          featureTypeColors.active
                        }
                      >
                        {feature.type}
                      </Badge>
                      <Badge variant="outline">Lvl {feature.level}</Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

function ClassDetail({ gameClass }: { gameClass: GameClass }) {
  const gradient =
    classGradients[gameClass.name] ?? 'from-gray-500 to-slate-600';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`-mx-4 -mt-4 bg-linear-to-r p-6 ${gradient}`}>
        <div className="rounded-xl bg-black/35 p-4">
          <h2 className="text-2xl font-semibold text-white drop-shadow">
            <Shield className="mr-2 inline-block size-6" />
            {gameClass.name}
          </h2>
          <p className="mt-2 text-white/85">{gameClass.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {gameClass.domains.map(domain => (
              <Badge
                key={domain}
                className="border-slate-900/40 bg-slate-900/80 text-white"
              >
                {domain}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Base Stats */}
      <div className="bg-card rounded-lg border p-4">
        <div className="mb-3">
          <SectionLabel
            label="Base Stats"
            tooltip="Starting hit points and evasion for a new character."
            icon={Target}
            className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-muted-foreground text-sm">Hit Points</div>
              </TooltipTrigger>
              <TooltipContent sideOffset={6}>
                Starting HP before level-ups and gear.
              </TooltipContent>
            </Tooltip>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {gameClass.startingHitPoints}
            </div>
          </div>
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-muted-foreground text-sm">Evasion</div>
              </TooltipTrigger>
              <TooltipContent sideOffset={6}>
                Base target number to avoid hits.
              </TooltipContent>
            </Tooltip>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {gameClass.startingEvasion}
            </div>
          </div>
        </div>
      </div>

      {/* Hope Feature */}
      <div className="bg-card rounded-lg border p-4">
        <div className="mb-3">
          <SectionLabel
            label="Hope Feature"
            tooltip="Signature feature powered by spending Hope."
            icon={Sparkles}
            className="border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300"
          />
        </div>
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="mb-1 flex items-center justify-between gap-3">
            <span className="font-semibold text-yellow-700 dark:text-yellow-300">
              {gameClass.hopeFeature.name}
            </span>
            <Badge className="border-yellow-500/30 bg-yellow-500/15 text-yellow-700 dark:text-yellow-300">
              {gameClass.hopeFeature.hopeCost} Hope
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            {gameClass.hopeFeature.description}
          </p>
        </div>
      </div>

      {/* Class Features */}
      {gameClass.classFeatures.length > 0 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-3">
            <SectionLabel
              label="Class Features"
              tooltip="Foundation, specialization, and mastery features unique to this class."
              icon={Star}
              className="border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300"
            />
          </div>
          <div className="space-y-2">
            {gameClass.classFeatures.map((feature, idx) => (
              <div key={idx} className="bg-muted/50 rounded-lg p-3">
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-medium">{feature.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {feature.type}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Class Items */}
      {gameClass.classItems.length > 0 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-3">
            <SectionLabel
              label="Class Items"
              tooltip="Starting equipment or signature items for this class."
              icon={Backpack}
              className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
            />
          </div>
          <ul className="text-muted-foreground list-inside list-disc text-sm">
            {gameClass.classItems.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Subclasses */}
      <div className="bg-card rounded-lg border p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <SectionLabel
            label="Subclasses"
            tooltip="Specializations that add features and flavor."
            icon={Layers}
            className="border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300"
          />
          <Badge variant="outline">{gameClass.subclasses.length}</Badge>
        </div>
        <div className="space-y-4">
          {gameClass.subclasses.map(subclass => (
            <SubclassCard key={subclass.name} subclass={subclass} />
          ))}
        </div>
      </div>

      {/* Background Questions */}
      {gameClass.backgroundQuestions.length > 0 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-3">
            <SectionLabel
              label="Background Questions"
              tooltip="Prompts to ground your character's backstory."
              icon={HelpCircle}
              className="border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300"
            />
          </div>
          <ul className="text-muted-foreground list-inside list-decimal space-y-1 text-sm">
            {gameClass.backgroundQuestions.map((q, idx) => (
              <li key={idx}>{q}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Connections */}
      {gameClass.connections.length > 0 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-3">
            <SectionLabel
              label="Connections"
              tooltip="Relationship prompts and bonds tied to this class."
              icon={Link2}
              className="border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300"
            />
          </div>
          <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
            {gameClass.connections.map((c, idx) => (
              <li key={idx}>{c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Stable loader function for useDeferredLoad
const loadAllClasses = () => [...ALL_CLASSES];

function filterClasses(allClasses: readonly GameClass[], search: string) {
  if (!search) return [...allClasses];
  const searchLower = search.toLowerCase();
  return [...allClasses].filter(
    gameClass =>
      gameClass.name.toLowerCase().includes(searchLower) ||
      gameClass.description.toLowerCase().includes(searchLower) ||
      gameClass.domains.some(domain =>
        domain.toLowerCase().includes(searchLower)
      ) ||
      gameClass.subclasses.some(subclass =>
        subclass.name.toLowerCase().includes(searchLower)
      )
  );
}

function ClassCard({
  gameClass,
  onSelect,
}: {
  gameClass: GameClass;
  onSelect: (name: string) => void;
}) {
  const gradient =
    classGradients[gameClass.name] ?? 'from-gray-500 to-slate-600';
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Card
          className="group hover:border-primary/50 h-full cursor-pointer overflow-hidden transition-all hover:scale-[1.01] hover:shadow-xl"
          onClick={() => onSelect(gameClass.name)}
        >
          <div className={`h-1 bg-linear-to-r ${gradient}`} />
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Shield className="text-muted-foreground size-4" />
                  {gameClass.name}
                  <ChevronRight className="text-muted-foreground size-4 opacity-70" />
                </CardTitle>
                <CardDescription className="text-sm">
                  {gameClass.description}
                </CardDescription>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {gameClass.domains.map(domain => (
                <Badge
                  key={domain}
                  className={domainColors[domain] ?? 'bg-muted'}
                >
                  {domain}
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="bg-muted/40 text-muted-foreground grid grid-cols-3 gap-2 rounded-lg border p-3 text-xs">
              <div>
                <span className="text-foreground font-semibold">
                  {gameClass.startingHitPoints}
                </span>{' '}
                HP
              </div>
              <div>
                <span className="text-foreground font-semibold">
                  {gameClass.startingEvasion}
                </span>{' '}
                Evasion
              </div>
              <div>
                <span className="text-foreground font-semibold">
                  {gameClass.subclasses.length}
                </span>{' '}
                Subclasses
              </div>
            </div>
          </CardContent>
        </Card>
      </TooltipTrigger>
      <TooltipContent sideOffset={6}>
        View class details, subclasses, and signature features.
      </TooltipContent>
    </Tooltip>
  );
}

type ClassesHeaderProps = {
  filteredCount: number;
  totalCount: number;
  subclassCount: number;
  isMobile: boolean;
  classes: GameClass[];
  selectedClass: string | null;
  search: string;
  onSearchChange: (value: string) => void;
  onSelectClass: (name: string) => void;
};

function ClassesHeader({
  filteredCount,
  totalCount,
  subclassCount,
  isMobile,
  classes,
  selectedClass,
  search,
  onSearchChange,
  onSelectClass,
}: ClassesHeaderProps) {
  return (
    <div className="bg-background shrink-0 border-b px-4 py-3">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Shield className="size-4 text-purple-500" />
              <span className="bg-linear-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">
                Classes & Subclasses
              </span>
            </div>
            <ResultsCounter
              filtered={filteredCount}
              total={totalCount}
              label="classes"
              suffix={` with ${subclassCount} subclasses`}
            />
          </div>
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Search className="mr-2 size-4" />
                  Browse Classes
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <ClassOutline
                  classes={classes}
                  selectedClass={selectedClass}
                  onSelectClass={onSelectClass}
                  search={search}
                  onSearchChange={onSearchChange}
                />
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </div>
  );
}

function ClassesContent({
  selectedClass,
  classes,
  onSelectClass,
  onClearSelection,
}: {
  selectedClass: GameClass | null;
  classes: GameClass[];
  onSelectClass: (name: string) => void;
  onClearSelection: () => void;
}) {
  if (selectedClass) {
    return (
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to all classes
        </Button>
        <ClassDetail gameClass={selectedClass} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {classes.map(gameClass => (
        <ClassCard
          key={gameClass.name}
          gameClass={gameClass}
          onSelect={onSelectClass}
        />
      ))}
    </div>
  );
}

function ClassesEmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="text-muted-foreground py-12 text-center">
      <p>No classes match your search.</p>
      <Button variant="link" onClick={onClear} className="mt-2">
        Clear search
      </Button>
    </div>
  );
}

function ClassDetailSheet({
  selectedClass,
  onClose,
}: {
  selectedClass: GameClass | null;
  onClose: () => void;
}) {
  if (!selectedClass) return null;
  return (
    <Sheet open={!!selectedClass} onOpenChange={open => !open && onClose()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col p-0 sm:max-w-lg"
        hideCloseButton
      >
        <SheetHeader className="shrink-0 border-b p-4">
          <SheetTitle className="flex items-center justify-between gap-2">
            <span className="truncate">{selectedClass.name}</span>
            <div className="flex shrink-0 items-center gap-2">
              <KeyboardHint showNavigation={false} />
              <DetailCloseButton onClose={onClose} />
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <ClassDetail gameClass={selectedClass} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ClassesReferencePage() {
  const isMobile = useIsMobile();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [search, setSearch] = React.useState('');
  const [selectedClass, setSelectedClass] = React.useState<string | null>(null);

  // Defer data loading until after initial paint
  const { data: allClasses, isLoading: isInitialLoading } =
    useDeferredLoad(loadAllClasses);

  // Filter classes by search
  const filteredClasses = React.useMemo(() => {
    if (!allClasses) return [];
    return filterClasses(allClasses, search);
  }, [allClasses, search]);

  // Use deferred rendering for smooth filtering on mobile
  const { deferredItems: deferredClasses, isPending: isFiltering } =
    useDeferredItems(filteredClasses);

  const selectedClassData = React.useMemo(
    () => allClasses?.find(c => c.name === selectedClass) ?? null,
    [allClasses, selectedClass]
  );

  const totalCount = allClasses?.length ?? 0;

  useKeyboardNavigation<GameClass>({
    items: deferredClasses,
    selectedItem: selectedClassData,
    onSelect: item => setSelectedClass(item?.name ?? null),
    onClose: () => setSelectedClass(null),
  });

  // Show skeleton while loading initial data
  if (isInitialLoading) {
    return <ReferencePageSkeleton showFilters={!isMobile} />;
  }

  return (
    <div className="flex min-h-0 flex-1">
      {/* Sidebar - Class outline */}
      {!isMobile && (
        <aside className="bg-muted/30 flex w-64 shrink-0 flex-col border-r">
          <ClassOutline
            classes={deferredClasses}
            selectedClass={selectedClass}
            onSelectClass={setSelectedClass}
            search={search}
            onSearchChange={setSearch}
          />
        </aside>
      )}

      {/* Main content */}
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Header */}
        <ClassesHeader
          filteredCount={filteredClasses.length}
          totalCount={totalCount}
          subclassCount={filteredClasses.reduce(
            (sum: number, gameClass) => sum + gameClass.subclasses.length,
            0
          )}
          isMobile={isMobile}
          classes={deferredClasses}
          selectedClass={selectedClass}
          search={search}
          onSearchChange={setSearch}
          onSelectClass={setSelectedClass}
        />

        {/* Content - scrollable */}
        <div
          ref={scrollRef}
          className="relative min-h-0 flex-1 overflow-y-auto"
        >
          {/* Loading overlay during filtering */}
          {isFiltering && (
            <div className="bg-background/60 absolute inset-0 z-10 flex items-start justify-center pt-20 backdrop-blur-[1px]">
              <div className="bg-background rounded-lg border p-4 shadow-lg">
                <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
              </div>
            </div>
          )}
          <div className="p-4">
            <ClassesContent
              selectedClass={selectedClassData}
              classes={deferredClasses}
              onSelectClass={setSelectedClass}
              onClearSelection={() => setSelectedClass(null)}
            />

            {deferredClasses.length === 0 && !isFiltering && (
              <ClassesEmptyState onClear={() => setSearch('')} />
            )}
          </div>
        </div>

        {/* Back to top */}
        <BackToTop scrollRef={scrollRef} />
      </div>

      {/* Mobile sheet for class detail */}
      {isMobile && (
        <ClassDetailSheet
          selectedClass={selectedClassData}
          onClose={() => setSelectedClass(null)}
        />
      )}
    </div>
  );
}
