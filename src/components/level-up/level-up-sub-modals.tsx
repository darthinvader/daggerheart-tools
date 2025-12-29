import type { ClassSubclassPair } from '@/lib/schemas/class-selection';
import type { CharacterTier } from '@/lib/schemas/core';

import { DomainCardSelectionModal } from './domain-card-selection-modal';
import { ExperienceBoostModal } from './experience-boost-modal';
import { MulticlassSelectionModal } from './multiclass-selection-modal';
import { NewExperienceModal } from './new-experience-modal';
import { SubclassUpgradeModal } from './subclass-upgrade-modal';
import { TraitSelectionModal } from './trait-selection-modal';
import type { LevelUpOptionConfig, LevelUpSelectionDetails } from './types';

interface LevelUpSubModalsProps {
  pendingOption: LevelUpOptionConfig | null;
  onPendingClose: () => void;
  onSubModalConfirm: (details: LevelUpSelectionDetails) => void;
  showFreeDomainCardModal: boolean;
  onFreeDomainCardClose: () => void;
  onFreeDomainCardConfirm: (cardName: string) => void;
  showNewExperienceModal: boolean;
  onNewExperienceClose: () => void;
  onNewExperienceConfirm: (name: string) => void;
  targetLevel: number;
  targetTier: CharacterTier;
  allOwnedCardNames: string[];
  availableTraits: { name: string; marked: boolean }[];
  availableExperiences: { id: string; name: string; value: number }[];
  classPairs: ClassSubclassPair[];
  unlockedSubclassFeatures: Record<string, string[]>;
}

export function LevelUpSubModals({
  pendingOption,
  onPendingClose,
  onSubModalConfirm,
  showFreeDomainCardModal,
  onFreeDomainCardClose,
  onFreeDomainCardConfirm,
  showNewExperienceModal,
  onNewExperienceClose,
  onNewExperienceConfirm,
  targetLevel,
  targetTier,
  allOwnedCardNames,
  availableTraits,
  availableExperiences,
  classPairs,
  unlockedSubclassFeatures,
}: LevelUpSubModalsProps) {
  return (
    <>
      <DomainCardSelectionModal
        isOpen={showFreeDomainCardModal}
        onClose={onFreeDomainCardClose}
        onConfirm={onFreeDomainCardConfirm}
        targetLevel={targetLevel}
        ownedCardNames={allOwnedCardNames}
      />

      <NewExperienceModal
        isOpen={showNewExperienceModal}
        onClose={onNewExperienceClose}
        onConfirm={onNewExperienceConfirm}
      />

      {pendingOption?.subModalType === 'traits' && (
        <TraitSelectionModal
          isOpen={!!pendingOption}
          onClose={onPendingClose}
          onConfirm={selectedTraits => onSubModalConfirm({ selectedTraits })}
          unmarkedTraits={availableTraits}
          requiredCount={2}
        />
      )}

      {pendingOption?.subModalType === 'experiences' && (
        <ExperienceBoostModal
          isOpen={!!pendingOption}
          onClose={onPendingClose}
          onConfirm={selectedExperiences =>
            onSubModalConfirm({ selectedExperiences })
          }
          experiences={availableExperiences}
          requiredCount={2}
        />
      )}

      {pendingOption?.subModalType === 'domain-card' && (
        <DomainCardSelectionModal
          isOpen={!!pendingOption}
          onClose={onPendingClose}
          onConfirm={selectedDomainCard =>
            onSubModalConfirm({ selectedDomainCard })
          }
          targetLevel={targetLevel}
          ownedCardNames={allOwnedCardNames}
        />
      )}

      {pendingOption?.subModalType === 'multiclass' && (
        <MulticlassSelectionModal
          isOpen={!!pendingOption}
          onClose={onPendingClose}
          onConfirm={selectedMulticlass =>
            onSubModalConfirm({ selectedMulticlass })
          }
        />
      )}

      {pendingOption?.subModalType === 'subclass' && (
        <SubclassUpgradeModal
          isOpen={!!pendingOption}
          onClose={onPendingClose}
          onConfirm={selectedSubclassUpgrade =>
            onSubModalConfirm({ selectedSubclassUpgrade })
          }
          classes={classPairs}
          unlockedFeatures={unlockedSubclassFeatures}
          targetTier={targetTier}
        />
      )}
    </>
  );
}
