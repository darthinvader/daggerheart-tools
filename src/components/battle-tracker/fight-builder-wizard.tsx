import {
  AlertTriangle,
  Calculator,
  Check,
  ChevronDown,
  HelpCircle,
  Minus,
  Plus,
  Scale,
  Sparkles,
  Swords,
  Target,
  Users,
  Wand2,
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
// Role Point Costs (from Daggerheart SRD)
// =====================================================================================

const ROLE_POINT_COSTS: Record<string, number> = {
  Solo: 4,
  Leader: 3,
  Bruiser: 2,
  Standard: 2,
  Support: 2,
  Ranged: 2,
  Skulk: 2,
  Social: 2,
  Horde: 1,
  Minion: 1,
};

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

interface FightBuilderWizardProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddAdversaries: (
    adversaries: { adversary: Adversary; count: number }[]
  ) => void;
  currentCharacterCount: number;
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

  // Calculations
  const baseBattlePoints = 3 * pcCount + 2;
  const modifiedPoints =
    baseBattlePoints + DIFFICULTY_MODIFIERS[difficulty].modifier;

  const spentPoints = useMemo(() => {
    return selectedAdversaries.reduce((sum, { adversary, count }) => {
      const cost = ROLE_POINT_COSTS[adversary.role] ?? 2;
      return sum + cost * count;
    }, 0);
  }, [selectedAdversaries]);

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
  const suggestions = useMemo(() => {
    const tierAdversaries = ADVERSARIES.filter(adv => adv.tier === partyTier);
    const solos = tierAdversaries.filter(adv => adv.role === 'Solo');
    const standards = tierAdversaries.filter(
      adv => adv.role === 'Standard' || adv.role === 'Bruiser'
    );
    const minions = tierAdversaries.filter(
      adv => adv.role === 'Minion' || adv.role === 'Horde'
    );

    const suggestions: {
      name: string;
      description: string;
      adversaries: SelectedAdversary[];
    }[] = [];

    // Solo Boss Fight
    if (solos.length > 0) {
      const solo = solos[0];
      suggestions.push({
        name: 'Boss Battle',
        description: '1 Solo adversary for a climactic fight',
        adversaries: [{ adversary: solo, count: 1 }],
      });
    }

    // Standard encounter
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

    // Horde fight
    if (minions.length > 0) {
      const min = minions[0];
      suggestions.push({
        name: 'Swarm Encounter',
        description: 'Many weak foes for action-economy fun',
        adversaries: [{ adversary: min, count: Math.max(4, pcCount * 2) }],
      });
    }

    return suggestions;
  }, [partyTier, pcCount]);

  // Handlers
  const addAdversary = (adversary: Adversary) => {
    setSelectedAdversaries(prev => {
      const existing = prev.find(s => s.adversary.name === adversary.name);
      if (existing) {
        return prev.map(s =>
          s.adversary.name === adversary.name ? { ...s, count: s.count + 1 } : s
        );
      }
      return [...prev, { adversary, count: 1 }];
    });
  };

  const removeAdversary = (name: string) => {
    setSelectedAdversaries(prev => {
      const existing = prev.find(s => s.adversary.name === name);
      if (existing && existing.count > 1) {
        return prev.map(s =>
          s.adversary.name === name ? { ...s, count: s.count - 1 } : s
        );
      }
      return prev.filter(s => s.adversary.name !== name);
    });
  };

  const applySuggestion = (suggestion: (typeof suggestions)[0]) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-7xl flex-col gap-0 p-0">
        <DialogHeader className="border-b bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-amber-500/20">
              <Wand2 className="size-5 text-amber-500" />
            </div>
            <div>
              <DialogTitle className="text-xl">
                Fight Builder Wizard
              </DialogTitle>
              <p className="text-muted-foreground text-sm">
                Build balanced encounters using Battle Points
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Configuration */}
          <div className="bg-muted/30 w-80 shrink-0 border-r p-4">
            <div className="space-y-6">
              {/* Party Setup */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-semibold">
                  <Users className="size-4 text-blue-500" />
                  Party Setup
                </Label>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-muted-foreground text-xs">
                      PC Count
                    </Label>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="outline"
                        className="size-8"
                        onClick={() => setPcCount(Math.max(1, pcCount - 1))}
                      >
                        <Minus className="size-3" />
                      </Button>
                      <Input
                        type="number"
                        value={pcCount}
                        onChange={e =>
                          setPcCount(Math.max(1, parseInt(e.target.value) || 1))
                        }
                        className="h-8 w-12 text-center"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        className="size-8"
                        onClick={() => setPcCount(pcCount + 1)}
                      >
                        <Plus className="size-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-muted-foreground text-xs">
                      Party Tier
                    </Label>
                    <div className="flex gap-1">
                      {(['1', '2', '3', '4'] as const).map(t => (
                        <Button
                          key={t}
                          size="sm"
                          variant={partyTier === t ? 'default' : 'outline'}
                          className="h-8 flex-1"
                          onClick={() => setPartyTier(t)}
                        >
                          {t}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Difficulty */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-semibold">
                  <Target className="size-4 text-amber-500" />
                  Difficulty
                </Label>
                <div className="grid grid-cols-1 gap-1.5">
                  {Object.entries(DIFFICULTY_MODIFIERS).map(([key, val]) => (
                    <Button
                      key={key}
                      size="sm"
                      variant={difficulty === key ? 'default' : 'ghost'}
                      className={cn(
                        'h-8 justify-between',
                        difficulty !== key && 'hover:bg-muted'
                      )}
                      onClick={() =>
                        setDifficulty(key as keyof typeof DIFFICULTY_MODIFIERS)
                      }
                    >
                      <span>{val.label}</span>
                      <span className={cn('text-xs', val.color)}>
                        {val.modifier >= 0 ? '+' : ''}
                        {val.modifier} pts
                      </span>
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Battle Points Budget */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-semibold">
                  <Calculator className="size-4 text-emerald-500" />
                  Battle Points
                </Label>

                <Card
                  className={cn(
                    'border-2 transition-colors',
                    isBalanced && 'border-emerald-400 bg-emerald-500/10',
                    isOverBudget && 'border-red-400 bg-red-500/10',
                    !isBalanced &&
                      !isOverBudget &&
                      'border-amber-400 bg-amber-500/10'
                  )}
                >
                  <CardContent className="space-y-2 p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Base (3×{pcCount}+2)
                      </span>
                      <span className="font-mono">{baseBattlePoints}</span>
                    </div>
                    {DIFFICULTY_MODIFIERS[difficulty].modifier !== 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Difficulty
                        </span>
                        <span
                          className={cn(
                            'font-mono',
                            DIFFICULTY_MODIFIERS[difficulty].color
                          )}
                        >
                          {DIFFICULTY_MODIFIERS[difficulty].modifier >= 0
                            ? '+'
                            : ''}
                          {DIFFICULTY_MODIFIERS[difficulty].modifier}
                        </span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex items-center justify-between font-medium">
                      <span>Budget</span>
                      <span className="font-mono text-lg">
                        {modifiedPoints}
                      </span>
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
              </div>

              {/* Role Costs Reference */}
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
                        <span className="font-mono text-amber-500">
                          {cost}pt
                        </span>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>

          {/* Right Panel - Adversary Selection */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Search */}
            <div className="border-b p-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Swords className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                  <Input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder={`Search Tier ${partyTier} adversaries...`}
                    className="pl-9"
                  />
                </div>
                <Badge variant="secondary" className="shrink-0">
                  {filteredAdversaries.length} available
                </Badge>
              </div>
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
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
                      onClick={() => setShowSuggestions(true)}
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
                              onClick={() => applySuggestion(sug)}
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
            )}

            {/* Selected Adversaries */}
            {selectedAdversaries.length > 0 && (
              <div className="bg-muted/30 shrink-0 border-b p-4">
                <div className="mb-2 flex items-center justify-between text-sm font-semibold">
                  <span>
                    Selected (
                    {selectedAdversaries.reduce((s, a) => s + a.count, 0)})
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={reset}
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
                        onClick={() => removeAdversary(adversary.name)}
                      >
                        <Minus className="size-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Adversary List */}
            <ScrollArea className="min-h-0 flex-1">
              <div className="grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAdversaries.map(adv => {
                  const cost = ROLE_POINT_COSTS[adv.role] ?? 2;
                  const canAfford = remainingPoints >= cost;
                  const selected = selectedAdversaries.find(
                    s => s.adversary.name === adv.name
                  );

                  return (
                    <Card
                      key={adv.name}
                      className={cn(
                        'cursor-pointer transition-all hover:shadow-md',
                        selected && 'ring-2 ring-amber-400',
                        !canAfford && !selected && 'opacity-50'
                      )}
                      onClick={() => canAfford && addAdversary(adv)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium">{adv.name}</p>
                            <p className="text-muted-foreground text-xs">
                              {adv.role} · D{adv.difficulty}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className={cn(
                              'shrink-0',
                              cost >= 3 && 'border-red-400 text-red-500',
                              cost === 2 && 'border-amber-400 text-amber-500',
                              cost <= 1 && 'border-emerald-400 text-emerald-500'
                            )}
                          >
                            {cost}pt
                          </Badge>
                        </div>
                        <div className="text-muted-foreground mt-2 flex gap-2 text-xs">
                          <span>HP {adv.hp}</span>
                          <span>·</span>
                          <span>Stress {adv.stress}</span>
                        </div>
                        {selected && (
                          <div className="mt-2 flex items-center justify-between rounded bg-amber-500/20 px-2 py-1">
                            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                              ×{selected.count} selected
                            </span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="size-5"
                              onClick={e => {
                                e.stopPropagation();
                                removeAdversary(adv.name);
                              }}
                            >
                              <Minus className="size-3" />
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>

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
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={selectedAdversaries.length === 0}
                className="gap-2"
              >
                <Swords className="size-4" />
                Add {selectedAdversaries.reduce((s, a) => s + a.count, 0)}{' '}
                Adversaries
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
