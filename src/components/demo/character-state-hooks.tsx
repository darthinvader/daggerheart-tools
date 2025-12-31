import { useState } from 'react';

import type { AncestrySelection } from '@/components/ancestry-selector';
import type { CharacterNote } from '@/components/character-notes';
import type { CompanionState } from '@/components/companion';
import type { ConditionsState } from '@/components/conditions';
import {
  type CoreScoresState,
  DEFAULT_CORE_SCORES,
} from '@/components/core-scores';
import type { Countdown } from '@/components/countdown-tracker';
import type { DeathMoveState } from '@/components/death-move';
import type { DowntimeActivity } from '@/components/downtime-moves';
import {
  DEFAULT_EQUIPMENT_STATE,
  type EquipmentState,
} from '@/components/equipment';
import type { ExperiencesState } from '@/components/experiences';
import type { InventoryState } from '@/components/inventory';
import type {
  DEFAULT_RESOURCES_STATE,
  ResourcesState,
} from '@/components/resources';
import type { RestState } from '@/components/rest-management';
import type { SessionEntry } from '@/components/session-tracker';
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
import type { Scar } from '@/lib/schemas/session-state';

import {
  buildClassSelection,
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
} from './sample-data';

export interface CharacterSheetState {
  identity: IdentityFormValues;
  ancestry: AncestrySelection;
  community: CommunitySelection;
  classSelection: ClassSelection | null;
  progression: ProgressionState;
  gold: Gold;
  thresholds: ThresholdsSettings;
  equipment: EquipmentState;
  inventory: InventoryState;
  loadout: LoadoutSelection;
  experiences: ExperiencesState;
  conditions: ConditionsState;
  traits: TraitsState;
  coreScores: CoreScoresState;
  resources: ResourcesState;
  unlockedSubclassFeatures: Record<string, string[]>;
  scars: Scar[];
  deathState: DeathMoveState;
  companion: CompanionState | undefined;
  companionEnabled: boolean;
  notes: CharacterNote[];
  restState: RestState;
  countdowns: Countdown[];
  downtimeActivities: DowntimeActivity[];
  sessions: SessionEntry[];
  currentSessionId: string | null;
}

export function useCharacterState(
  defaultResources: typeof DEFAULT_RESOURCES_STATE
) {
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
  const [resources, setResources] = useState<ResourcesState>(defaultResources);
  const [unlockedSubclassFeatures, setUnlockedSubclassFeatures] = useState<
    Record<string, string[]>
  >({});

  return {
    identity,
    setIdentity,
    ancestry,
    setAncestry,
    community,
    setCommunity,
    classSelection,
    setClassSelection,
    progression,
    setProgression,
    gold,
    setGold,
    thresholds,
    setThresholds,
    equipment,
    setEquipment,
    inventory,
    setInventory,
    loadout,
    setLoadout,
    experiences,
    setExperiences,
    conditions,
    setConditions,
    traits,
    setTraits,
    coreScores,
    setCoreScores,
    resources,
    setResources,
    unlockedSubclassFeatures,
    setUnlockedSubclassFeatures,
  };
}

export function useSessionState() {
  const [scars, setScars] = useState<Scar[]>([]);
  const [extraHopeSlots, setExtraHopeSlots] = useState(0);
  const [deathState, setDeathState] = useState<DeathMoveState>({
    isUnconscious: false,
    deathMovePending: false,
    lastDeathMoveResult: undefined,
  });
  const [companion, setCompanion] = useState<CompanionState | undefined>(
    undefined
  );
  const [companionEnabled, setCompanionEnabled] = useState(false);
  const [notes, setNotes] = useState<CharacterNote[]>([]);
  const [restState, setRestState] = useState<RestState>({
    lastShortRest: null,
    lastLongRest: null,
    shortRestsToday: 0,
  });
  const [countdowns, setCountdowns] = useState<Countdown[]>([]);
  const [downtimeActivities, setDowntimeActivities] = useState<
    DowntimeActivity[]
  >([]);
  const [sessions, setSessions] = useState<SessionEntry[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  return {
    scars,
    setScars,
    extraHopeSlots,
    setExtraHopeSlots,
    deathState,
    setDeathState,
    companion,
    setCompanion,
    companionEnabled,
    setCompanionEnabled,
    notes,
    setNotes,
    restState,
    setRestState,
    countdowns,
    setCountdowns,
    downtimeActivities,
    setDowntimeActivities,
    sessions,
    setSessions,
    currentSessionId,
    setCurrentSessionId,
  };
}
