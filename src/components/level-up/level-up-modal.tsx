import { Check, ChevronUp, Lock, Minus, Plus } from 'lucide-react';

import { useCallback, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import type {
  ClassSelection,
  ClassSubclassPair,
} from '@/lib/schemas/class-selection';
import type { CharacterTier } from '@/lib/schemas/core';
import { getTierForLevel } from '@/lib/schemas/core';
import { cn } from '@/lib/utils';

import { DomainCardSelectionModal } from './domain-card-selection-modal';
import { ExperienceBoostModal } from './experience-boost-modal';
import { MulticlassSelectionModal } from './multiclass-selection-modal';
import { SubclassUpgradeModal } from './subclass-upgrade-modal';
import { TraitSelectionModal } from './trait-selection-modal';
import {
  type LevelUpOptionConfig,
  type LevelUpSelection,
  type LevelUpSelectionDetails,
  getAutomaticBenefits,
  getOptionsForTier,
  getSelectionCount,
  isOptionDisabled,
} from './types';

export interface LevelUpResult {
  newLevel: number;
  newTier: CharacterTier;
  automaticBenefits: {
    experienceGained: boolean;
    proficiencyGained: boolean;
    traitsCleared: boolean;
  };
  selections: LevelUpSelection[];
}

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (result: LevelUpResult) => void;
  currentLevel: number;
  currentTier: string;
  currentTraits: { name: string; marked: boolean }[];
  currentExperiences: { id: string; name: string; value: number }[];
  tierHistory: Record<string, number>;
  lifetimeHistory: Record<string, number>;
  classSelection: ClassSelection | null;
  unlockedSubclassFeatures: Record<string, string[]>;
}

const POINTS_PER_LEVEL = 2;

const TIER_NUMBERS: Record<string, number> = {
  '1': 1,
  '2-4': 2,
  '5-7': 3,
  '8-10': 4,
};

