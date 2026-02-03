import {
  AlertTriangle,
  Calculator,
  Check,
  ChevronDown,
  HelpCircle,
  Minus,
  Plus,
  PlusCircle,
  Scale,
  Sparkles,
  Swords,
  Target,
  Users,
  Wand2,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import {
  AdversarySelectCard,
  ROLE_POINT_COSTS,
} from '@/components/battle-tracker/adversary-card-shared';
import { AdversaryDetailPanel } from '@/components/battle-tracker/adversary-detail-panel';
import { CustomAdversaryBuilder } from '@/components/battle-tracker/custom-adversary-builder';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ADVERSARIES } from '@/lib/data/adversaries';
import type { Adversary } from '@/lib/schemas/adversaries';
import { cn } from '@/lib/utils';

// =====================================================================================
// Difficulty Modifiers
// =====================================================================================

const DIFFICULTY_MODIFIERS: Record<
  string,
  { label: string; modifier: number; color: string }
> = {
  trivial: { label: 'Trivial', modifier: -4, color: 'text-emerald-500' },
  easy: { label: 'Easy', modifier: -2, color: 'text-green-500' },
  standard: { label: 'Standard', modifier: 0, color: 'text-blue-500' },
  challenging: { label: 'Challenging', modifier: 2, color: 'text-amber-500' },
  deadly: { label: 'Deadly', modifier: 4, color: 'text-red-500' },
};

// =====================================================================================
// Types
// =====================================================================================

interface SelectedAdversary {
  adversary: Adversary;
  count: number;
}

interface EncounterSuggestion {
  name: string;
  description: string;
  adversaries: SelectedAdversary[];
}

function addAdversarySelection(
  prev: SelectedAdversary[],
  adversary: Adversary
): SelectedAdversary[] {
  const existing = prev.find(s => s.adversary.name === adversary.name);
  if (existing) {
    return prev.map(s =>
      s.adversary.name === adversary.name ? { ...s, count: s.count + 1 } : s
    );
  }
  return [...prev, { adversary, count: 1 }];
}

function removeAdversarySelection(
  prev: SelectedAdversary[],
  name: string
): SelectedAdversary[] {
  const existing = prev.find(s => s.adversary.name === name);
  if (existing && existing.count > 1) {
    return prev.map(s =>
      s.adversary.name === name ? { ...s, count: s.count - 1 } : s
    );
  }
  return prev.filter(s => s.adversary.name !== name);
}

function getEncounterSuggestions({
  partyTier,
  pcCount,
}: {
  partyTier: Adversary['tier'];
  pcCount: number;
}): EncounterSuggestion[] {
  const tierAdversaries = ADVERSARIES.filter(adv => adv.tier === partyTier);
  const solos = tierAdversaries.filter(adv => adv.role === 'Solo');
  const standards = tierAdversaries.filter(
    adv => adv.role === 'Standard' || adv.role === 'Bruiser'
  );
  const minions = tierAdversaries.filter(
    adv => adv.role === 'Minion' || adv.role === 'Horde'
  );

  const suggestions: EncounterSuggestion[] = [];

  if (solos.length > 0) {
    const solo = solos[0];
    suggestions.push({
      name: 'Boss Battle',
      description: '1 Solo adversary for a climactic fight',
      adversaries: [{ adversary: solo, count: 1 }],
    });
  }

  if (standards.length > 0 && minions.length > 0) {
    const std = standards[0];
    const min = minions[0];
    suggestions.push({
      name: 'Standard Encounter',
      description: '2 Standards + Minions for dynamic combat',
      adversaries: [
        { adversary: std, count: 2 },
        { adversary: min, count: Math.max(1, pcCount - 2) },
      ],
    });
  }

  if (minions.length > 0) {
    const min = minions[0];
    suggestions.push({
      name: 'Swarm Encounter',
      description: 'Many weak foes for action-economy fun',
      adversaries: [{ adversary: min, count: Math.max(4, pcCount * 2) }],
    });
  }

  return suggestions;
}

type DifficultyKey = keyof typeof DIFFICULTY_MODIFIERS;

interface FightBuilderWizardProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddAdversaries: (
    adversaries: { adversary: Adversary; count: number }[]
  ) => void;
  currentCharacterCount: number;
}

// =====================================================================================
// Helper Components
// =====================================================================================

