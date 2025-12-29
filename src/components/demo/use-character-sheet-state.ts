import { useCallback, useState } from 'react';

import type { AncestrySelection } from '@/components/ancestry-selector';
import type { ConditionsState } from '@/components/conditions';
import {
  type CoreScoresState,
  DEFAULT_CORE_SCORES,
} from '@/components/core-scores';
import {
  DEFAULT_EQUIPMENT_STATE,
  type EquipmentState,
} from '@/components/equipment';
import type { ExperiencesState } from '@/components/experiences';
import type { InventoryState } from '@/components/inventory';
import type { LevelUpResult } from '@/components/level-up';
import {
  DEFAULT_RESOURCES_STATE,
  type ResourcesState,
} from '@/components/resources';
import type { ProgressionState } from '@/components/shared/progression-display';
import { DEFAULT_TRAITS_STATE, type TraitsState } from '@/components/traits';
import type {
  Gold,
  IdentityFormValues,
  ThresholdsSettings,
} from '@/lib/schemas/character-state';
import type { ClassSelection } from '@/lib/schemas/class-selection';
import type { CommunitySelection } from '@/lib/schemas/identity';
import type { LoadoutSelection } from '@/lib/schemas/loadout';

import { processLevelUpResult } from './level-up-handlers';
import {
  SAMPLE_ANCESTRY,
  SAMPLE_COMMUNITY,
  SAMPLE_CONDITIONS,
  SAMPLE_EXPERIENCES,
  SAMPLE_GOLD,
  SAMPLE_IDENTITY,
  SAMPLE_INVENTORY,
  SAMPLE_LOADOUT,
  SAMPLE_PROGRESSION,
  SAMPLE_THRESHOLDS,
  buildClassSelection,
} from './sample-data';

export function useCharacterSheetState() {
  const [identity, setIdentity] = useState<IdentityFormValues>(SAMPLE_IDENTITY);
  const [ancestry, setAncestry] = useState<AncestrySelection>(SAMPLE_ANCESTRY);
  const [community, setCommunity] =
    useState<CommunitySelection>(SAMPLE_COMMUNITY);
  const [classSelection, setClassSelection] = useState<ClassSelection | null>(
    buildClassSelection
  );
  const [progression, setProgression] =
    useState<ProgressionState>(SAMPLE_PROGRESSION);
  const [gold, setGold] = useState<Gold>(SAMPLE_GOLD);
  const [thresholds, setThresholds] =
    useState<ThresholdsSettings>(SAMPLE_THRESHOLDS);
  const [equipment, setEquipment] = useState<EquipmentState>(
    DEFAULT_EQUIPMENT_STATE
  );
  const [inventory, setInventory] = useState<InventoryState>(SAMPLE_INVENTORY);
  const [loadout, setLoadout] = useState<LoadoutSelection>(SAMPLE_LOADOUT);
  const [experiences, setExperiences] =
    useState<ExperiencesState>(SAMPLE_EXPERIENCES);
  const [conditions, setConditions] =
    useState<ConditionsState>(SAMPLE_CONDITIONS);
  const [traits, setTraits] = useState<TraitsState>(DEFAULT_TRAITS_STATE);
  const [coreScores, setCoreScores] =
    useState<CoreScoresState>(DEFAULT_CORE_SCORES);
  const [resources, setResources] = useState<ResourcesState>(
    DEFAULT_RESOURCES_STATE
  );
  const [unlockedSubclassFeatures, setUnlockedSubclassFeatures] = useState<
    Record<string, string[]>
  >({});
  const [isLevelUpOpen, setIsLevelUpOpen] = useState(false);

  const handleLevelUp = useCallback(() => {
    setIsLevelUpOpen(true);
  }, []);

  const handleLevelUpConfirm = useCallback(
    (result: LevelUpResult) => {
      processLevelUpResult(
        result,
        {
          setProgression,
          setThresholds,
          setIsLevelUpOpen,
          setTraits,
          setExperiences,
          setResources,
          setCoreScores,
          setLoadout,
          setClassSelection,
          setUnlockedSubclassFeatures,
        },
        progression.currentTier,
        progression.tierHistory
      );
    },
    [progression.currentTier, progression.tierHistory]
  );

  const currentTraitsForModal = Object.entries(traits).map(([name, val]) => ({
    name,
    marked: val.marked,
  }));

  const currentExperiencesForModal = experiences.items.map(exp => ({
    id: exp.id,
    name: exp.name,
    value: exp.value,
  }));

  const ownedCardNames = [
    ...loadout.activeCards.map(c => c.name),
    ...loadout.vaultCards.map(c => c.name),
  ];

  const state = {
    identity,
    ancestry,
    community,
    classSelection,
    progression,
    gold,
    thresholds,
    equipment,
    inventory,
    loadout,
    experiences,
    conditions,
    traits,
    coreScores,
    resources,
    unlockedSubclassFeatures,
  };

  const handlers = {
    setIdentity,
    setAncestry,
    setCommunity,
    setClassSelection,
    setProgression,
    setGold,
    setThresholds,
    setEquipment,
    setInventory,
    setLoadout,
    setExperiences,
    setConditions,
    setTraits,
    setCoreScores,
    setResources,
    onLevelUp: handleLevelUp,
  };

  return {
    state,
    handlers,
    isLevelUpOpen,
    setIsLevelUpOpen,
    handleLevelUpConfirm,
    currentTraitsForModal,
    currentExperiencesForModal,
    ownedCardNames,
  };
}
