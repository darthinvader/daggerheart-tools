import { ArrowRight, Check, ChevronUp, Lock, Minus, Plus } from 'lucide-react';

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
import { NewExperienceModal } from './new-experience-modal';
import { SubclassUpgradeModal } from './subclass-upgrade-modal';
import { TraitSelectionModal } from './trait-selection-modal';
import {
  type LevelUpOptionConfig,
  type LevelUpSelection,
  type LevelUpSelectionDetails,
  getOptionsForTier,
  getSelectionCount,
  isOptionDisabled,
} from './types';

export interface LevelUpResult {
  newLevel: number;
  newTier: CharacterTier;
  automaticBenefits: {
    experienceGained: boolean;
    experienceName?: string;
    proficiencyGained: boolean;
    traitsCleared: boolean;
    freeDomainCard?: string;
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
  classSelection: ClassSelection | null;
  unlockedSubclassFeatures: Record<string, string[]>;
  ownedCardNames: string[];
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
  classSelection,
  unlockedSubclassFeatures,
  ownedCardNames,
}: LevelUpModalProps) {
  const targetLevel = currentLevel + 1;
  const targetTier = getTierForLevel(targetLevel);
  const tierChanged = targetTier !== currentTier;

  type LevelUpStep = 'automatic-benefits' | 'advancement-options';
  const [currentStep, setCurrentStep] =
    useState<LevelUpStep>('automatic-benefits');
  const [selections, setSelections] = useState<LevelUpSelection[]>([]);
  const [pendingOption, setPendingOption] =
    useState<LevelUpOptionConfig | null>(null);

  const [freeDomainCard, setFreeDomainCard] = useState<string | null>(null);
  const [newExperienceName, setNewExperienceName] = useState<string | null>(
    null
  );
  const [showFreeDomainCardModal, setShowFreeDomainCardModal] = useState(false);
  const [showNewExperienceModal, setShowNewExperienceModal] = useState(false);

  const getsNewExperience =
    targetLevel === 2 || targetLevel === 5 || targetLevel === 8;

  const effectiveTierHistory = tierChanged ? {} : tierHistory;

  const cardsSelectedThisSession = useMemo(() => {
    const cards: string[] = [];
    if (freeDomainCard) cards.push(freeDomainCard);
    const domainCardSelection = selections.find(
      s => s.optionId === 'domain-card'
    );
    if (domainCardSelection?.details?.selectedDomainCard) {
      cards.push(domainCardSelection.details.selectedDomainCard);
    }
    return cards;
  }, [freeDomainCard, selections]);

  const allOwnedCardNames = useMemo(() => {
    return [...ownedCardNames, ...cardsSelectedThisSession];
  }, [ownedCardNames, cardsSelectedThisSession]);

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
      const updatedDetails = existing.details
        ? {
            ...existing.details,
            selectedTraits: existing.details.selectedTraits?.slice(0, -2),
            selectedExperiences: existing.details.selectedExperiences?.slice(
              0,
              -2
            ),
          }
        : undefined;
      return prev.map(s =>
        s.optionId === optionId
          ? { ...s, count: s.count - 1, details: updatedDetails }
          : s
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

  const resetState = useCallback(() => {
    setCurrentStep('automatic-benefits');
    setSelections([]);
    setFreeDomainCard(null);
    setNewExperienceName(null);
    setPendingOption(null);
  }, []);

  const handleConfirm = useCallback(() => {
    const result: LevelUpResult = {
      newLevel: targetLevel,
      newTier: targetTier,
      automaticBenefits: {
        experienceGained: getsNewExperience,
        experienceName: newExperienceName ?? undefined,
        proficiencyGained: getsNewExperience,
        traitsCleared: targetLevel === 5 || targetLevel === 8,
        freeDomainCard: freeDomainCard ?? undefined,
      },
      selections,
    };
    onConfirm(result);
    resetState();
  }, [
    targetLevel,
    targetTier,
    selections,
    onConfirm,
    getsNewExperience,
    newExperienceName,
    freeDomainCard,
    resetState,
  ]);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [onClose, resetState]);

  const canProceedToOptions =
    freeDomainCard !== null &&
    (!getsNewExperience || newExperienceName !== null);

  const handleProceedToOptions = useCallback(() => {
    if (canProceedToOptions) {
      setCurrentStep('advancement-options');
    }
  }, [canProceedToOptions]);

  const alreadySelectedTraitsThisSession = useMemo(() => {
    const traitSelection = selections.find(s => s.optionId === 'traits');
    return traitSelection?.details?.selectedTraits ?? [];
  }, [selections]);

  const alreadyBoostedExperiencesThisSession = useMemo(() => {
    const expSelection = selections.find(s => s.optionId === 'experiences');
    return expSelection?.details?.selectedExperiences ?? [];
  }, [selections]);

  const availableTraitsForSelection = useMemo(() => {
    return currentTraits.filter(
      t => !t.marked && !alreadySelectedTraitsThisSession.includes(t.name)
    );
  }, [currentTraits, alreadySelectedTraitsThisSession]);

  const availableExperiencesForSelection = useMemo(() => {
    const baseExperiences =
      getsNewExperience && newExperienceName
        ? [
            ...currentExperiences,
            { id: `new-exp-${targetLevel}`, name: newExperienceName, value: 2 },
          ]
        : currentExperiences;
    return baseExperiences.filter(
      e => !alreadyBoostedExperiencesThisSession.includes(e.id)
    );
  }, [
    currentExperiences,
    alreadyBoostedExperiencesThisSession,
    getsNewExperience,
    newExperienceName,
    targetLevel,
  ]);

  return (
    <>
      <Dialog
        open={
          isOpen &&
          !pendingOption &&
          !showFreeDomainCardModal &&
          !showNewExperienceModal
        }
        onOpenChange={open => !open && handleClose()}
      >
        <DialogContent className="grid max-h-[90vh] grid-rows-[auto_1fr_auto] gap-0 overflow-hidden p-0 sm:max-w-[600px]">
          <DialogHeader className="shrink-0 border-b p-6 pb-4">
            <DialogTitle className="flex items-center gap-2">
              <ChevronUp className="size-5" />
              Level Up to {targetLevel}
            </DialogTitle>
            <DialogDescription>
              {currentStep === 'automatic-benefits'
                ? 'Complete your automatic level-up benefits'
                : `Choose your advancements for Tier ${TIER_NUMBERS[targetTier] ?? targetTier}`}
            </DialogDescription>
          </DialogHeader>

          {currentStep === 'automatic-benefits' && (
            <div className="space-y-4 overflow-y-auto p-6">
              <section>
                <h4 className="mb-3 font-semibold">✨ Automatic Benefits</h4>
                <div className="space-y-2">
                  {(targetLevel === 2 ||
                    targetLevel === 5 ||
                    targetLevel === 8) && (
                    <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm">
                      <Check className="size-4 text-green-600" />
                      <span>Gain +1 Proficiency</span>
                    </div>
                  )}
                  {(targetLevel === 5 || targetLevel === 8) && (
                    <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm">
                      <Check className="size-4 text-green-600" />
                      <span>Clear all marks on character traits</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm">
                    <Check className="size-4 text-green-600" />
                    <span>Damage thresholds increase by +1</span>
                  </div>
                </div>
              </section>

              <Separator />

              <section>
                <h4 className="mb-3 font-semibold">🎁 Select Your Benefits</h4>
                <div className="space-y-3">
                  <div
                    className={cn(
                      'flex items-center justify-between rounded-lg border p-4 transition-colors',
                      freeDomainCard
                        ? 'border-green-500/50 bg-green-500/10'
                        : 'border-amber-500/50 bg-amber-500/10'
                    )}
                  >
                    <div>
                      <div className="font-medium">Free Domain Card</div>
                      <p className="text-muted-foreground text-sm">
                        {freeDomainCard
                          ? `Selected: ${freeDomainCard}`
                          : 'Choose a domain card of your level or lower'}
                      </p>
                    </div>
                    <Button
                      variant={freeDomainCard ? 'secondary' : 'default'}
                      size="sm"
                      onClick={() => setShowFreeDomainCardModal(true)}
                    >
                      {freeDomainCard ? 'Change' : 'Select'}
                    </Button>
                  </div>

                  {getsNewExperience && (
                    <div
                      className={cn(
                        'flex items-center justify-between rounded-lg border p-4 transition-colors',
                        newExperienceName
                          ? 'border-green-500/50 bg-green-500/10'
                          : 'border-amber-500/50 bg-amber-500/10'
                      )}
                    >
                      <div>
                        <div className="font-medium">New Experience (+2)</div>
                        <p className="text-muted-foreground text-sm">
                          {newExperienceName
                            ? `Added: ${newExperienceName}`
                            : 'Name your new experience'}
                        </p>
                      </div>
                      <Button
                        variant={newExperienceName ? 'secondary' : 'default'}
                        size="sm"
                        onClick={() => setShowNewExperienceModal(true)}
                      >
                        {newExperienceName ? 'Change' : 'Add'}
                      </Button>
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}

          {currentStep === 'advancement-options' && (
            <div className="space-y-6 overflow-y-auto p-6">
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
                    const historyCount = effectiveTierHistory[option.id] ?? 0;
                    const totalCount = currentSelectionCount + historyCount;
                    const isDisabled = isOptionDisabled(
                      option,
                      selections,
                      effectiveTierHistory
                    );
                    const isMaxed = totalCount >= option.maxSelectionsPerTier;
                    const cantAffordMore = option.cost > pointsRemaining;

                    const notEnoughResources =
                      (option.id === 'traits' &&
                        availableTraitsForSelection.length < 2) ||
                      (option.id === 'experiences' &&
                        availableExperiencesForSelection.length < 2);

                    const cantAdd =
                      isDisabled ||
                      isMaxed ||
                      cantAffordMore ||
                      notEnoughResources;

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
                                  ? `${historyCount} from previous level-ups this tier`
                                  : undefined
                              }
                            >
                              Tier: {totalCount}/{option.maxSelectionsPerTier}
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
                            <span className="min-w-6 text-center font-medium">
                              {currentSelectionCount}
                            </span>
                          )}
                          <Button
                            variant={
                              currentSelectionCount > 0
                                ? 'secondary'
                                : 'outline'
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
          )}

          <DialogFooter className="shrink-0 border-t p-4">
            {currentStep === 'automatic-benefits' ? (
              <>
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleProceedToOptions}
                  disabled={!canProceedToOptions}
                  className="gap-2"
                >
                  Continue
                  <ArrowRight className="size-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('automatic-benefits')}
                >
                  Back
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={pointsRemaining !== 0}
                  className="gap-2"
                >
                  <ChevronUp className="size-4" />
                  Confirm Level Up
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DomainCardSelectionModal
        isOpen={showFreeDomainCardModal}
        onClose={() => setShowFreeDomainCardModal(false)}
        onConfirm={cardName => {
          setFreeDomainCard(cardName);
          setShowFreeDomainCardModal(false);
        }}
        targetLevel={targetLevel}
        ownedCardNames={allOwnedCardNames}
      />

      <NewExperienceModal
        isOpen={showNewExperienceModal}
        onClose={() => setShowNewExperienceModal(false)}
        onConfirm={name => {
          setNewExperienceName(name);
          setShowNewExperienceModal(false);
        }}
      />

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
          experiences={availableExperiencesForSelection}
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
          ownedCardNames={allOwnedCardNames}
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