function DifficultySelector({
  value,
  onChange,
}: {
  value: DifficultyKey;
  onChange: (v: DifficultyKey) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-1.5">
      {Object.entries(DIFFICULTY_MODIFIERS).map(([key, val]) => (
        <Button
          key={key}
          size="sm"
          variant={value === key ? 'default' : 'ghost'}
          className={cn(
            'h-8 justify-between',
            value !== key && 'hover:bg-muted'
          )}
          onClick={() => onChange(key as DifficultyKey)}
        >
          <span>{val.label}</span>
          <span className={cn('text-xs', val.color)}>
            {val.modifier >= 0 ? '+' : ''}
            {val.modifier} pts
          </span>
        </Button>
      ))}
    </div>
  );
}

function TierSelector({
  value,
  onChange,
}: {
  value: '1' | '2' | '3' | '4';
  onChange: (v: '1' | '2' | '3' | '4') => void;
}) {
  return (
    <div className="flex gap-1">
      {(['1', '2', '3', '4'] as const).map(t => (
        <Button
          key={t}
          size="sm"
          variant={value === t ? 'default' : 'outline'}
          className="h-8 flex-1"
          onClick={() => onChange(t)}
        >
          {t}
        </Button>
      ))}
    </div>
  );
}

function CountControl({
  value,
  onChange,
  min = 1,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
}) {
  return (
    <div className="flex items-center gap-1">
      <Button
        size="icon"
        variant="outline"
        className="size-8"
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Minus className="size-3" />
      </Button>
      <Input
        type="number"
        value={value}
        onChange={e => onChange(Math.max(min, parseInt(e.target.value) || min))}
        className="h-8 w-12 text-center"
      />
      <Button
        size="icon"
        variant="outline"
        className="size-8"
        onClick={() => onChange(value + 1)}
      >
        <Plus className="size-3" />
      </Button>
    </div>
  );
}

interface BattlePointsDisplayProps {
  pcCount: number;
  baseBattlePoints: number;
  modifiedPoints: number;
  spentPoints: number;
  remainingPoints: number;
  difficulty: DifficultyKey;
  isBalanced: boolean;
  isOverBudget: boolean;
}