export function LevelUpModal({
  isOpen,
  onClose,
  onConfirm,
  currentLevel,
  currentTier,
  currentTraits,
  currentExperiences,
  tierHistory,
  lifetimeHistory,
  classSelection,
  unlockedSubclassFeatures,
}: LevelUpModalProps) {
  const targetLevel = currentLevel + 1;
  const targetTier = getTierForLevel(targetLevel);
  const tierChanged = targetTier !== currentTier;

  const [selections, setSelections] = useState<LevelUpSelection[]>([]);
  const [pendingOption, setPendingOption] =
    useState<LevelUpOptionConfig | null>(null);

  const effectiveTierHistory = tierChanged ? {} : tierHistory;

  const classPairs = useMemo<ClassSubclassPair[]>(() => {
    if (!classSelection) return [];
    if (classSelection.classes && classSelection.classes.length > 0) {
      return classSelection.classes;
    }
    return [
      {
        className: classSelection.className,
        subclassName: classSelection.subclassName,
        spellcastTrait: classSelection.spellcastTrait,
      },
    ];
  }, [classSelection]);

  const availableOptions = useMemo(
    () => getOptionsForTier(targetTier),
    [targetTier]
  );
  const automaticBenefits = useMemo(
    () => getAutomaticBenefits(targetLevel, tierChanged),
    [targetLevel, tierChanged]
  );

  const pointsSpent = useMemo(
    () =>
      selections.reduce((sum, sel) => {
        const option = availableOptions.find(o => o.id === sel.optionId);
        return sum + (option?.cost ?? 0) * sel.count;
      }, 0),
    [selections, availableOptions]
  );

  const pointsRemaining = POINTS_PER_LEVEL - pointsSpent;

  const handleSelectOption = useCallback((option: LevelUpOptionConfig) => {
    if (option.requiresSubModal) {
      setPendingOption(option);
      return;
    }

    setSelections(prev => {
      const existing = prev.find(s => s.optionId === option.id);
      if (existing) {
        return prev.map(s =>
          s.optionId === option.id ? { ...s, count: s.count + 1 } : s
        );
      }
      return [...prev, { optionId: option.id, count: 1 }];
    });
  }, []);

  const handleRemoveSelection = useCallback((optionId: string) => {
    setSelections(prev => {
      const existing = prev.find(s => s.optionId === optionId);
      if (!existing) return prev;
      if (existing.count <= 1) {
        return prev.filter(s => s.optionId !== optionId);
      }
      return prev.map(s =>
        s.optionId === optionId ? { ...s, count: s.count - 1 } : s
      );
    });
  }, []);

  const handleSubModalConfirm = useCallback(
    (details: LevelUpSelectionDetails) => {
      if (!pendingOption) return;

      setSelections(prev => {
        const existing = prev.find(s => s.optionId === pendingOption.id);
        if (existing) {
          const mergedDetails: LevelUpSelectionDetails = {
            selectedTraits: [
              ...(existing.details?.selectedTraits ?? []),
              ...(details.selectedTraits ?? []),
            ],
            selectedExperiences: [
              ...(existing.details?.selectedExperiences ?? []),
              ...(details.selectedExperiences ?? []),
            ],
            selectedDomainCard:
              details.selectedDomainCard ??
              existing.details?.selectedDomainCard,
            selectedMulticlass:
              details.selectedMulticlass ??
              existing.details?.selectedMulticlass,
            selectedSubclassUpgrade:
              details.selectedSubclassUpgrade ??
              existing.details?.selectedSubclassUpgrade,
          };
          return prev.map(s =>
            s.optionId === pendingOption.id
              ? { ...s, count: s.count + 1, details: mergedDetails }
              : s
          );
        }
        return [...prev, { optionId: pendingOption.id, count: 1, details }];
      });
      setPendingOption(null);
    },
    [pendingOption]
  );

  const handleConfirm = useCallback(() => {
    const result: LevelUpResult = {
      newLevel: targetLevel,
      newTier: targetTier,
      automaticBenefits: {
        experienceGained:
          targetLevel === 2 || targetLevel === 5 || targetLevel === 8,
        proficiencyGained:
          targetLevel === 2 || targetLevel === 5 || targetLevel === 8,
        traitsCleared: targetLevel === 5 || targetLevel === 8,
      },
      selections,
    };
    onConfirm(result);
    setSelections([]);
  }, [targetLevel, targetTier, selections, onConfirm]);

  const handleClose = useCallback(() => {
    setSelections([]);
    onClose();
  }, [onClose]);

  const alreadySelectedTraitsThisSession = useMemo(() => {
    const traitSelection = selections.find(s => s.optionId === 'traits');
    return traitSelection?.details?.selectedTraits ?? [];
  }, [selections]);

  const availableTraitsForSelection = useMemo(() => {
    return currentTraits.filter(
      t => !t.marked && !alreadySelectedTraitsThisSession.includes(t.name)
    );
  }, [currentTraits, alreadySelectedTraitsThisSession]);

  return (
    <>
      <Dialog
        open={isOpen && !pendingOption}
        onOpenChange={open => !open && handleClose()}
      >
        <DialogContent className="grid max-h-[90vh] grid-rows-[auto_1fr_auto] gap-0 overflow-hidden p-0 sm:max-w-[600px]">
          <DialogHeader className="shrink-0 border-b p-6 pb-4">
            <DialogTitle className="flex items-center gap-2">
              <ChevronUp className="size-5" />
              Level Up to {targetLevel}
            </DialogTitle>
            <DialogDescription>
              Choose your advancements for Tier{' '}
              {TIER_NUMBERS[targetTier] ?? targetTier}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 overflow-y-auto p-6">
            <section>
              <h4 className="mb-3 font-semibold">✨ Automatic Benefits</h4>
              <div className="space-y-2">
                {automaticBenefits.map((benefit, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm"
                  >
                    <Check className="size-4 text-green-600" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            <section>
              <div className="mb-3 flex items-center justify-between">
                <h4 className="font-semibold">🎯 Choose Advancements</h4>
                <Badge
                  variant={pointsRemaining > 0 ? 'default' : 'secondary'}
                  className="text-sm"
                >
                  {pointsRemaining} / {POINTS_PER_LEVEL} points
                </Badge>
              </div>

              <div className="space-y-2">
                {availableOptions.map(option => {
                  const currentSelectionCount = getSelectionCount(
                    option.id,
                    selections
                  );
                  const isLifetime = option.maxScope === 'lifetime';
                  const relevantHistory = isLifetime
                    ? lifetimeHistory
                    : effectiveTierHistory;
                  const historyCount = relevantHistory[option.id] ?? 0;
                  const totalCount = currentSelectionCount + historyCount;
                  const isDisabled = isOptionDisabled(
                    option,
                    selections,
                    effectiveTierHistory
                  );
                  const isMaxed = totalCount >= option.maxSelections;
                  const cantAffordMore = option.cost > pointsRemaining;
                  const cantAdd = isDisabled || isMaxed || cantAffordMore;

                  return (
                    <div
                      key={option.id}
                      className={cn(
                        'flex items-center justify-between rounded-lg border p-3 transition-colors',
                        currentSelectionCount > 0 &&
                          'border-primary bg-primary/10',
                        cantAdd && currentSelectionCount === 0 && 'opacity-50'
                      )}
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">{option.label}</span>
                          <Badge variant="outline" className="text-xs">
                            {option.cost} {option.cost === 1 ? 'pt' : 'pts'}
                          </Badge>
                          <Badge
                            variant={isMaxed ? 'destructive' : 'secondary'}
                            className="text-xs"
                            title={
                              historyCount > 0
                                ? `${historyCount} from previous level-ups${isLifetime ? '' : ' this tier'}`
                                : undefined
                            }
                          >
                            {isLifetime ? 'Total' : 'Tier'}: {totalCount}/
                            {option.maxSelections}
                          </Badge>
                          {isDisabled && (
                            <Lock className="text-muted-foreground size-3" />
                          )}
                        </div>
                        <p className="text-muted-foreground mt-1 text-sm">
                          {option.description}
                        </p>
                      </div>

                      <div className="ml-4 flex items-center gap-2">
                        {currentSelectionCount > 0 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveSelection(option.id)}
                          >
                            <Minus className="size-4" />
                          </Button>
                        )}
                        {currentSelectionCount > 0 && (
                          <span className="min-w-[1.5rem] text-center font-medium">
                            {currentSelectionCount}
                          </span>
                        )}
                        <Button
                          variant={
                            currentSelectionCount > 0 ? 'secondary' : 'outline'
                          }
                          size="icon"
                          disabled={cantAdd}
                          onClick={() => handleSelectOption(option)}
                        >
                          <Plus className="size-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <DialogFooter className="shrink-0 border-t p-4">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={pointsRemaining !== 0}
              className="gap-2"
            >
              <ChevronUp className="size-4" />
              Confirm Level Up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {pendingOption?.subModalType === 'traits' && (
        <TraitSelectionModal
          isOpen={!!pendingOption}
          onClose={() => setPendingOption(null)}
          onConfirm={selectedTraits =>
            handleSubModalConfirm({ selectedTraits })
          }
          unmarkedTraits={availableTraitsForSelection}
          requiredCount={2}
        />
      )}

      {pendingOption?.subModalType === 'experiences' && (
        <ExperienceBoostModal
          isOpen={!!pendingOption}
          onClose={() => setPendingOption(null)}
          onConfirm={selectedExperiences =>
            handleSubModalConfirm({ selectedExperiences })
          }
          experiences={currentExperiences}
          requiredCount={2}
        />
      )}

      {pendingOption?.subModalType === 'domain-card' && (
        <DomainCardSelectionModal
          isOpen={!!pendingOption}
          onClose={() => setPendingOption(null)}
          onConfirm={selectedDomainCard =>
            handleSubModalConfirm({ selectedDomainCard })
          }
          targetLevel={targetLevel}
        />
      )}

      {pendingOption?.subModalType === 'multiclass' && (
        <MulticlassSelectionModal
          isOpen={!!pendingOption}
          onClose={() => setPendingOption(null)}
          onConfirm={selectedMulticlass =>
            handleSubModalConfirm({ selectedMulticlass })
          }
        />
      )}

      {pendingOption?.subModalType === 'subclass' && (
        <SubclassUpgradeModal
          isOpen={!!pendingOption}
          onClose={() => setPendingOption(null)}
          onConfirm={selectedSubclassUpgrade =>
            handleSubModalConfirm({ selectedSubclassUpgrade })
          }
          classes={classPairs}
          unlockedFeatures={unlockedSubclassFeatures}
          targetTier={targetTier}
        />
      )}
    </>
  );
}
