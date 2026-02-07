import type { HopeWithScarsState } from '@/components/scars';
import type { SessionEntry } from '@/components/session-tracker';

import type {
  useCharacterState,
  useSessionState,
} from './character-state-hooks';

type CharState = ReturnType<typeof useCharacterState>;
type SessState = ReturnType<typeof useSessionState>;

export function buildCharacterSheetState(
  charState: CharState,
  sessionState: SessState,
  hopeWithScars: HopeWithScarsState
) {
  return {
    identity: charState.identity,
    ancestry: charState.ancestry,
    community: charState.community,
    classSelection: charState.classSelection,
    progression: charState.progression,
    gold: charState.gold,
    thresholds: charState.thresholds,
    equipment: charState.equipment,
    inventory: charState.inventory,
    loadout: charState.loadout,
    experiences: charState.experiences,
    conditions: charState.conditions,
    traits: charState.traits,
    coreScores: charState.coreScores,
    resources: charState.resources,
    unlockedSubclassFeatures: charState.unlockedSubclassFeatures,
    hopeWithScars,
    deathState: sessionState.deathState,
    companion: sessionState.companion,
    companionEnabled: sessionState.companionEnabled,
    notes: sessionState.notes,
    restState: sessionState.restState,
    countdowns: sessionState.countdowns,
    downtimeActivities: sessionState.downtimeActivities,
    sessions: sessionState.sessions,
    currentSessionId: sessionState.currentSessionId,
    quickView: sessionState.quickView,
    activeEffects: sessionState.activeEffects,
    beastform: sessionState.beastform,
  };
}

export function buildCharacterSheetHandlers(
  charState: CharState,
  sessionState: SessState,
  handleLevelUp: () => void,
  handleSetHopeWithScars: (s: HopeWithScarsState) => void
) {
  return {
    setIdentity: charState.setIdentity,
    setAncestry: charState.setAncestry,
    setCommunity: charState.setCommunity,
    setClassSelection: charState.setClassSelection,
    setProgression: charState.setProgression,
    setGold: charState.setGold,
    setThresholds: charState.setThresholds,
    setEquipment: charState.setEquipment,
    setInventory: charState.setInventory,
    setLoadout: charState.setLoadout,
    setExperiences: charState.setExperiences,
    setConditions: charState.setConditions,
    setTraits: charState.setTraits,
    setCoreScores: charState.setCoreScores,
    setResources: charState.setResources,
    onLevelUp: handleLevelUp,
    setHopeWithScars: handleSetHopeWithScars,
    setDeathState: sessionState.setDeathState,
    setCompanion: sessionState.setCompanion,
    setCompanionEnabled: sessionState.setCompanionEnabled,
    setNotes: sessionState.setNotes,
    setRestState: sessionState.setRestState,
    setCountdowns: sessionState.setCountdowns,
    setDowntimeActivities: sessionState.setDowntimeActivities,
    setSessions: (s: SessionEntry[], id: string | null) => {
      sessionState.setSessions(s);
      sessionState.setCurrentSessionId(id);
    },
    setQuickView: sessionState.setQuickView,
    setActiveEffects: sessionState.setActiveEffects,
    setBeastform: sessionState.setBeastform,
  };
}