function BattlePointsCard({
  pcCount,
  baseBattlePoints,
  modifiedPoints,
  spentPoints,
  remainingPoints,
  difficulty,
  isBalanced,
  isOverBudget,
}: BattlePointsDisplayProps) {
  const diffMod = DIFFICULTY_MODIFIERS[difficulty];
  return (
    <Card
      className={cn(
        'border-2 transition-colors',
        isBalanced && 'border-emerald-400 bg-emerald-500/10',
        isOverBudget && 'border-red-400 bg-red-500/10',
        !isBalanced && !isOverBudget && 'border-amber-400 bg-amber-500/10'
      )}
    >
      <CardContent className="space-y-2 p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Base (3×{pcCount}+2)</span>
          <span className="font-mono">{baseBattlePoints}</span>
        </div>
        {diffMod.modifier !== 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Difficulty</span>
            <span className={cn('font-mono', diffMod.color)}>
              {diffMod.modifier >= 0 ? '+' : ''}
              {diffMod.modifier}
            </span>
          </div>
        )}
        <Separator />
        <div className="flex items-center justify-between font-medium">
          <span>Budget</span>
          <span className="font-mono text-lg">{modifiedPoints}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Spent</span>
          <span className="font-mono">{spentPoints}</span>
        </div>
        <Separator />
        <div className="flex items-center justify-between font-semibold">
          <span>Remaining</span>
          <span
            className={cn(
              'font-mono text-lg',
              remainingPoints > 0 && 'text-amber-500',
              remainingPoints < 0 && 'text-red-500',
              remainingPoints === 0 && 'text-emerald-500'
            )}
          >
            {remainingPoints}
          </span>
        </div>
        {isBalanced && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
            <Check className="size-3" />
            Balanced encounter!
          </div>
        )}
        {isOverBudget && (
          <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
            <AlertTriangle className="size-3" />
            Over budget - very deadly!
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getSelectedCount(selectedAdversaries: SelectedAdversary[]): number {
  return selectedAdversaries.reduce((sum, entry) => sum + entry.count, 0);
}

function WizardSidebar({
  pcCount,
  onPcCountChange,
  partyTier,
  onPartyTierChange,
  difficulty,
  onDifficultyChange,
  baseBattlePoints,
  modifiedPoints,
  spentPoints,
  remainingPoints,
  isBalanced,
  isOverBudget,
}: {
  pcCount: number;
  onPcCountChange: (value: number) => void;
  partyTier: Adversary['tier'];
  onPartyTierChange: (value: Adversary['tier']) => void;
  difficulty: DifficultyKey;
  onDifficultyChange: (value: DifficultyKey) => void;
  baseBattlePoints: number;
  modifiedPoints: number;
  spentPoints: number;
  remainingPoints: number;
  isBalanced: boolean;
  isOverBudget: boolean;
}) {
  return (
    <div className="bg-muted/30 w-80 shrink-0 overflow-y-auto border-r p-4">
      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-sm font-semibold">
            <Users className="size-4 text-blue-500" />
            Party Setup
          </Label>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs">PC Count</Label>
              <CountControl
                value={pcCount}
                onChange={onPcCountChange}
                min={1}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs">
                Party Tier
              </Label>
              <TierSelector value={partyTier} onChange={onPartyTierChange} />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-sm font-semibold">
            <Target className="size-4 text-amber-500" />
            Difficulty
          </Label>
          <DifficultySelector
            value={difficulty}
            onChange={onDifficultyChange}
          />
        </div>

        <Separator />

        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-sm font-semibold">
            <Calculator className="size-4 text-emerald-500" />
            Battle Points
          </Label>
          <BattlePointsCard
            pcCount={pcCount}
            baseBattlePoints={baseBattlePoints}
            modifiedPoints={modifiedPoints}
            spentPoints={spentPoints}
            remainingPoints={remainingPoints}
            difficulty={difficulty}
            isBalanced={isBalanced}
            isOverBudget={isOverBudget}
          />
        </div>

        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between"
            >
              <span className="flex items-center gap-2">
                <HelpCircle className="size-4" />
                Role Costs
              </span>
              <ChevronDown className="size-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <div className="grid grid-cols-2 gap-1 text-xs">
              {Object.entries(ROLE_POINT_COSTS).map(([role, cost]) => (
                <div
                  key={role}
                  className="bg-muted flex justify-between rounded px-2 py-1"
                >
                  <span>{role}</span>
                  <span className="font-mono text-amber-500">{cost}pt</span>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}

function AdversarySearchBar({
  search,
  onSearchChange,
  partyTier,
  availableCount,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  partyTier: Adversary['tier'];
  availableCount: number;
}) {
  return (
    <div className="border-b p-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Swords className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder={`Search Tier ${partyTier} adversaries...`}
            className="pl-9"
          />
        </div>
        <Badge variant="secondary" className="shrink-0">
          {availableCount} available
        </Badge>
      </div>
    </div>
  );
}

function SuggestionsPanel({
  suggestions,
  showSuggestions,
  onShowSuggestions,
  onApplySuggestion,
}: {
  suggestions: EncounterSuggestion[];
  showSuggestions: boolean;
  onShowSuggestions: (value: boolean) => void;
  onApplySuggestion: (suggestion: EncounterSuggestion) => void;
}) {
  if (suggestions.length === 0) return null;
  return (
    <div className="border-b bg-amber-500/5 p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400">
          <Sparkles className="size-4" />
          Quick Suggestions
        </div>
        {!showSuggestions && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShowSuggestions(true)}
            className="h-6 text-xs text-amber-600 dark:text-amber-400"
          >
            <Sparkles className="mr-1 size-3" />
            Show Suggestions
          </Button>
        )}
      </div>
      {showSuggestions && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((sug, i) => (
            <TooltipProvider key={i}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onApplySuggestion(sug)}
                    className="h-8"
                  >
                    {sug.name}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{sug.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      )}
    </div>
  );
}

function SelectedAdversariesPanel({
  selectedAdversaries,
  onReset,
  onRemove,
}: {
  selectedAdversaries: SelectedAdversary[];
  onReset: () => void;
  onRemove: (name: string) => void;
}) {
  if (selectedAdversaries.length === 0) return null;
  return (
    <div className="bg-muted/30 shrink-0 border-b p-4">
      <div className="mb-2 flex items-center justify-between text-sm font-semibold">
        <span>Selected ({getSelectedCount(selectedAdversaries)})</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-6 text-xs"
        >
          Clear All
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {selectedAdversaries.map(({ adversary, count }) => (
          <Badge
            key={adversary.name}
            variant="secondary"
            className="gap-2 pr-1"
          >
            <span>{adversary.name}</span>
            <span className="text-amber-500">×{count}</span>
            <span className="text-muted-foreground text-xs">
              ({ROLE_POINT_COSTS[adversary.role] ?? 2}pt each)
            </span>
            <Button
              size="icon"
              variant="ghost"
              className="hover:bg-destructive/20 size-5"
              onClick={() => onRemove(adversary.name)}
            >
              <Minus className="size-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
}

function AdversaryListGrid({
  filteredAdversaries,
  selectedAdversaries,
  remainingPoints,
  viewingAdversary,
  onAdd,
  onRemove,
  onView,
}: {
  filteredAdversaries: Adversary[];
  selectedAdversaries: SelectedAdversary[];
  remainingPoints: number;
  viewingAdversary: Adversary | null;
  onAdd: (adversary: Adversary) => void;
  onRemove: (name: string) => void;
  onView: (adversary: Adversary) => void;
}) {
  return (
    <ScrollArea className="min-h-0 flex-1">
      <div className="grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {filteredAdversaries.map(adv => {
          const selected = selectedAdversaries.find(
            s => s.adversary.name === adv.name
          );
          const cost = ROLE_POINT_COSTS[adv.role] ?? 2;
          const canAfford =
            remainingPoints >= cost || (selected?.count ?? 0) > 0;
          const isViewing = viewingAdversary?.name === adv.name;
          return (
            <div
              key={adv.name}
              className={cn(
                'cursor-pointer rounded-lg transition-all',
                isViewing && 'ring-primary ring-2 ring-offset-2'
              )}
              onClick={() => onView(adv)}
            >
              <AdversarySelectCard
                adversary={adv}
                selectedCount={selected?.count ?? 0}
                canAfford={canAfford}
                showExpandedDetails={false}
                onIncrement={() => onAdd(adv)}
                onDecrement={() => onRemove(adv.name)}
              />
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}

function WizardFooter({
  isBalanced,
  isOverBudget,
  spentPoints,
  modifiedPoints,
  selectedCount,
  onCancel,
  onConfirm,
  disableConfirm,
}: {
  isBalanced: boolean;
  isOverBudget: boolean;
  spentPoints: number;
  modifiedPoints: number;
  selectedCount: number;
  onCancel: () => void;
  onConfirm: () => void;
  disableConfirm: boolean;
}) {
  return (
    <DialogFooter className="border-t px-6 py-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Scale
            className={cn(
              'size-5',
              isBalanced && 'text-emerald-500',
              isOverBudget && 'text-red-500',
              !isBalanced && !isOverBudget && 'text-amber-500'
            )}
          />
          <span>
            {spentPoints} / {modifiedPoints} points used
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={disableConfirm}
            className="gap-2"
          >
            <Swords className="size-4" />
            Add {selectedCount} Adversaries
          </Button>
        </div>
      </div>
    </DialogFooter>
  );
}

// =====================================================================================
// Component
// =====================================================================================

export function FightBuilderWizard({
  isOpen,
  onOpenChange,
  onAddAdversaries,
  currentCharacterCount,
}: FightBuilderWizardProps) {
  // State
  const [pcCount, setPcCount] = useState(currentCharacterCount || 4);
  const [partyTier, setPartyTier] = useState<'1' | '2' | '3' | '4'>('1');
  const [difficulty, setDifficulty] =
    useState<keyof typeof DIFFICULTY_MODIFIERS>('standard');
  const [selectedAdversaries, setSelectedAdversaries] = useState<
    SelectedAdversary[]
  >([]);
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [viewingAdversary, setViewingAdversary] = useState<Adversary | null>(
    null
  );
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);

  // Calculations
  const baseBattlePoints = 3 * pcCount + 2;
  const modifiedPoints =
    baseBattlePoints + DIFFICULTY_MODIFIERS[difficulty].modifier;

  const spentPoints = useMemo(
    () =>
      selectedAdversaries.reduce((sum, { adversary, count }) => {
        const cost = ROLE_POINT_COSTS[adversary.role] ?? 2;
        return sum + cost * count;
      }, 0),
    [selectedAdversaries]
  );

  const remainingPoints = modifiedPoints - spentPoints;
  const isBalanced = Math.abs(remainingPoints) <= 1;
  const isOverBudget = remainingPoints < -1;

  // Filter adversaries by tier and search
  const filteredAdversaries = useMemo(() => {
    return ADVERSARIES.filter(adv => {
      const tierMatch = adv.tier === partyTier;
      const searchMatch =
        search === '' ||
        adv.name.toLowerCase().includes(search.toLowerCase()) ||
        adv.role.toLowerCase().includes(search.toLowerCase());
      return tierMatch && searchMatch;
    });
  }, [partyTier, search]);

  // Suggested encounters - use deterministic selection (first element)
  const suggestions = useMemo(
    () => getEncounterSuggestions({ partyTier, pcCount }),
    [partyTier, pcCount]
  );

  // Handlers
  const addAdversary = (adversary: Adversary) => {
    setSelectedAdversaries(prev => addAdversarySelection(prev, adversary));
  };

  const removeAdversary = (name: string) => {
    setSelectedAdversaries(prev => removeAdversarySelection(prev, name));
  };

  const applySuggestion = (suggestion: EncounterSuggestion) => {
    setSelectedAdversaries(suggestion.adversaries);
    setShowSuggestions(false);
  };

  const handleConfirm = () => {
    onAddAdversaries(selectedAdversaries);
    setSelectedAdversaries([]);
    onOpenChange(false);
  };

  const reset = () => {
    setSelectedAdversaries([]);
    setSearch('');
    setShowSuggestions(true);
  };

  const handleAddCustomAdversary = (adversary: Adversary) => {
    addAdversary(adversary);
    setShowCustomBuilder(false);
  };

  // Calculate if we can afford the viewing adversary
  const canAffordViewing = viewingAdversary
    ? remainingPoints >= (ROLE_POINT_COSTS[viewingAdversary.role] ?? 2)
    : false;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-full w-full flex-col gap-0 p-0 sm:h-auto sm:max-h-[90vh] sm:max-w-[95vw]">
        <DialogHeader className="border-b bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-amber-500/20">
                <Wand2 className="size-5 text-amber-500" />
              </div>
              <div>
                <DialogTitle className="text-xl">
                  Fight Builder Setup
                </DialogTitle>
                <p className="text-muted-foreground text-sm">
                  Build balanced encounters using Battle Points
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setShowCustomBuilder(true)}
            >
              <PlusCircle className="size-4" />
              Custom Adversary
            </Button>
          </div>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <WizardSidebar
            pcCount={pcCount}
            onPcCountChange={setPcCount}
            partyTier={partyTier}
            onPartyTierChange={setPartyTier}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            baseBattlePoints={baseBattlePoints}
            modifiedPoints={modifiedPoints}
            spentPoints={spentPoints}
            remainingPoints={remainingPoints}
            isBalanced={isBalanced}
            isOverBudget={isOverBudget}
          />

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <AdversarySearchBar
              search={search}
              onSearchChange={setSearch}
              partyTier={partyTier}
              availableCount={filteredAdversaries.length}
            />
            <SuggestionsPanel
              suggestions={suggestions}
              showSuggestions={showSuggestions}
              onShowSuggestions={setShowSuggestions}
              onApplySuggestion={applySuggestion}
            />
            <SelectedAdversariesPanel
              selectedAdversaries={selectedAdversaries}
              onReset={reset}
              onRemove={removeAdversary}
            />
            <AdversaryListGrid
              filteredAdversaries={filteredAdversaries}
              selectedAdversaries={selectedAdversaries}
              remainingPoints={remainingPoints}
              viewingAdversary={viewingAdversary}
              onAdd={addAdversary}
              onRemove={removeAdversary}
              onView={setViewingAdversary}
            />
          </div>

          {/* Detail Panel */}
          <AdversaryDetailPanel
            adversary={viewingAdversary}
            onClose={() => setViewingAdversary(null)}
            onAdd={addAdversary}
            canAdd={canAffordViewing}
          />
        </div>

        <WizardFooter
          isBalanced={isBalanced}
          isOverBudget={isOverBudget}
          spentPoints={spentPoints}
          modifiedPoints={modifiedPoints}
          selectedCount={getSelectedCount(selectedAdversaries)}
          onCancel={() => onOpenChange(false)}
          onConfirm={handleConfirm}
          disableConfirm={selectedAdversaries.length === 0}
        />
      </DialogContent>

      {/* Custom Adversary Builder */}
      <CustomAdversaryBuilder
        isOpen={showCustomBuilder}
        onOpenChange={setShowCustomBuilder}
        onSave={handleAddCustomAdversary}
      />
    </Dialog>
  );
}
