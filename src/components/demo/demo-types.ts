import type { AncestrySelection } from '@/components/ancestry-selector';
import type { CharacterNote } from '@/components/character-notes';
import type { CompanionState } from '@/components/companion';
import type { ConditionsState } from '@/components/conditions';
import type { CoreScoresState } from '@/components/core-scores';
import type { Countdown } from '@/components/countdown-tracker';
import type { DeathMoveState } from '@/components/death-move';
import type { DowntimeActivity } from '@/components/downtime-moves';
import type { EquipmentState } from '@/components/equipment';
import type { ExperiencesState } from '@/components/experiences';
import type { InventoryState } from '@/components/inventory';
import type { ResourcesState } from '@/components/resources';
import type { RestState } from '@/components/rest-management';
import type { HopeWithScarsState } from '@/components/scars';
import type { SessionEntry } from '@/components/session-tracker';
import type { ProgressionState } from '@/components/shared/progression-display';
import type { TraitsState } from '@/components/traits';
import type {
  Gold,
  IdentityFormValues,
  ThresholdsSettings,
} from '@/lib/schemas/character-state';
import type { ClassSelection } from '@/lib/schemas/class-selection';
import type { CommunitySelection } from '@/lib/schemas/identity';
import type { LoadoutSelection } from '@/lib/schemas/loadout';

export interface DemoState {
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
  hopeWithScars: HopeWithScarsState;
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

export interface DemoHandlers {
  setIdentity: (v: IdentityFormValues) => void;
  setAncestry: (v: AncestrySelection) => void;
  setCommunity: (v: CommunitySelection) => void;
  setClassSelection: (v: ClassSelection | null) => void;
  setProgression: (v: ProgressionState) => void;
  setGold: (v: Gold) => void;
  setThresholds: (v: ThresholdsSettings) => void;
  setEquipment: (v: EquipmentState) => void;
  setInventory: (v: InventoryState) => void;
  setLoadout: (v: LoadoutSelection) => void;
  setExperiences: (v: ExperiencesState) => void;
  setConditions: (v: ConditionsState) => void;
  setTraits: (v: TraitsState) => void;
  setCoreScores: (v: CoreScoresState) => void;
  setResources: (v: ResourcesState) => void;
  onLevelUp: () => void;
  setHopeWithScars: (v: HopeWithScarsState) => void;
  setDeathState: (v: DeathMoveState) => void;
  setCompanion: (v: CompanionState | undefined) => void;
  setCompanionEnabled: (v: boolean) => void;
  setNotes: (v: CharacterNote[]) => void;
  setRestState: (v: RestState) => void;
  setCountdowns: (v: Countdown[]) => void;
  setDowntimeActivities: (v: DowntimeActivity[]) => void;
  setSessions: (s: SessionEntry[], id: string | null) => void;
}

export interface TabProps {
  state: DemoState;
  handlers: DemoHandlers;
  isHydrated?: boolean;
}
