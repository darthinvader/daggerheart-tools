import type { ConditionsState } from '@/components/conditions';
import type { ExperiencesState } from '@/components/experiences';
import type { ProgressionState } from '@/components/shared/progression-display';
import type {
  Gold,
  IdentityFormValues,
  ThresholdsSettings,
} from '@/lib/schemas/character-state';
import type { InventoryState } from '@/lib/schemas/equipment';
import type {
  AncestrySelection,
  CommunitySelection,
} from '@/lib/schemas/identity';
import { DEFAULT_LOADOUT, type LoadoutSelection } from '@/lib/schemas/loadout';

// Empty defaults for a new character - everything starts blank
export const EMPTY_IDENTITY: IdentityFormValues = {
  name: '',
  pronouns: '',
  calling: '',
  description: '',
  background: '',
  descriptionDetails: {},
  connections: [],
};

export const EMPTY_ANCESTRY: AncestrySelection = null;

export const EMPTY_COMMUNITY: CommunitySelection = null;

export const EMPTY_PROGRESSION: ProgressionState = {
  currentLevel: 1,
  currentTier: '1',
  tierHistory: {},
};

export const EMPTY_GOLD: Gold = {
  handfuls: 0,
  bags: 0,
  chests: 0,
  coins: 0,
  showCoins: false,
  displayDenomination: 'handfuls',
};

export const EMPTY_THRESHOLDS: ThresholdsSettings = {
  auto: true,
  autoMajor: true,
  values: { major: 0, severe: 0, critical: 0, dsOverride: false, ds: 0 },
  enableCritical: false,
};

export const EMPTY_INVENTORY: InventoryState = {
  maxSlots: 30,
  items: [],
};

export const EMPTY_LOADOUT: LoadoutSelection = {
  ...DEFAULT_LOADOUT,
  mode: 'class-domains',
  classDomains: [],
  activeCards: [],
  vaultCards: [],
  creationComplete: false,
};

export const EMPTY_EXPERIENCES: ExperiencesState = {
  items: [],
};

export const EMPTY_CONDITIONS: ConditionsState = {
  items: [],
};
